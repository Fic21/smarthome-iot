import React from "react";

interface SwitchFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function SwitchForm({
  selectedInputTambahan,
  handleInputChange,
}: SwitchFormProps) {
  return (
    <div className="mb-2 space-y-2">
      {/* Dropdown QoS */}
      <div>
        <label htmlFor="qos-dropdown">QoS:</label>
        <select
          id="qos-dropdown"
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

      {/* Input lainnya */}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[1] || ""}
        onChange={(e) => handleInputChange(1, e.target.value)}
        placeholder="Enter button text for ON"
      />
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[2] || ""}
        onChange={(e) => handleInputChange(2, e.target.value)}
        placeholder="Enter button text for OFF"
      />
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[3] || ""}
        onChange={(e) => handleInputChange(3, e.target.value)}
        placeholder="Enter value text for ON"
      />
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[4] || ""}
        onChange={(e) => handleInputChange(4, e.target.value)}
        placeholder="Enter value text for OFF"
      />
    </div>
  );
}
