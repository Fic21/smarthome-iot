import { useState } from "react";
import { useDeviceForm } from "./useDeviceForm";
import { useDeviceList } from "./useDeviceList";
import { useDeviceView } from "./useDeviceView";
import { publisherOptions } from "./publisherOptions";

export function useDeviceManager() {
  // Hook kecil diimport dan dipanggil di sini
  const deviceForm = useDeviceForm();
  const deviceList = useDeviceList();
  const deviceView = useDeviceView();
  const [selectedPublisher, setSelectedPublisher] = useState<string | null>(null);

  // Fungsi handleSave gabungkan state dari semua hook kecil
  const handleSave = () => {
    if (!deviceView.view) return;
    if (!deviceForm.form.topic.trim()) return;

    const newDevice = {
      id: Date.now(),
      name: deviceForm.form.name || selectedPublisher || "Publisher",
      topic: deviceForm.form.topic,
      type: deviceView.view,
      category: selectedPublisher || undefined,
      inputtambahan: deviceForm.selectedInputTambahan.length > 0 ? deviceForm.selectedInputTambahan : undefined,
    };

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
    handleSave,
  };
}
