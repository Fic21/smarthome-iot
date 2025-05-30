import React from "react";

interface SeekBarFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function SeekBarForm({
  selectedInputTambahan,
  handleInputChange,
}: SeekBarFormProps) {
  return (
    <div className="mb-2">
      <input
        type="number"
        className="mb-2 w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[0] || ""}
        onChange={(e) => handleInputChange(0, e.target.value)}
        placeholder="Min value"
      />
      <input
        type="number"
        className="mb-2 w-full p-2 border border-gray-300 rounded"
        value={selectedInputTambahan[1] || ""}
        onChange={(e) => handleInputChange(1, e.target.value)}
        placeholder="Max Value"
      />
    </div>
  );
}
