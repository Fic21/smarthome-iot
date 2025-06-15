export interface MqttDeviceConfig {
  id: string;
  name: string;
  topic: string;
  type: string; // publisher / subscriber
  category?: string;
  inputtambahan?: any;
  mqttBrokerUrl: string;
  mqttBrokerPort: number;
  mqttToken: string;
  mqttTokenExpiry: number;
  userId: number;
}

// Ambil semua device dari localStorage, validasi properti wajib
export function getAllMqttDevices(): MqttDeviceConfig[] {
  const data = localStorage.getItem("device_manager_devices");
  if (!data) return [];
  try {
    const parsed = JSON.parse(data) as MqttDeviceConfig[];
    // Filter device yang lengkap (minimal ada mqttBrokerUrl, mqttToken, id, topic, type)
    return parsed.filter(
      (d) =>
        typeof d.mqttBrokerUrl === "string" &&
        d.mqttBrokerUrl.trim() !== "" &&
        typeof d.mqttToken === "string" &&
        d.mqttToken.trim() !== "" &&
        typeof d.id === "string" &&
        typeof d.topic === "string" &&
        typeof d.type === "string"
    );
  } catch (error) {
    console.error("Failed to parse mqttDevices from localStorage", error);
    return [];
  }
}

// Ambil device by id dengan validasi
export function getDeviceById(id: string): MqttDeviceConfig | undefined {
  const devices = getAllMqttDevices();
  return devices.find((device) => device.id === id);
}
