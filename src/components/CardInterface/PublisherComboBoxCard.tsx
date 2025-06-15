import { useState } from "react";
import { useMqttClient } from "@/apphooks/useMqttClient";
import type { MqttDeviceConfig } from "@/libmqttConfig";

interface PublisherComboBoxCardProps {
  device: MqttDeviceConfig;
  setDetail?: (device: MqttDeviceConfig) => void;
}

export default function PublisherComboBoxCard({
  device,
  setDetail,
}: PublisherComboBoxCardProps) {
  const [selectedValue, setSelectedValue] = useState("");
  const { isConnected, publish } = useMqttClient(device);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);

    if (isConnected && value) {
      publish(value);
    }
  };

  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => setDetail && setDetail(device)}
    >
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Nama Device</div>
        <div className="font-semibold text-lg text-blue-800 truncate">
          {device.name}
        </div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Topik</div>
        <div className="text-sm text-blue-600 break-all">{device.topic}</div>
      </div>

      {device.inputtambahan?.length > 0 && (
        <>
          <div className="mb-2">
            <div className="text-xs text-gray-600 font-medium">
              Input Tambahan
            </div>
            <div className="text-xs text-gray-500 italic">
              {device.inputtambahan.join(", ")}
            </div>
          </div>

          <div className="mb-2">
            <div className="text-xs text-gray-600 font-medium">
              Pilih Nilai:
            </div>
            <select
              className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
              value={selectedValue}
              onChange={handleSelectChange}
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">-- Pilih --</option>
              {device.inputtambahan.slice(1).map((item, index) => (
                <option key={index + 1} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  );
}
