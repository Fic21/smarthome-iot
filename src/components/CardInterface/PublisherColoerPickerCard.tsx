import { useState } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface PublisherColorPickerCardProps {
  device: MqttDeviceConfig;
  setDetail?: (device: MqttDeviceConfig) => void;
}

export default function PublisherColorPickerCard({
  device,
  setDetail,
}: PublisherColorPickerCardProps) {
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [colorTampilan, setColorTampilan] = useState("#000000");

  const { isConnected, publish } = useMqttClient(device);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedColor(e.target.value);
    setColorTampilan(e.target.value);
  };

  const handleSendColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const format = device.inputtambahan?.[2] ?? "hex";
    let colorToSend = selectedColor;

    if (format.toLowerCase() === "rgb") {
      const hex = selectedColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      colorToSend = `rgb(${r},${g},${b})`;
    }

    if (isConnected) {
      publish(colorToSend);
    }
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail && setDetail(device)}
    >
      {/* STATUS + NAMA DEVICE */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-600 font-medium">Nama Device</div>
          <div className="font-semibold text-lg text-blue-800 truncate">{device.name}</div>
        </div>
        <div className="flex items-center">
          <span
            className={`text-sm font-semibold ${
              isConnected ? "text-green-600" : "text-red-600"
            }`}
          >
            {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
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

      {/* COLOR PICKER */}
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Pilih Warna:</div>
        <div className="flex items-center space-x-2 mt-1">
          <input
            type="color"
            value={selectedColor}
            onChange={handleColorChange}
            className="w-10 h-10 rounded-full border-blue-600 cursor-pointer appearance-none focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="text-xs text-gray-600 mt-1">
            <span className="font-mono">{colorTampilan}</span>
          </div>
        </div>
      </div>

      {/* TOMBOL KIRIM WARNA */}
      <button
        onClick={handleSendColor}
        disabled={!isConnected}
        className={`w-full py-2 mt-2 rounded-md font-semibold text-white ${
          isConnected ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Kirim Warna
      </button>
    </div>
  );
}
