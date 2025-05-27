"use client";

import React, { useState } from "react";
import NavbarUser from "@/components/navbarUser/page";
import CardDevice from "@/components/cardDevice/page";

interface Device {
  id: string;
  name: string;
  status: "publisher" | "subscriber";
  type: "realtime" | "onoff";
  history: Array<{ timestamp: string; value: any }>;
}

export default function DashboardUsersPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDeviceStatus, setNewDeviceStatus] = useState<"publisher" | "subscriber">("publisher");
  const [newDeviceType, setNewDeviceType] = useState<"realtime" | "onoff">("realtime");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Tambah device baru
  function addDevice() {
    if (!newDeviceName.trim()) return alert("Device name is required");
    const newDevice: Device = {
      id: Date.now().toString(),
      name: newDeviceName,
      status: newDeviceStatus,
      type: newDeviceType,
      history: [],
    };
    setDevices([...devices, newDevice]);
    setNewDeviceName("");
  }

  // Hapus device
  function deleteDevice(id: string) {
    setDevices(devices.filter((d) => d.id !== id));
    if (selectedDevice?.id === id) setSelectedDevice(null);
  }

  // Edit device name (simple rename)
  function editDevice(id: string) {
    const newName = prompt("Enter new device name");
    if (!newName) return;
    setDevices(devices.map(d => d.id === id ? { ...d, name: newName } : d));
  }

  // Simulasi data device history
  // Untuk demo, kita isi beberapa data dummy saat device realtime dipilih
  React.useEffect(() => {
    if (selectedDevice && selectedDevice.type === "realtime") {
      // Simulasi data grafik realtime bertambah tiap 2 detik
      const interval = setInterval(() => {
        setDevices((oldDevices) =>
          oldDevices.map((d) => {
            if (d.id === selectedDevice.id) {
              const newValue = Math.floor(Math.random() * 100);
              const newHistory = [...d.history, { timestamp: new Date().toLocaleTimeString(), value: newValue }];
              return { ...d, history: newHistory.slice(-10) }; // simpan 10 data terakhir
            }
            return d;
          })
        );
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice]);

  return (
    <>
      <NavbarUser />

      <main className="p-6 bg-gray-100 min-h-screen">
        {/* Bagian utama 1 - Tambah device dan list device */}
        <section className="mb-8">
          <div className="flex gap-4 mb-4 items-center">
            <input
              type="text"
              placeholder="Device name"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className="p-2 border rounded flex-grow"
            />
            <select
              value={newDeviceStatus}
              onChange={(e) => setNewDeviceStatus(e.target.value as "publisher" | "subscriber")}
              className="p-2 border rounded"
            >
              <option value="publisher">Publisher</option>
              <option value="subscriber">Subscriber</option>
            </select>
            <select
              value={newDeviceType}
              onChange={(e) => setNewDeviceType(e.target.value as "realtime" | "onoff")}
              className="p-2 border rounded"
            >
              <option value="realtime">Realtime</option>
              <option value="onoff">On/Off</option>
            </select>
            <button
              onClick={addDevice}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Add Device
            </button>
          </div>

          <div>
            {devices.length === 0 && <p className="text-gray-600">No devices yet. Add one!</p>}
            {devices.map((device) => (
              <div
                key={device.id}
                onClick={() => setSelectedDevice(device)}
                className={`cursor-pointer ${selectedDevice?.id === device.id ? "bg-blue-100" : "bg-white"} p-2 rounded mb-2 shadow-sm`}
              >
                <CardDevice
                  id={device.id}
                  name={device.name}
                  status={device.status}
                  onEdit={editDevice}
                  onDelete={deleteDevice}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Bagian utama 2 - Detail device dan konfigurasi EMQX */}
        <section>
          {selectedDevice ? (
            <div className="bg-white p-6 rounded shadow">
              <h2 className="text-2xl font-bold mb-4">{selectedDevice.name} Details</h2>

              {/* Konfigurasi EMQX */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2">MQTT Configuration</h3>
                <pre className="bg-gray-200 p-4 rounded font-mono text-sm">
{`Broker: mqtt://emqx-broker-address
Client ID: client_${selectedDevice.id}
Topic: smarthome/${selectedDevice.name.toLowerCase()}
Status: ${selectedDevice.status}
Type: ${selectedDevice.type}`}
                </pre>
              </div>

              {/* Data device */}
              <div>
                {selectedDevice.type === "realtime" ? (
                  <>
                    <h3 className="font-semibold mb-2">Realtime Data (Last 10)</h3>
                    <ul className="list-disc list-inside max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                      {selectedDevice.history.length === 0 && <li>No data yet</li>}
                      {selectedDevice.history.map((h, i) => (
                        <li key={i}>{h.timestamp}: {h.value}</li>
                      ))}
                    </ul>
                    {/* Bisa ditambahkan grafik (Chart.js / Recharts / dll) jika ingin lebih kompleks */}
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold mb-2">On/Off Status History</h3>
                    <ul className="list-disc list-inside max-h-40 overflow-y-auto border p-2 rounded bg-gray-50">
                      {selectedDevice.history.length === 0 && <li>No status changes yet</li>}
                      {selectedDevice.history.map((h, i) => (
                        <li key={i}>{h.timestamp}: {h.value ? "ON" : "OFF"}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Select a device to see details and configuration.</p>
          )}
        </section>
      </main>
    </>
  );
}
