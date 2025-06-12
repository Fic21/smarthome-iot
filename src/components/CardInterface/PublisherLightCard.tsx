import { useState, useEffect } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface PublisherLightCardProps {
  device: MqttDeviceConfig;
  setDetail?: (device: MqttDeviceConfig) => void;
}

export default function PublisherLightCard({ device, setDetail }: PublisherLightCardProps) {
  const [isOn, setIsOn] = useState(false);

  const { isConnected, publish } = useMqttClient(device);

  const handleSwitchClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Supaya klik switch tidak memicu setDetail
    const newStatus = !isOn;
    setIsOn(newStatus);
    const message = newStatus ? "ON" : "OFF";
    console.log(`Status lampu: ${message}`);

    if (isConnected) {
      publish(message); // kirim ke topik device.topic
    }
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer max-w-sm"
      onClick={() => setDetail && setDetail(device)}
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
          <div className="text-xs text-gray-600 font-medium mb-1">Input Tambahan</div>
          <div className="text-xs text-gray-500 italic mb-2">{device.inputtambahan.join(", ")}</div>
        </div>
      )}

      {/* LAMPU DAN SWITCH */}
      <div
        className="flex items-center space-x-4 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-6 h-6 rounded-full border-2 border-gray-400 transition-colors duration-300 ${
            isOn ? "bg-yellow-400 shadow-lg animate-pulse" : "bg-gray-400"
          }`}
        ></div>

        <button
          onClick={handleSwitchClick}
          className={`px-4 py-1 rounded-full text-white text-sm font-semibold transition-colors duration-300 ${
            isOn ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
          disabled={!isConnected}
        >
          {isOn ? "ON" : "OFF"}
        </button>
      </div>
    </div>
  );
}
