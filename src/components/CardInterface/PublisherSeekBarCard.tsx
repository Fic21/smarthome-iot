import { useState } from "react";

export default function PublisherSeekBarCard({ device, setDetail, onSeekBarChange }) {
  const minValue = Number(device.inputtambahan?.[0]) ?? 0;
  const maxValue = Number(device.inputtambahan?.[1]) ?? 100;
  const midValue = 0;

  const [seekBarValue, setSeekBarValue] = useState(midValue);

  const handleSeekBarChange = (e) => {
    const value = Number(e.target.value);
    setSeekBarValue(value);
    // Jika ingin meneruskan nilai ke parent (atau API), panggil callback jika ada
    if (onSeekBarChange) {
      onSeekBarChange(value);
    }
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
          <div className="text-xs text-gray-500 italic">
            {device.inputtambahan.join(", ")}
          </div>
        </div>
      )}

      {/* SeekBar */}
      {device.inputtambahan?.length >= 2 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">Nilai SeekBar</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-blue-700">{seekBarValue}</span>
          </div>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={seekBarValue}
            onChange={handleSeekBarChange}
            className="w-full"
          />
          <div className="text-xs text-gray-500 italic">
            {minValue} - {maxValue}
          </div>
        </div>
      )}
    </div>
  );
}
