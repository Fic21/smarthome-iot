import { useState } from "react";
import { Device } from "@/typesuser";

export function useDeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);

  const addDevice = (device: Device) => {
    setDevices((prev) => [...prev, device]);
  };

  return {
    devices,
    setDevices,
    addDevice,
  };
}
