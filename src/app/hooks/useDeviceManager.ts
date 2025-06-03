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

  const handleSave = () => {
    if (!deviceView.view) return;
    if (!deviceForm.form.topic.trim()) return;

    const currentUserId = localStorage.getItem("currentUserId");

    if (!currentUserId) {
      alert("User belum login, silakan login terlebih dahulu.");
      return;
    }

    if (deviceForm.form.deviceId) {
      // EDIT existing device
      setDevices((prevDevices) =>
        prevDevices.map((dev) =>
          dev.deviceId === deviceForm.form.deviceId
            ? {
                ...dev,
                name: deviceForm.form.name || selectedPublisher || "Publisher",
                topic: deviceForm.form.topic,
                type: deviceView.view,
                category: selectedPublisher || undefined,
                inputtambahan:
                  deviceForm.selectedInputTambahan.length > 0
                    ? deviceForm.selectedInputTambahan
                    : undefined,
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
        inputtambahan: deviceForm.selectedInputTambahan.length > 0
          ? deviceForm.selectedInputTambahan
          : undefined,
      });
    } else {
      // ADD new device
      const newDevice = {
        userId: currentUserId,
        deviceId: uuidv4(),
        name: deviceForm.form.name || selectedPublisher || "Publisher",
        topic: deviceForm.form.topic,
        type: deviceView.view,
        category: selectedPublisher || undefined,
        inputtambahan:
          deviceForm.selectedInputTambahan.length > 0
            ? deviceForm.selectedInputTambahan
            : undefined,
      };

      setDevices((prevDevices) => [...prevDevices, newDevice]);
      deviceList.addDevice(newDevice);
    }

    // Reset semua form dan state terkait
    deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
    setSelectedPublisher(null);
    deviceView.setView(null);
    deviceForm.setSelectedInputTambahan([]);
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
