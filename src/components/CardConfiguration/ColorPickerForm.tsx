import React from "react";

interface ColorPickerFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function ColorPickerForm({
  selectedInputTambahan,
  handleInputChange,
}: ColorPickerFormProps) {
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
            name="colorFormat"
            value="HEX"
            checked={selectedFormat === "HEX"}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
          <span>HEX</span>
        </label>

        <label className="flex items-center space-x-2">
          <input
            type="radio"
            name="colorFormat"
            value="RGB"
            checked={selectedFormat === "RGB"}
            onChange={(e) => handleInputChange(1, e.target.value)}
          />
          <span>RGB</span>
        </label>
      </div>
    </div>
  );
}
