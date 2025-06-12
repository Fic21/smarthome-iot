import React, { useState } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

export default function PublisherButtonCard({ device, setDetail }: { device: MqttDeviceConfig, setDetail: (d: MqttDeviceConfig) => void }) {
  const { isConnected, publish } = useMqttClient(device);
  const [isActive, setIsActive] = useState(false);

  const handleSwitchToggle = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const newState = !isActive;
    setIsActive(newState);

    const topicToPublish = newState
      ? device.inputtambahan?.[2]
      : device.inputtambahan?.[3];

    if (topicToPublish && isConnected) {
      publish(topicToPublish);
    }

    console.log("Trigger:", topicToPublish);
  };

  const label = isActive
    ? device.inputtambahan?.[0] || ""
    : device.inputtambahan?.[1] || "";

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail(device)}
    >
      {/* STATUS */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-600 font-medium">Nama Device</div>
          <div className="font-semibold text-lg text-blue-800 truncate">
            {device.name}
          </div>
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
          <div className="text-xs text-gray-600 font-medium">QoS</div>
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

      {/* SWITCH */}
      {device.inputtambahan?.length >= 4 && (
        <div className="mt-4 flex items-center">
          <div
            onClick={handleSwitchToggle}
            className={`relative w-14 h-8 rounded-full cursor-pointer transition-colors duration-300 ${
              isActive ? "bg-green-500" : "bg-red-500"
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                isActive ? "translate-x-6" : "translate-x-0"
              }`}
            ></div>
          </div>
          <span className="ml-4 font-semibold text-gray-800">{label}</span>
        </div>
      )}
    </div>
  );
}
