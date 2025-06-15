import React from "react";

interface SubcriberFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function SubcriberForm({
  selectedInputTambahan,
  handleInputChange,
}: SubcriberFormProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="dropdown">QoS:</label>
      <select
        id="dropdown"
        value={selectedInputTambahan[0] || ""}
        onChange={(e) => handleInputChange(0, e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Pilih QoS</option>
        <option value="0">0: At most once</option>
        <option value="1">1: At least once</option>
        <option value="2">2: Exactly once</option>
      </select>
    </div>
  );
}
