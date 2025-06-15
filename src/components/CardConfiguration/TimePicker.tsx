import React from "react";

interface TimePickerFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function TimePickerForm({
  selectedInputTambahan,
  handleInputChange,
}: TimePickerFormProps) {
  const selectedFormat = selectedInputTambahan[2] || "";

  return (
    <div className="mb-4 max-w-md mx-auto space-y-4">
      {/* QoS Dropdown */}
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

      {/* Input label */}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[1] || ""}
        onChange={(e) => handleInputChange(1, e.target.value)}
        placeholder="Enter Time picker label"
      />

      {/* Radio buttons */}
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="timeFormat"
            value="12"
            checked={selectedFormat === "12"}
            onChange={(e) => handleInputChange(2, e.target.value)}
          />
          <span>12-hour</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="timeFormat"
            value="24"
            checked={selectedFormat === "24"}
            onChange={(e) => handleInputChange(2, e.target.value)}
          />
          <span>24-hour</span>
        </label>
      </div>
    </div>
  );
}
