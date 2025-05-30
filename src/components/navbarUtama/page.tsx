"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarUtama() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dasboard");
  if (isDashboard) return null;
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl1 font-bold">Smarthome-iot</h1>
      <nav className="space-x-4">
        <Link href="/">Beranda</Link>
        <Link href="/tentang">Tentang</Link>
        <Link href="/login">Login</Link>
        <Link href="/daftar">Daftar</Link>
        <Link href="/admin" className="text-sm text-gray-500">
          Admin
        </Link>
      </nav>
    </header>
  );
}
