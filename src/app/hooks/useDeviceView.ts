import { useState } from "react";
import { Device } from "./types";

export function useDeviceView() {
  const [view, setView] = useState<"subscriber" | "publisher" | null>(null);
  const [detail, setDetail] = useState<Device | null>(null);

  return {
    view,
    setView,
    detail,
    setDetail,
  };
}
