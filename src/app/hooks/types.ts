export interface Device {
  id: number;
  name: string;
  topic: string;
  type: "subscriber" | "publisher";
  category?: string;
  inputtambahan?: string[];
}
