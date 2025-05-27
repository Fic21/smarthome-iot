"use client";

import React from "react";

interface CardDeviceProps {
  id: string;
  name: string;
  status: "publisher" | "subscriber";
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function CardDevice({ id, name, status, onEdit, onDelete }: CardDeviceProps) {
  return (
    <div className="border rounded p-4 shadow-md mb-4 bg-white">
      <h3 className="font-semibold text-lg">{name}</h3>
      <p>Status: <span className="font-mono">{status}</span></p>
      <div className="mt-3 flex gap-3">
        <button
          onClick={() => onEdit(id)}
          className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
