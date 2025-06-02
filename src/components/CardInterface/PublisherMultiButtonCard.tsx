export default function PublisherMultiButtonCard({ device, setDetail }) {
  return (
    <div
      className="bg-blue-50 border border-blue-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer max-w-sm"
      onClick={() => setDetail(device)}
    >
      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Nama Device</div>
        <div className="font-semibold text-lg text-blue-800 truncate">{device.name}</div>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-600 font-medium">Topik</div>
        <div className="text-sm text-blue-600 break-all">{device.topic}</div>
      </div>

      {device.inputtambahan?.length > 0 && (
        <div className="mb-2">
          <div className="text-xs text-gray-600 font-medium mb-1">Input Tambahan</div>
          <div
            className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2 space-y-2 bg-white"
            onClick={e => e.stopPropagation()}
          >
            {device.inputtambahan.map((input, index) => (
              <button
                key={index}
                className="w-full text-center px-3 py-2 bg-blue-200 text-blue-900 rounded hover:bg-blue-300 active:bg-blue-400 focus:outline-none transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Button clicked: ${input}`);
                }}
              >
                {input}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
