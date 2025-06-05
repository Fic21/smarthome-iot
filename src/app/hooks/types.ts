export interface Device {
  deviceId: string;
  name: string;
  topic: string;
  type: "subscriber" | "publisher";
  category: string;
  inputtambahan?: string[];
  userId: number;
  mqttBrokerUrl?: string;
  mqttBrokerPort?: number;
  mqttToken?: string;
  mqttTokenExpiry?: string;
}
