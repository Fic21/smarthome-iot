
interface FanProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function Fan({
  selectedInputTambahan,
  handleInputChange,
}: FanProps) {
  return (
    <div className="mb-2">
      {/* Dropdown QoS */}
      <label htmlFor="qos-dropdown" className="block mb-1 font-medium">
        QoS:
      </label>
      <select
        id="qos-dropdown"
        value={selectedInputTambahan[0] || ""}
        onChange={(e) => handleInputChange(0, e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Pilih QoS</option>
        <option value="0">0: At most once</option>
        <option value="1">1: At least once</option>
        <option value="2">2: Exactly once</option>
      </select>
    </div>
  );
}
