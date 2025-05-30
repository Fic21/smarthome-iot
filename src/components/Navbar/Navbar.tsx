"use client";

import React, { useState } from "react";

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);

  function handleLogout() {
    if (confirm("Are you sure you want to logout?")) {
      // TODO: Implement logout logic
      alert("Logged out");
    }
  }

  return (
    <nav className="bg-gray-800 text-white flex justify-between items-center p-4">
      <div className="text-lg font-bold">SmartHome IoT Dashboard</div>
      <div className="relative">
        <button onClick={() => setShowMenu(!showMenu)} className="focus:outline-none">
          ☰
        </button>
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-48">
            <button
              onClick={() => alert("Change Password - TODO")}
              className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              Change Password
            </button>
            <button
              onClick={() => alert("Change Name - TODO")}
              className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              Change Name
            </button>
            <button
              onClick={() => alert("Change Background - TODO")}
              className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              Background Dashboard
            </button>
            <hr />
            <button
              onClick={() => alert("Profile info - TODO")}
              className="block px-4 py-2 hover:bg-gray-200 w-full text-left"
            >
              Profile
            </button>
            <hr />
            <button
              onClick={handleLogout}
              className="block px-4 py-2 hover:bg-red-500 hover:text-white w-full text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
