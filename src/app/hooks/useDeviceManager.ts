// useDeviceManager.ts
import { useState } from "react";

export interface Device {
  id: number;
  name: string;
  topic: string;
  type: "subscriber" | "publisher";
  category?: string;
  inputtambahan?: string[];
}

export function useDeviceManager() {
  const [view, setView] = useState<"subscriber" | "publisher" | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [form, setForm] = useState({ name: "", topic: "" });
  const [detail, setDetail] = useState<Device | null>(null);
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(
    null
  );
  const [selectedInputTambahan, setSelectedInputTambahan] = useState<string[]>(
    []
  );

  const publisherOptions = [
    "Text",
    "Button",
    "Switch",
    "SeekBar",
    "Combo Box",
    "Color Picker",
    "Multi Button",
    "Time Picker",
    "Light",
    "Fan",
    "Motor",
  ];

  const handleSave = () => {
    const newDevice: Device = {
      id: Date.now(),
      name: form.name || selectedPublisher || "Publisher",
      topic: form.topic,
      type: view!,
      category: selectedPublisher || undefined,
      inputtambahan: selectedInputTambahan,
    };
    setDevices([...devices, newDevice]);
    setForm({ name: "", topic: "" });
    setSelectedPublisher(null);
    setView(null);
    setSelectedInputTambahan([]);
  };

  const handleInputChange = (index: number, value: string) => {
    const newInput = [...selectedInputTambahan];
    newInput[index] = value;
    setSelectedInputTambahan(newInput);
  };

  // Fungsi untuk menambah item baru ke selectedInputTambahan

  const handleAddItem = (value: string) => {
    setSelectedInputTambahan((prev) => [...prev, value]);
  };

  // Fungsi untuk menghapus item berdasarkan index dari selectedInputTambahan
  const handleDeleteItem = (index: number) => {
    setSelectedInputTambahan((prev) => prev.filter((_, i) => i !== index));
  };

  //untuk drop down
  const handleInputChangeDropdown = (value: string) => {
  const updated = [...selectedInputTambahan];
  updated[0] = value;
  setSelectedInputTambahan(updated);
};

  return {
    view,
    setView,
    devices,
    setDevices,
    form,
    setForm,
    detail,
    setDetail,
    selectedPublisher,
    setSelectedPublisher,
    selectedInputTambahan,
    setSelectedInputTambahan,
    publisherOptions,
    handleSave,
    handleInputChange,
    handleAddItem,
    handleDeleteItem,
    handleInputChangeDropdown,
  };
}
