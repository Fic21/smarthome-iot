export default function PublisherButtonCard({ device, setDetail }) {
  const isOnline = device.status === "online";

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
              isOnline ? "text-green-600" : "text-red-600"
            }`}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
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

      {/* BUTTON TAMPILAN */}
      {device.inputtambahan?.[0] && (
        <div className="mt-4">
          <button
            className="bg-blue-600 text-white rounded-lg px-3 py-2 text-sm hover:bg-blue-700 active:translate-y-1 active:shadow-inner transition-all duration-150 w-full"
            disabled
          >
            {device.inputtambahan[0]}
          </button>
        </div>
      )}
    </div>
  );
}
