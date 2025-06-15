"use client";

// ======================
// IMPORT COMPONENT & HOOK
// ======================
import Navbar from "@/componentsNavbar/Navbar";
import { useDeviceManager } from "@/apphooks/useDeviceManager"; // pastikan path benar
import ButtonForm from "@/componentsCardConfiguration/ButtonForm";
import SwitchForm from "@/componentsCardConfiguration/SwitchForm";
import SeekBarForm from "@/componentsCardConfiguration/SeekBarForm";
import ComboBoxForm from "@/componentsCardConfiguration/ComboBoxForm";
import ColorPickerForm from "@/componentsCardConfiguration/ColorPickerForm";
import MultiButtonForm from "@/componentsCardConfiguration/MultiButtonForm";
import TimePickerForm from "@/componentsCardConfiguration/TimePicker";
import SubcriberForm from "@/componentsCardConfiguration/SubcriberForm";
import SubcriberCard from "@/componentsCardInterface/SubcriberCard";
import PublisherTextCard from "@/componentsCardInterface/PublisherTextCard";
import PublisherButtonCard from "@/componentsCardInterface/PublisherButtonCard";
import PublisherSwitchCard from "@/componentsCardInterface/PublisherSwitchCard";
import PublisherSeekBarCard from "@/componentsCardInterface/PublisherSeekBarCard";
import PublisherComboBoxCard from "@/componentsCardInterface/PublisherComboBoxCard";
import PublisherColorPickerCard from "@/componentsCardInterface/PublisherColoerPickerCard";
import PublisherMultiButtonCard from "@/componentsCardInterface/PublisherMultiButtonCard";
import PublisherTimePickerCard from "@/componentsCardInterface/PublisherTimePickerCard";
import PublisherLightCard from "@/componentsCardInterface/PublisherLightCard";
import PublisherMotorCard from "@/componentsCardInterface/PublisherMotorCard";
import { Pencil, Trash2 } from "lucide-react";
import PublisherFanCard from "@/componentsCardInterface/PublisherFanCard";
import { useEffect, useState } from "react";
// import { useMqttClient } from "@/apphooks/useMqttClient";
import TextForm from "@/componentsCardConfiguration/TextForm";
import Light from "@/componentsCardConfiguration/LightForm";
import Fan from "@/componentsCardConfiguration/FanForm";
import Motor from "@/componentsCardConfiguration/MotorForm";
import { subscriberOptions } from "@/apphooks/subscriberOptions";

