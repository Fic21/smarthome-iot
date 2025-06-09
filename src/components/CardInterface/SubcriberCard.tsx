import React, { useRef, useEffect } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface SubscriberCardProps {
  device: MqttDeviceConfig;
  setDetail: (device: MqttDeviceConfig) => void;
}

export default function SubscriberCard({
  device,
  setDetail,
}: SubscriberCardProps) {
  const { isConnected, logs } = useMqttClient(device);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll ke bawah saat logs berubah
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

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
      {device.inputtambahan && device.inputtambahan.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium">QoS</div>
          <div className="text-xs text-gray-500 italic">
            {device.inputtambahan[0]}
          </div>
        </div>
      )}

      {/* DATA TERAKHIR
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Data Terakhir</div>
        <div className="text-sm text-gray-800 break-all">
          {latestLog ?? "Data belum tersedia"}
        </div>
      </div> */}

      {/* LOGS */}
      <div
        ref={logContainerRef}
        className="text-sm text-gray-700 break-all h-20 overflow-auto border border-gray-200 rounded p-2 bg-white"
      >
        {logs.length === 0
          ? "Belum ada aktivitas"
          : logs.map((log, i) => <div key={i}>{log}</div>)}
      </div>
    </div>
  );
}
