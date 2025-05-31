import { useState } from "react";

export default function PublisherTextCard({ device, setDetail }) {
  const [publishValue, setPublishValue] = useState("");

  const isOnline = device.status === "online";

  const handlePublish = (e) => {
    e.stopPropagation(); // Supaya tidak trigger detail view saat click Publish
    // Sementara hanya log, nanti ganti dengan logic kirim data ke broker
    console.log(`Publish "${publishValue}" to ${device.topic}`);
    setPublishValue(""); // Reset field setelah publish
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail(device)}
    >
      {/* STATUS */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-600 font-medium">Nama Device</div>
          <div className="font-semibold text-lg text-blue-800 truncate">{device.name}</div>
        </div>
        <div className="flex items-center">
          <span
            className={`text-sm font-semibold ${
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </span>
        </div>
      </div>

      {/* TOPIK */}
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Topik</div>
        <div className="text-sm text-blue-600 break-all">{device.topic}</div>
      </div>

      {/* INPUT TAMBAHAN */}
      {device.inputtambahan?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic">
            {device.inputtambahan.join(", ")}
          </div>
        </div>
      )}

      {/* DATA */}
      <div className="mt-2">
        <div className="text-xs text-gray-600 font-medium">Data Terakhir</div>
        <div className="text-sm text-gray-800 break-all">
          Data belum tersedia
        </div>
      </div>

      {/* FORM PUBLISH */}
      <div
        className="mt-4 flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()} // Supaya form click tidak trigger detail view
      >
        <input
          type="text"
          className="border border-blue-300 rounded-lg px-3 py-1 text-sm"
          placeholder="Enter Value"
          value={publishValue}
          onChange={(e) => setPublishValue(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white rounded-lg px-3 py-1 text-sm hover:bg-blue-700 transition-colors duration-200"
          onClick={handlePublish}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
