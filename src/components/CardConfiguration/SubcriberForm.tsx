import React from "react";

interface SubcriberFormProps {
  selectedInputTambahan: string[];
  handleInputChangeDropdown: (value: string) => void;
}

export default function SubcriberForm({
  selectedInputTambahan,
  handleInputChangeDropdown,
}: SubcriberFormProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="dropdown">QoS:</label>
      <select
        id="dropdown"
        value={selectedInputTambahan[0] || ""}
        onChange={(e) => handleInputChangeDropdown(e.target.value)}
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
