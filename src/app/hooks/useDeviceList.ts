// useDeviceList.ts
import { useState } from "react";
import { Device } from "./types";

// ===============================================
// useDeviceList Hook
// ===============================================
export function useDeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);

  // ===============================================
  // Tambah Device
  // ===============================================
  const addDevice = (device: Device) => {
    setDevices((prev) => [...prev, device]);
  };

  // ===============================================
  // Hapus Device
  // ===============================================
  const deleteDevice = (deviceId: string) => {
    setDevices((prev) => prev.filter((d) => d.deviceId !== deviceId));
  };

  // ===============================================
  // Update Device (jika perlu)
  // ===============================================
  const updateDevice = (updatedDevice: Device) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.deviceId === updatedDevice.deviceId ? updatedDevice : d
      )
    );
  };

  // ===============================================
  // Return Object
  // ===============================================
  return {
    devices,
    setDevices,
    addDevice,
    deleteDevice, // tambahkan di sini
    updateDevice, // tambahkan di sini
  };
}
