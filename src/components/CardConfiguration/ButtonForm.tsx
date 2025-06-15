import React from "react";

interface ButtonFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function ButtonForm({
  selectedInputTambahan,
  handleInputChange,
}: ButtonFormProps) {
  return (
    <div className="mb-2 space-y-2">
      {/* Dropdown QoS */}
      <div>
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

      {/* Input tambahan lainnya */}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[1] || ""}
        onChange={(e) => handleInputChange(1, e.target.value)}
        placeholder="Enter Button Value"
      />
    </div>
  );
}
