import { useEffect } from "react";

interface DeviceIotFormProps {
  selectedInputTambahan: string[];
  handleInputChange: (index: number, value: string) => void;
}

export default function DeviceIotForm({
  selectedInputTambahan,
  handleInputChange,
}: DeviceIotFormProps) {
  useEffect(() => {
    // Jika selectedInputTambahan[0] masih kosong, isi default
    if (!selectedInputTambahan[0]) {
      handleInputChange(0, "ini textForm");
    }
  }, [selectedInputTambahan, handleInputChange]);

  return null; // tidak menampilkan apa-apa
}
