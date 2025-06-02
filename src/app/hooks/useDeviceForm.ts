import { useState } from "react";

interface FormState {
  name: string;
  topic: string;
}

export function useDeviceForm() {
  const [form, setForm] = useState<FormState>({ name: "", topic: "" });
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
