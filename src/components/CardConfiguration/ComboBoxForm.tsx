import React, { useState } from "react";

interface ComboBoxFormProps {
  selectedInputTambahan: string[];
  handleAddItem: (value: string) => void;
  handleDeleteItem: (index: number) => void;
}

export default function ComboBoxForm({
  selectedInputTambahan,
  handleAddItem,
  handleDeleteItem,
}: ComboBoxFormProps) {
  const [inputValue, setInputValue] = useState("");

  const onInsertClick = () => {
    const trimmed = inputValue.trim();
    if (trimmed !== "") {
      handleAddItem(trimmed);
      setInputValue("");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      {/* Input field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Button Value"
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Insert button */}
      <button
        onClick={onInsertClick}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Insert
      </button>

      {/* List */}
      <ul className="space-y-2">
        {selectedInputTambahan.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-100 rounded"
          >
            <span>{item}</span>
            <button
              onClick={() => handleDeleteItem(index)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
