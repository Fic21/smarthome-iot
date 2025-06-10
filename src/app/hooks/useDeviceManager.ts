import { useState, useEffect } from "react";
import { useDeviceForm } from "./useDeviceForm";
import { useDeviceList } from "./useDeviceList";
import { useDeviceView } from "./useDeviceView";
import { publisherOptions } from "./publisherOptions";
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "@/libstorageHelper";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY = "device_manager_devices";

export function useDeviceManager() {
  const [devices, setDevices] = useState(
    () => loadFromLocalStorage(LOCAL_STORAGE_KEY) || []
  );

  useEffect(() => {
    if (devices.length === 0) {
      removeFromLocalStorage(LOCAL_STORAGE_KEY);
    } else {
      saveToLocalStorage(LOCAL_STORAGE_KEY, devices);
    }
  }, [devices]);

  const deviceForm = useDeviceForm();
  const deviceList = useDeviceList();
  const deviceView = useDeviceView();
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null
  );

  const handleSave = async () => {
    const manualBrokerUrl = "ws://localhost:8083/mqtt";
    const manualBrokerPort = "1883";

    if (!deviceView.view) return;
    if (!deviceForm.form.topic.trim()) return;

    const currentUserId = Number(localStorage.getItem("currentUserId"));
    if (!currentUserId) {
      alert("User belum login, silakan login terlebih dahulu.");
      return;
    }

    const payload = {
      userId: currentUserId,
      deviceId: deviceForm.form.deviceId || "",
      topic: deviceForm.form.topic,
      type: deviceView.view,
    };

    try {
      const res = await fetch("/api/mqtt/generateJwt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate token");

      const tokenData = await res.json();

      let finalDevice;
      if (deviceForm.form.deviceId) {
        // EDIT existing device
        setDevices((prevDevices) =>
          prevDevices.map((dev) =>
            dev.deviceId === deviceForm.form.deviceId
              ? {
                  ...dev,
                  name:
                    deviceForm.form.name || selectedPublisher || "Publisher",
                  topic: deviceForm.form.topic,
                  type: deviceView.view,
                  category: selectedPublisher || undefined,
                  inputtambahan:
                    deviceForm.selectedInputTambahan.length > 0
                      ? deviceForm.selectedInputTambahan
                      : undefined,
                  mqttBrokerUrl: manualBrokerUrl,
                  mqttBrokerPort: Number(manualBrokerPort),
                  mqttToken: tokenData.token,
                  mqttTokenExpiry: tokenData.expiry,
                  userId: Number(currentUserId),
                }
              : dev
          )
        );

        deviceList.updateDevice({
          deviceId: deviceForm.form.deviceId,
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: deviceForm.form.topic,
          type: deviceView.view,
          category: selectedPublisher || undefined,
          inputtambahan:
            deviceForm.selectedInputTambahan.length > 0
              ? deviceForm.selectedInputTambahan
              : undefined,
          mqttBrokerUrl: manualBrokerUrl,
          mqttBrokerPort: Number(manualBrokerPort),
          mqttToken: tokenData.token,
          mqttTokenExpiry: tokenData.expiry,
          userId: Number(currentUserId),
        });

        // Prepare payload for POST
        finalDevice = {
          deviceId: deviceForm.form.deviceId,
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: deviceForm.form.topic,
          type: deviceView.view,
          // inputtambahan:
          //   deviceForm.selectedInputTambahan.length > 0
          //     ? deviceForm.selectedInputTambahan
          //     : undefined,
          inputtambahan:
            deviceForm.selectedInputTambahan.length > 0
              ? deviceForm.selectedInputTambahan.reduce((acc, item) => {
                  acc[item.key] = item.value;
                  return acc;
                }, {})
              : null,
          userId: Number(currentUserId),
          mqttBrokerUrl: manualBrokerUrl,
          mqttBrokerPort: Number(manualBrokerPort),
          mqttToken: tokenData.token,
          mqttTokenExpiry: tokenData.expiry,
        };
      } else {
        // ADD new device
        const newDeviceId = uuidv4();
        const newDevice = {
          userId: Number(currentUserId),
          deviceId: newDeviceId,
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: deviceForm.form.topic,
          type: deviceView.view,
          category: selectedPublisher || undefined,
          inputtambahan:
            deviceForm.selectedInputTambahan.length > 0
              ? deviceForm.selectedInputTambahan
              : undefined,
          mqttBrokerUrl: manualBrokerUrl,
          mqttBrokerPort: Number(manualBrokerPort),
          mqttToken: tokenData.token,
          mqttTokenExpiry: tokenData.expiry,
        };

        setDevices((prevDevices) => [...prevDevices, newDevice]);
        deviceList.addDevice(newDevice);

        // Prepare payload for POST
        finalDevice = {
          deviceId: newDeviceId,
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: deviceForm.form.topic,
          type: deviceView.view,
          inputtambahan:
            deviceForm.selectedInputTambahan.length > 0
              ? deviceForm.selectedInputTambahan
              : undefined,
          userId: Number(currentUserId),
          mqttBrokerUrl: manualBrokerUrl,
          mqttBrokerPort: Number(manualBrokerPort),
          mqttToken: tokenData.token,
          mqttTokenExpiry: tokenData.expiry,
        };
      }

      // Kirim finalDevice ke endpoint JSON (POST)
      await fetch("/api/devices/deviceConfiguration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalDevice),
      });

      // Reset form
      deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
      setSelectedPublisher(null);
      deviceView.setView(null);
      deviceForm.setSelectedInputTambahan([]);
    } catch (error) {
      alert("Gagal generate token: " + error.message);
    }
  };

  const handleDelete = (deviceId: string) => {
    setDevices((prevDevices) =>
      prevDevices.filter((dev) => dev.deviceId !== deviceId)
    );
    deviceList.deleteDevice(deviceId);

    if (deviceView.detail && deviceView.detail.deviceId === deviceId) {
      deviceView.setDetail(null);
    }

    // Jika sedang edit device yang dihapus, reset form
    if (deviceForm.form.deviceId === deviceId) {
      deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
      setSelectedPublisher(null);
      deviceView.setView(null);
      deviceForm.setSelectedInputTambahan([]);
    }
  };

  // Fungsi untuk mengisi form saat edit device
  const handleEdit = (deviceId: string) => {
    const deviceToEdit = devices.find((dev) => dev.deviceId === deviceId);
    if (!deviceToEdit) return;

    deviceForm.setForm({
      deviceId: deviceToEdit.deviceId,
      name: deviceToEdit.name,
      topic: deviceToEdit.topic,
    });
    deviceView.setView(deviceToEdit.type);
    setSelectedPublisher(
      deviceToEdit.type === "publisher" ? deviceToEdit.category || null : null
    );
    deviceForm.setSelectedInputTambahan(deviceToEdit.inputtambahan || []);
    deviceView.setDetail(null);
  };

  return {
    ...deviceForm,
    ...deviceList,
    ...deviceView,
    selectedPublisher,
    setSelectedPublisher,
    publisherOptions,
    devices,
    setDevices,
    handleSave,
    handleDelete,
    handleEdit,
  };
}