// ======================
// MAIN DASHBOARD COMPONENT
// ======================
export default function Dashboard() {
  const {
    view,
    setView,
    devices,
    // setDevices,
    form,
    setForm,
    detail,
    setDetail,
    selectedPublisher,
    setSelectedPublisher,
    selectedSubscriber,
    setSelectedSubscriber,
    selectedInputTambahan,
    publisherOptions,
    handleSave,
    handleEdit,
    handleDelete,
    handleInputChange,
    handleAddItem,
    handleDeleteItem,
    handleInputChangeDropdown,
    fetchData,
  } = useDeviceManager();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
  if (mounted) {
    // Hanya fetch data setelah mounted === true
    fetchData();
  }
}, [mounted]);
  if (!mounted) {
    return null; // Avoid SSR-client mismatch
  }

  // ini untuk debug
  // console.log("Devices: ", devices);
  // console.log(
  //   "Filtered devices: ",
  //   devices.filter(
  //     (device) => device.userId === localStorage.getItem("currentUserId")
  //   )
  // );
  // console.log(
  //   "Local userId (type, value):",
  //   typeof localStorage.getItem("currentUserId"),
  //   localStorage.getItem("currentUserId")
  // );
  // devices.forEach((device) => {
  //   console.log(
  //     "Device userId (type, value):",
  //     typeof device.userId,
  //     device.userId
  //   );
  // });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ========== NAVBAR ========== */}
      <Navbar />

      {/* ========== TAMPILKAN JSON DARI DEVICES ==========  */}
      {/* {devices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Semua Data Device (JSON)</h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(devices, null, 2)}
          </pre>
        </div>
      )} */}

      {/* ========== MAIN CONTENT ========== */}
      <main className="p-6">
        {/* ========== TOMBOL TAMBAH SUBSCRIBER / PUBLISHER ========== */}
        {!view && (
          <div className="space-x-4 mb-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setView("subscriber")}
            >
              Add Subscriber
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={() => setView("publisher")}
            >
              Add Publisher
            </button>
          </div>
        )}
        {/* ========== PILIHAN JENIS Subcriber ========== */}
        {view === "subscriber"&&(
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {subscriberOptions.map((option) => (
              <button
                key={option}
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600"
                onClick={() => setSelectedSubscriber(option)}
              >
                {option}
              </button>
            ))}
            <button
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 col-span-full"
              onClick={() => setView(null)}
            >
              Kembali
            </button>
          </div>
        )}

        {/* ========== PILIHAN JENIS PUBLISHER ========== */}
        {view === "publisher" && !selectedPublisher && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
            {publisherOptions.map((option) => (
              <button
                key={option}
                className="px-4 py-2 bg-green-400 text-white rounded hover:bg-green-600"
                onClick={() => setSelectedPublisher(option)}
              >
                {option}
              </button>
            ))}
            <button
              className="px-4 py-2 border border-gray-400 rounded hover:bg-gray-200 col-span-full"
              onClick={() => setView(null)}
            >
              Kembali
            </button>
          </div>
        )}

        {/* ========== FORM INPUT SUBSCRIBER / PUBLISHER ========== */}
        {((view === "subscriber" && selectedSubscriber) || selectedPublisher) && (
          <div className="bg-white p-4 rounded shadow mb-4 max-w-md">
            <h2 className="text-lg font-semibold mb-2">
              Tambah {view === "subscriber" ? "Subscriber" : selectedPublisher}
            </h2>

            {/* Input Nama & Topic */}
            <input
              type="text"
              placeholder="Device Name"
              className="mb-2 w-full p-2 border border-gray-300 rounded"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Topic"
              className="mb-2 w-full p-2 border border-gray-300 rounded"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            />
            
            {/* Input Tambahan jika Subcriber */}
            {selectedSubscriber === "Web" && (
              <div className="mb-2">
                <SubcriberForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChangeDropdown={handleInputChangeDropdown}
                />
              </div>
            )}

            {/* Input Tambahan jika Text */}
            {selectedPublisher === "Text" && (
              <div className="mb-2">
                <TextForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}

            {/* Input Tambahan jika Button */}
            {selectedPublisher === "Button" && (
              <div className="mb-2">
                <ButtonForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}

            {/* Input Tambahan jika Switch */}
            {selectedPublisher === "Switch" && (
              <div className="mb-2">
                <SwitchForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}

            {/* Input Tambahan jika SeekBar */}
            {selectedPublisher === "SeekBar" && (
              <div className="mb-2">
                <SeekBarForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}

            {/* Input Tambahan jika ComboBox */}
            {selectedPublisher === "Combo Box" && (
              <div className="mb-2">
                <ComboBoxForm
                  selectedInputTambahan={selectedInputTambahan}
                  // handleInputChange={handleInputChange}
                  handleAddItem={handleAddItem}
                  handleDeleteItem={handleDeleteItem}
                />
              </div>
            )}

            {/* Input Tambahan jika Color Picker */}
            {selectedPublisher === "Color Picker" && (
              <div className="mb-2">
                <ColorPickerForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}
            {/* Input Tambahan jika Multi Button  */}
            {selectedPublisher === "Multi Button" && (
              <div className="mb-2">
                <MultiButtonForm
                  selectedInputTambahan={selectedInputTambahan}
                  // handleInputChange={handleInputChange}
                  handleAddItem={handleAddItem}
                  handleDeleteItem={handleDeleteItem}
                />
              </div>
            )}
            {/* Input Tambahan jika Time Picker  */}
            {selectedPublisher === "Time Picker" && (
              <div className="mb-2">
                <TimePickerForm
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}
            {/* Input Tambahan jika Light  */}
            {selectedPublisher === "Light" && (
              <div className="mb-2">
                <Light
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}
            {/* Input Tambahan jika Fan  */}
            {selectedPublisher === "Fan" && (
              <div className="mb-2">
                <Fan
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}
            {/* Input Tambahan jika Motor   */}
            {selectedPublisher === "Motor" && (
              <div className="mb-2">
                <Motor
                  selectedInputTambahan={selectedInputTambahan}
                  handleInputChange={handleInputChange}
                />
              </div>
            )}

            {/* Tombol Aksi Simpan & Kembali */}
            <div className="flex space-x-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  if (!form.name.trim() || !form.topic.trim() ||selectedInputTambahan.length===0||!(selectedInputTambahan[0]?.trim())) {
                    alert("Tidak boleh ada yang kosong!!");
                    return;
                  }
                  handleSave();
                }}
              >
                Save
              </button>
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-200"
                onClick={() => {
                  setSelectedPublisher(null);
                  setSelectedSubscriber(null);
                  setView(null);
                }}
              >
                Kembali
              </button>
            </div>
          </div>
        )}

        {/* ========== LIST DEVICE YANG TELAH DITAMBAHKAN ========== */}
        {devices && devices.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* filter sesuai currentUserId */}
            {devices
              .filter((device) => {
                const currentUserId = localStorage.getItem("currentUserId");
                // return device.userId === currentUserId;
                return String(device.userId) === currentUserId;
              })

              // di map semua hasil return device.userID

              .map((device) => (
                <div
                  key={device.deviceId}
                  className="bg-white rounded-2xl shadow p-4 pt-8 hover:shadow-lg relative"
                >
                  {/* Jika subscriber */}
                  {device.type === "subscriber" && (
                    <SubcriberCard key={device.id} device={device} setDetail={setDetail} />
                  )}
                  {/* Jika Text */}
                  {device.type === "publisher" &&
                    device.category === "Text" && (
                      <PublisherTextCard
                        key={device.id}
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Button */}
                  {device.type === "publisher" &&
                    device.category === "Button" && (
                      <PublisherButtonCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Switch */}
                  {device.type === "publisher" &&
                    device.category === "Switch" && (
                      <PublisherSwitchCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika SeekBar */}
                  {device.type === "publisher" &&
                    device.category === "SeekBar" && (
                      <PublisherSeekBarCard
                        device={device}
                        setDetail={setDetail}
                        onSeekBarChange={undefined}
                      />
                    )}
                  {/* Jika ComboBox */}
                  {device.type === "publisher" &&
                    device.category === "Combo Box" && (
                      <PublisherComboBoxCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Color Picker */}
                  {device.type === "publisher" &&
                    device.category === "Color Picker" && (
                      <PublisherColorPickerCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Multi Button */}
                  {device.type === "publisher" &&
                    device.category === "Multi Button" && (
                      <PublisherMultiButtonCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Time Picker */}
                  {device.type === "publisher" &&
                    device.category === "Time Picker" && (
                      <PublisherTimePickerCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Light */}
                  {device.type === "publisher" &&
                    device.category === "Light" && (
                      <PublisherLightCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}
                  {/* Jika Fan */}
                  {device.type === "publisher" && device.category === "Fan" && (
                    <PublisherFanCard device={device} setDetail={setDetail} />
                  )}
                  {/* Jika Motor */}
                  {device.type === "publisher" &&
                    device.category === "Motor" && (
                      <PublisherMotorCard
                        device={device}
                        setDetail={setDetail}
                      />
                    )}

                  {/* Tombol Edit dan Hapus */}
                  <div className="absolute top-2 right-4 flex space-x-2">
                    <button
                      className="text-gray-500 hover:text-yellow-500"
                      onClick={() => handleEdit(device.deviceId)}
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => handleDelete(device.deviceId)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ========== DETAIL DEVICE SAAT DIPILIH ========== */}
        {detail && (
          <div className="mt-6 bg-white p-6 rounded shadow border-t-4 border-blue-500">
            <h3 className="text-xl font-bold mb-2">Detail Device</h3>
            <p>
              <strong>Name:</strong> {detail.name}
            </p>
            <p>
              <strong>UserId:</strong> {detail.userId}
            </p>
            <p>
              <strong>DeviceId:</strong> {detail.deviceId}
            </p>
            <p>
              <strong>Topic:</strong> {detail.topic}
            </p>
            <p>
              <strong>Type:</strong> {detail.type}
            </p>
            <p>
              <strong>Category:</strong> {detail.category}
            </p>
            <p>
              <strong>Additional Inputs:</strong>{" "}
              {detail.inputtambahan?.join(", ")}
            </p>
            <p>
              <strong>MQTT Url:</strong> {detail.mqttBrokerUrl}
            </p>
            <p>
              <strong>MQTT Port:</strong> {detail.mqttBrokerPort}
            </p>
            <p><strong>MQTT Token:</strong><textarea
              className="w-full p-1 border border-gray-300 rounded resize-y"
              readOnly
              value={detail.mqttToken}
              rows={1} // atau atur sesuai tinggi yang kamu mau
              style={{ overflowY: "auto" }}
            /> </p>
            
            <p>
              <strong>MQTT Token Expired:</strong> {detail.mqttTokenExpiry}
            </p>

            <button
              className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => setDetail(null)}
            >
              Close
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
