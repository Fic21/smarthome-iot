import { useState } from "react";

export default function PublisherFanCard({ device, setDetail }) {
  const [isOn, setIsOn] = useState(false);

  const handleSwitchClick = (e) => {
    e.stopPropagation(); // Supaya klik switch tidak memicu setDetail
    const newStatus = !isOn;
    setIsOn(newStatus);
    console.log(`Status kipas: ${newStatus ? "ON" : "OFF"}`);
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer max-w-sm"
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
          <div className="text-xs text-gray-600 font-medium mb-1">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic mb-2">
            {device.inputtambahan.join(", ")}
          </div>
        </div>
      )}

      <div
        className="flex items-center space-x-4 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animasi Kipas */}
        <div
          className={`w-8 h-8 border-4 border-gray-400 rounded-full relative transition-transform duration-500 ${
            isOn ? "animate-spin border-t-blue-400 border-r-blue-400" : "border-gray-400"
          }`}
        >
          {/* Bisa ditambahkan detail kipas di tengah kalau mau */}
        </div>

        {/* Tombol Switch */}
        <button
          onClick={handleSwitchClick}
          className={`px-4 py-1 rounded-full text-white text-sm font-semibold transition-colors duration-300 ${
            isOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isOn ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}
