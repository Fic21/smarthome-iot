"use client";

import React from "react";

export default function NavbarUser() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <div className="font-bold text-xl">SmartHome IoT</div>
      <div className="space-x-4">
        <button className="hover:underline">Settings</button>
        <button className="hover:underline">Profile</button>
        <button className="hover:underline">Logout</button>
      </div>
    </nav>
  );
}
