import { useState } from "react";

export default function PublisherComboBoxCard({ device, setDetail }) {
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);
    // Nanti di sini bisa ditambahkan logika untuk API call jika diperlukan
    console.log("Selected value:", value);
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail(device)}
    >
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Nama Device</div>
        <div className="font-semibold text-lg text-blue-800 truncate">{device.name}</div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Topik</div>
        <div className="text-sm text-blue-600 break-all">{device.topic}</div>
      </div>

      {device.inputtambahan?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic">{device.inputtambahan.join(", ")}</div>
        </div>
      )}

      {/* Dropdown */}
      {device.inputtambahan?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">Pilih Nilai:</div>
          <select
            className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
            value={selectedValue}
            onChange={handleSelectChange}
          >
            <option value="">-- Pilih --</option>
            {device.inputtambahan.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
