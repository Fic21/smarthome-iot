import { useState } from "react";

interface FormState {
  deviceId?: string;
  name: string;
  topic: string;
  mqttBrokerUrl?: string;
  mqttBrokerPort?: string;  // simpan sebagai string biar lebih gampang diinput pakai textfield
  mqttToken?: string;
  mqttTokenExpiry?: string;
}

export function useDeviceForm() {
  const [form, setForm] = useState<FormState>({
  name: "",
  topic: "",
  mqttBrokerUrl: "",
  mqttBrokerPort: "",
  mqttToken: "",
  mqttTokenExpiry: "",
});
  const [selectedInputTambahan, setSelectedInputTambahan] = useState<string[]>([]);

  const handleInputChange = (index: number, value: string) => {
    setSelectedInputTambahan((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleAddItem = (value: string) => {
    setSelectedInputTambahan((prev) => [...prev, value]);
  };

  const handleDeleteItem = (index: number) => {
    setSelectedInputTambahan((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChangeDropdown = (value: string) => {
    setSelectedInputTambahan((prev) => {
      const copy = [...prev];
      copy[0] = value;
      return copy;
    });
  };

  return {
    form,
    setForm,
    selectedInputTambahan,
    setSelectedInputTambahan,
    handleInputChange,
    handleAddItem,
    handleDeleteItem,
    handleInputChangeDropdown,
  };
}
