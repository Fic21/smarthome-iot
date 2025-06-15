import React, { useState } from "react";

interface ComboBoxFormProps {
  selectedInputTambahan: string[];
  handleAddItem: (value: string) => void;
  handleDeleteItem: (index: number) => void;
  handleInputChange: (index: number, value: string) => void;
}

export default function ComboBoxForm({
  selectedInputTambahan,
  handleAddItem,
  handleDeleteItem,
  handleInputChange,
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
    <div className="max-w-md mx-auto p-4 space-y-4">
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

      {/* Input field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter Button Value"
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Insert button */}
      <button
        onClick={onInsertClick}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Insert
      </button>

      {/* List */}
      <ul className="space-y-2">
        {selectedInputTambahan.slice(1).map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 bg-gray-100 rounded"
          >
            <span>{item}</span>
            <button
              onClick={() => handleDeleteItem(index + 1)}
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
