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
    <div className="mb-2">
        <input
    type="text"
    className="mb-2 w-full p-2 border border-gray-300 rounded"
    value={selectedInputTambahan[0] || ""}
    onChange={(e) => handleInputChange(0, e.target.value)}
    placeholder="Enter Button Value"
  />

    </div>
  );
}