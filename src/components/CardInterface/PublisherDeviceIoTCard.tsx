"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import type { MqttDeviceConfig } from "@/libmqttConfig";
import { useDeviceStatus } from "@/apphooks/useDeviceStatus";

interface PublisherDeviceIotCardProps {
  device: MqttDeviceConfig;
  setDetail: (device: MqttDeviceConfig) => void;
}

function LabeledRow({
  label,
  value,
  canCopy = false,
  asInput = false,
}: {
  label: string;
  value: string;
  canCopy?: boolean;
  asInput?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!canCopy) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center mb-2 text-sm text-blue-600">
      <span className="w-40 text-gray-600 font-medium">{label}:</span>
      {asInput ? (
        <input
          type="text"
          readOnly
          value={value}
          className="flex-1 bg-gray-50 px-2 py-1 rounded border text-sm font-mono text-blue-800 truncate"
        />
      ) : (
        <span className="flex-1 break-all">{value}</span>
      )}
      {canCopy && (
        <button
          onClick={handleCopy}
          title="Klik untuk menyalin"
          className="ml-2 text-gray-500 hover:text-black cursor-pointer transition"
          aria-label={`Copy ${label}`}
          type="button"
        >
          {copied ? (
            <Check size={16} className="text-green-600" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      )}
    </div>
  );
}

export default function SubscriberDeviceIotCard({
  device,
  setDetail,
}: PublisherDeviceIotCardProps) {
  const { status, loading } = useDeviceStatus(device?.deviceId);

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail(device)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          setDetail(device);
        }
      }}
      aria-label={`Device card for ${device?.name || "unknown device"}`}
    >
      {/* Header: Nama Device + Status */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-xs text-gray-600 font-medium">Nama Device</div>
          <div className="font-semibold text-lg text-blue-800 truncate">
            {device?.name || "Unknown"}
          </div>
        </div>
        <div className="flex items-center">
          {/* <span
            className={`text-sm font-semibold ${
              loading
                ? 'text-gray-500'
                : status === 'connected'
                ? 'text-green-600'
                : status === 'disconnected'
                ? 'text-red-600'
                : 'text-gray-400'
            }`}
            aria-live="polite"
          >
            {loading
              // ? '⏳ Loading...'
              ? status
              : status === 'connected'
              ? '🟢 Connected'
              : status === 'disconnected'
              ? '🔴 Disconnected'
              : '⚪ Unknown'}
          </span> */}
          <span
            className={`text-sm font-semibold ${
              status === "connected"
                ? "text-green-600"
                : status === "disconnected"
                ? "text-red-600"
                : "text-gray-400"
            }`}
            aria-live="polite"
          >
            {status === "connected"
              ? "🟢 Connected"
              : status === "disconnected"
              ? "🔴 Disconnected"
              : "⚪ Unknown"}
          </span>
        </div>
      </div>

      {/* Informasi Detail */}
      <LabeledRow label="Category" value={device?.category || "-"} />
      <LabeledRow label="MQTT Server" value="http://localhost" canCopy />
      <LabeledRow label="MQTT Port" value="1883" canCopy />
      <LabeledRow
        label="Token Username"
        value={device?.mqttToken || "-"}
        canCopy
        asInput
      />
      <LabeledRow label="Topik" value={device?.topic || "-"} canCopy asInput />

      {device?.inputtambahan?.length > 0 && (
        <LabeledRow label="QoS" value={device.inputtambahan[0]} canCopy />
      )}
    </div>
  );
}
