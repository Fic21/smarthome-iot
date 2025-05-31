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
    <div className="mb-2">
        <input
    type="text"
    className="mb-2 w-full p-2 border border-gray-300 rounded"
    value={selectedInputTambahan[0] || ""}
    onChange={(e) => handleInputChange(0, e.target.value)}
    placeholder="Enter button text for ON"
  />
    <input
    type="text"
    className="mb-2 w-full p-2 border border-gray-300 rounded"
    value={selectedInputTambahan[1] || ""}
    onChange={(e) => handleInputChange(1, e.target.value)}
    placeholder="Enter button text for OFF"
  />
    <input
    type="text"
    className="mb-2 w-full p-2 border border-gray-300 rounded"
    value={selectedInputTambahan[2] || ""}
    onChange={(e) => handleInputChange(2, e.target.value)}
    placeholder="Enter value text for ON"
  />
    <input
    type="text"
    className="mb-2 w-full p-2 border border-gray-300 rounded"
    value={selectedInputTambahan[3] || ""}
    onChange={(e) => handleInputChange(3, e.target.value)}
    placeholder="Enter value text for OFFi"
  />

    </div>
  );
}