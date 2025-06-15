import { useState } from "react";

export default function PublisherTextCard({ device, setDetail }) {
  const [time, setTime] = useState("");

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const handleOkClick = (e) => {
    e.stopPropagation();
    console.log(`Time selected: ${time} (${device.inputtambahan[1]} jam)`);
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer max-w-sm relative"
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
        <div
          className="mb-2"
          onClick={(e) => e.stopPropagation()} // supaya card tidak ikut di-klik saat time picker dibuka
        >
          <div className="text-xs text-gray-600 font-medium mb-1">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic mb-2">
            {device.inputtambahan.join(", ")}
          </div>

          <div className="flex flex-col space-y-2 border border-gray-300 rounded p-2 bg-white z-10 relative">
            <label className="text-xs text-gray-600 font-medium">
              Pilih Waktu ({device.inputtambahan[1]} jam)
            </label>
            <input
              type="time"
              value={time}
              onChange={handleTimeChange}
              className="border border-gray-300 rounded px-2 py-1 focus:outline-none bg-white z-10 relative"
              step="60"
            />
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 active:bg-blue-700 transition-colors duration-150"
              onClick={handleOkClick}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
