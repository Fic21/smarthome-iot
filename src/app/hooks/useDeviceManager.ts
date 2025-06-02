import { useState, useEffect } from "react"; // ✅ Tambahkan useEffect di import
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
  // ✅ Tambahkan state devices agar useEffect tidak error
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

  // Hook kecil diimport dan dipanggil di sini
  const deviceForm = useDeviceForm();
  const deviceList = useDeviceList();
  const deviceView = useDeviceView();
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null
  );

  // Fungsi handleSave gabungkan state dari semua hook kecil
  const handleSave = () => {
    if (!deviceView.view) return;
    if (!deviceForm.form.topic.trim()) return;

    //devinisikan currentUserId dan cek kondisi
    const currentUserId = localStorage.getItem("currentUserId");
    
    if (!currentUserId) {
      alert("User belum login, silakan login terlebih dahulu.");
      return; // stop fungsi handleSave
    }

    
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

    // ✅ Tambahkan device baru ke state devices
    setDevices((prevDevices) => [...prevDevices, newDevice]);

    deviceList.addDevice(newDevice);

    // Reset semua form dan state terkait
    deviceForm.setForm({ name: "", topic: "" });
    setSelectedPublisher(null);
    deviceView.setView(null);
    deviceForm.setSelectedInputTambahan([]);
  };

  // Return gabungan semua state dan fungsi dari hook-hook kecil
  return {
    ...deviceForm,
    ...deviceList,
    ...deviceView,
    selectedPublisher,
    setSelectedPublisher,
    publisherOptions,
    devices, // Return state devices agar bisa digunakan di komponen
    setDevices, // Return setDevices agar bisa dipakai di hook lain
    handleSave,
  };
}
