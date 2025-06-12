import React, { useState, useEffect, useRef } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface PublisherCardProps {
  device: MqttDeviceConfig;
  setDetail?: (device: MqttDeviceConfig) => void;
}

export default function PublisherTextCard({ device, setDetail }: PublisherCardProps) {
  const [inputValue, setInputValue] = useState("");
  const [seekBarValue, setSeekBarValue] = useState(0);

  const { isConnected, logs, publish } = useMqttClient(device);
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const minValue = Number(device.inputtambahan?.[0]) ?? 0;
  const maxValue = Number(device.inputtambahan?.[1]) ?? 100;

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollTop = logsEndRef.current.scrollHeight;
    }
  }, [logs]);

  const handlePublish = () => {
    if (!inputValue.trim()) return;
    publish(inputValue.trim());
    setInputValue("");
  };

  const handleSeekBarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setSeekBarValue(value);
    publish(String(value));
  };

  return (
    <div
      className="bg-green-50 border border-green-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail && setDetail(device)}
    >
      {/* STATUS */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-600 font-medium">Nama Device</div>
          <div className="font-semibold text-lg text-green-800 truncate">{device.name}</div>
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
        <div className="text-sm text-green-600 break-all">{device.topic}</div>
      </div>

      {/* INPUT PESAN */}
      <div className="mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Masukkan pesan..."
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* TOMBOL PUBLISH */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePublish();
        }}
        disabled={!isConnected || !inputValue.trim()}
        className={`w-full py-2 rounded-md font-semibold text-white ${
          isConnected ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Kirim Pesan
      </button>

      {/* SEEKBAR */}
      {device.inputtambahan?.length >= 2 && (
        <div className="mt-4">
          <div className="text-xs text-gray-600 font-medium">Nilai SeekBar</div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-green-700">{seekBarValue}</span>
          </div>
          <input
            type="range"
            min={minValue}
            max={maxValue}
            value={seekBarValue}
            onChange={(e) => {
              e.stopPropagation();
              handleSeekBarChange(e);
            }}
            className="w-full"
          />
          <div className="text-xs text-gray-500 italic">
            {minValue} - {maxValue}
          </div>
        </div>
      )}

      {/* LOGS */}
      <div className="mt-2">
        <div className="text-xs text-gray-600 font-medium">Logs</div>
        <div
          ref={logsEndRef}
          className="text-sm text-gray-700 break-all h-20 overflow-auto border border-gray-200 rounded p-2 bg-white"
        >
          {logs.length === 0
            ? "Belum ada aktivitas"
            : logs.map((log, i) => <div key={i}>{log}</div>)}
        </div>
      </div>
    </div>
  );
}
