export function loadFromLocalStorage<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) as T : null;
}

export function saveToLocalStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key: string) {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
