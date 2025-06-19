import { useState, useEffect } from "react";
import { useDeviceForm } from "./useDeviceForm";
import { useDeviceList } from "./useDeviceList";
import { useDeviceView } from "./useDeviceView";
import { publisherOptions } from "./publisherOptions";
import { subscriberOptions } from "./subscriberOptions";
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
   const [selectedSubscriber, setSelectedSubscriber] = useState<string | null>(
    null
  );

  const fetchData = async () => {
  try {
    const res = await fetch("/api/devices/deviceConfiguration", {
      method: "GET", // tambahkan GET supaya lebih eksplisit
    });

    if (!res.ok) {
      throw new Error("Gagal ambil data dari server!");
    }

    const data = await res.json();

 

    setDevices(data);
  } catch (error: any) {
    console.error("Gagal fetch devices:", error);
    alert(`Gagal fetch devices: ${error.message}`);
  }
};


  const handleSave = async () => {
    const manualBrokerUrl = "ws://localhost:8083/mqtt";
    // const manualBrokerUrl = "tcp://192.168.118.204:8083/mqtt";
    const manualBrokerPort = "1883";

    if (!deviceView.view) return;
    if (!deviceForm.form.topic.trim()) return;

    const currentUserId = Number(localStorage.getItem("currentUserId"));
    const currentUserName = String(localStorage.getItem("currentUserName"));
    if (!currentUserId) {
      alert("User belum login, silakan login terlebih dahulu.");
      return;
    }

    const payloadJwt= {
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
        body: JSON.stringify(payloadJwt),
      });

      if (!res.ok) throw new Error("Failed to generate token");

      const tokenData = await res.json();

      if (deviceForm.form.deviceId) {
        // EDIT existing device
        setDevices((prevDevices) =>
          prevDevices.map((dev) =>
            dev.deviceId === deviceForm.form.deviceId
              ? {
                  ...dev,
                  name:
                    deviceForm.form.name,
                  topic: `${currentUserName}/${deviceForm.form.topic}`,
                  type: deviceView.view,
                  category: selectedPublisher || selectedSubscriber,
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
          name: deviceForm.form.name,
          topic: `${currentUserName}/${deviceForm.form.topic}`,
          type: deviceView.view,
          category: selectedPublisher || selectedSubscriber,
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

        // Tambahkan PUT ke endpoint deviceConfiguration
        const putPayload = {
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: `${currentUserName}/${deviceForm.form.topic}`,
          type: deviceView.view,
          category:selectedPublisher||selectedSubscriber,
          inputtambahan:
            deviceForm.selectedInputTambahan.length > 0
              ? deviceForm.selectedInputTambahan
              : undefined,
          mqttBrokerUrl: manualBrokerUrl,
          mqttBrokerPort: Number(manualBrokerPort),
          mqttToken: tokenData.token,
          mqttTokenExpiry: tokenData.expiry,
        };

        await fetch(
          `/api/devices/deviceConfiguration?deviceId=${deviceForm.form.deviceId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(putPayload),
          }
        ).catch((err) => {
          console.error("Failed PUT request:", err);
        });
      } else {
        // ADD new device
        const newDeviceId = uuidv4();
        const newDevice = {
          userId: Number(currentUserId),
          deviceId: newDeviceId,
          name: deviceForm.form.name || selectedPublisher || "Publisher",
          topic: `${currentUserName}/${deviceForm.form.topic}`,
          type: deviceView.view,
          category: selectedPublisher || selectedSubscriber,
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

        // Tambahkan POST ke endpoint deviceConfiguration
        const postPayload = {
          deviceId: newDeviceId,
          name: deviceForm.form.name,
          topic: `${currentUserName}/${deviceForm.form.topic}`,
          type: deviceView.view,
          category: selectedPublisher||selectedSubscriber,
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

        await fetch("/api/devices/deviceConfiguration", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postPayload),
        }).catch((err) => {
          console.error("Failed POST request:", err);
        });
      }

      // Reset form
      deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
      setSelectedPublisher(null);
      setSelectedSubscriber(null);
      deviceView.setView(null);
      deviceForm.setSelectedInputTambahan([]);
    } catch (error) {
      alert("Gagal generate token: " + error.message);
    }
  };

  const handleDelete = async (deviceId: string) => {
    try {
      // Panggil endpoint API delete
      const res = await fetch(
        `/api/devices/deviceConfiguration?deviceId=${deviceId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Terjadi kesalahan saat menghapus device di server.");
      }

      // alert("Device berhasil dihapus dari server.");

      // Logika lama tetap dipertahankan
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
        setSelectedSubscriber(null);
        deviceView.setView(null);
        deviceForm.setSelectedInputTambahan([]);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus: " + error.message);
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

  if (deviceToEdit.type === "publisher") {
    setSelectedPublisher(deviceToEdit.category || null);
    setSelectedSubscriber(null);
  } else if (deviceToEdit.type === "subscriber") {
    setSelectedSubscriber(deviceToEdit.category || null);
    setSelectedPublisher(null);
  } else {
    setSelectedPublisher(null);
    setSelectedSubscriber(null);
  }

  deviceForm.setSelectedInputTambahan(deviceToEdit.inputtambahan || []);
  deviceView.setDetail(null);
};


  return {
    ...deviceForm,
    ...deviceList,
    ...deviceView,
    selectedPublisher,
    setSelectedPublisher,
    selectedSubscriber,
    setSelectedSubscriber,
    publisherOptions,
    subscriberOptions,
    devices,
    setDevices,
    handleSave,
    handleDelete,
    handleEdit,
    fetchData,
  };
}

//   const handleSave = async () => {
//   const manualBrokerUrl = "ws://localhost:8083/mqtt";
//   const manualBrokerPort = "1883";

//   if (!deviceView.view) return;
//   if (!deviceForm.form.topic.trim()) return;

//   const currentUserId = Number(localStorage.getItem("currentUserId"));
//   if (!currentUserId) {
//     alert("User belum login, silakan login terlebih dahulu.");
//     return;
//   }

//   // Siapkan payload untuk fetch token
//   const payload = {
//     userId: currentUserId,
//     deviceId: deviceForm.form.deviceId || "",  // Jika ADD, kirim "" ke backend (backend handle sendiri)
//     topic: deviceForm.form.topic,
//     type: deviceView.view,
//   };

//   try {
//     const res = await fetch("/api/mqtt/generateJwt", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) throw new Error("Failed to generate token");

//     const tokenData = await res.json();

//     if (deviceForm.form.deviceId) {
//       // EDIT existing device
//       setDevices((prevDevices) =>
//         prevDevices.map((dev) =>
//           dev.deviceId === deviceForm.form.deviceId
//             ? {
//                 ...dev,
//                 name: deviceForm.form.name || selectedPublisher || "Publisher",
//                 topic: deviceForm.form.topic,
//                 type: deviceView.view,
//                 category: selectedPublisher || undefined,
//                 inputtambahan:
//                   deviceForm.selectedInputTambahan.length > 0
//                     ? deviceForm.selectedInputTambahan
//                     : undefined,
//                 mqttBrokerUrl: manualBrokerUrl,
//                 mqttBrokerPort: Number(manualBrokerPort),
//                 mqttToken: tokenData.token,
//                 mqttTokenExpiry: tokenData.expiry,
//                 userId: Number(currentUserId),
//               }
//             : dev
//         )
//       );

//       // Update to deviceList
//       deviceList.updateDevice({
//         deviceId: deviceForm.form.deviceId,
//         name: deviceForm.form.name || selectedPublisher || "Publisher",
//         topic: deviceForm.form.topic,
//         type: deviceView.view,
//         category: selectedPublisher || undefined,
//         inputtambahan:
//           deviceForm.selectedInputTambahan.length > 0
//             ? deviceForm.selectedInputTambahan
//             : undefined,
//         mqttBrokerUrl: manualBrokerUrl,
//         mqttBrokerPort: Number(manualBrokerPort),
//         mqttToken: tokenData.token,
//         mqttTokenExpiry: tokenData.expiry,
//         userId: Number(currentUserId),
//       });
//     } else {
//       // ADD new device
//       const newDeviceId = uuidv4();
//       const newDevice = {
//         userId: Number(currentUserId),
//         deviceId: newDeviceId,
//         name: deviceForm.form.name || selectedPublisher || "Publisher",
//         topic: deviceForm.form.topic,
//         type: deviceView.view,
//         category: selectedPublisher || undefined,
//         inputtambahan:
//           deviceForm.selectedInputTambahan.length > 0
//             ? deviceForm.selectedInputTambahan
//             : undefined,
//         mqttBrokerUrl: manualBrokerUrl,
//         mqttBrokerPort: Number(manualBrokerPort),
//         mqttToken: tokenData.token,
//         mqttTokenExpiry: tokenData.expiry,
//       };

//       // Tambahkan ke state agar card muncul
//       setDevices((prevDevices) => [...prevDevices, newDevice]);

//       // Simpan ke deviceList
//       deviceList.addDevice(newDevice);
//     }

//     // Reset form dan state
//     deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
//     setSelectedPublisher(null);
//     deviceView.setView(null);
//     deviceForm.setSelectedInputTambahan([]);

//   } catch (error) {
//     alert("Gagal generate token: " + error.message);
//   }
// };

// const handleDelete = (deviceId: string) => {
//   setDevices((prevDevices) =>
//     prevDevices.filter((dev) => dev.deviceId !== deviceId)
//   );
//   deviceList.deleteDevice(deviceId);

//   if (deviceView.detail && deviceView.detail.deviceId === deviceId) {
//     deviceView.setDetail(null);
//   }

//   // Jika sedang edit device yang dihapus, reset form
//   if (deviceForm.form.deviceId === deviceId) {
//     deviceForm.setForm({ name: "", topic: "", deviceId: undefined });
//     setSelectedPublisher(null);
//     deviceView.setView(null);
//     deviceForm.setSelectedInputTambahan([]);
//   }
// };
