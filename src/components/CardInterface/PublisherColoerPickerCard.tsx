import { useState } from "react";

export default function PublisherColorPickerCard({ device, setDetail }) {
  const [selectedColor, setSelectedColor] = useState("#000000"); // default black
  const [colorTampilan, setColorTampilan] = useState("#000000"); // agar bisa tampil

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
    setColorTampilan(e.target.value);
  };

  const handleSendColor = (e) => {
    e.stopPropagation(); // agar tidak trigger setDetail saat klik tombol

    const format = device.inputtambahan?.[1] ?? "hex"; // default hex
    let colorToSend = selectedColor;

    if (format.toLowerCase() === "rgb") {
      // Convert HEX to RGB
      const hex = selectedColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      colorToSend = `rgb(${r},${g},${b})`;
    }

    console.log("Format:", format);
    console.log("Warna yang dikirim:", colorToSend);
    // di sini nanti bisa dipakai untuk kirim ke API
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail(device)}
    >
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Nama Device</div>
        <div className="font-semibold text-lg text-blue-800 truncate">
          {device.name}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Topik</div>
        <div className="text-sm text-blue-600 break-all">{device.topic}</div>
      </div>

      {device.inputtambahan?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic">
            {device.inputtambahan.join(", ")}
          </div>
        </div>
      )}

      {/* Color Picker */}
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Pilih Warna:</div>
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="w-10 h-10 rounded-full border-blue-600 cursor-pointer appearance-none focus:outline-none"
            onClick={(e) => e.stopPropagation()} // agar tidak trigger setDetail saat klik input color
          />
          {/* Preview Color */}
          <div className="text-xs text-gray-600 mt-1">
           <span className="font-mono">{colorTampilan}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSendColor}
        className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded mt-2"
      >
        Kirim Warna
      </button>
    </div>
  );
}
