export interface Device {
  userId:number;
  deviceId: string;
  name: string;
  topic: string;
  type: "subscriber" | "publisher";
  category?: string;
  inputtambahan?: string[];
}
