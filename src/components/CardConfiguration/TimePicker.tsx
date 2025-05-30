import React from "react";

interface TimePickerFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function TimePickerForm({
  selectedInputTambahan,
  handleInputChange,
}: TimePickerFormProps) {
  const selectedFormat = selectedInputTambahan[1] || "";

  return (
    <div className="mb-4 max-w-md mx-auto">
      {/* Input label */}
      <input
        type="text"
        className="mb-3 w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[0] || ""}
        onChange={(e) => handleInputChange(0, e.target.value)}
        placeholder="Enter Color picker label"
      />

      {/* Radio buttons */}
      <div className="flex space-x-4">
        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="timeFormat"
            value="12"
            checked={selectedFormat === "12"}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
          <span>12-hour</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="timeFormat"
            value="24"
            checked={selectedFormat === "24"}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
          <span>24-hour</span>
        </label>
      </div>
    </div>
  );
}
