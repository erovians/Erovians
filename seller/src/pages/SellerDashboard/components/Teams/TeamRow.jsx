// src/pages/sellerdashboard/team/TeamRow.jsx
import React, { useState, useRef, useEffect } from "react";

export default function TeamRow({ member, onEdit, onDelete, timeAgo }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();

  // Close popup if clicked outside
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials = (member.name || "U")
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid grid-cols-6 py-4 border-b border-gray-200 items-center hover:bg-gray-50 relative">
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
          {initials}
        </div>

        <div>
          <p className="text-gray-800 font-medium">{member.name}</p>
          <p className="text-gray-500 text-xs">
            {member.email ? member.email : "No Email"}
          </p>
        </div>
      </div>

      <p className="text-gray-700">{member.role}</p>
      <p className="text-gray-500">{member.site || "---"}</p>

      <div className="flex items-center justify-end pr-3 text-gray-600">
        <span className="text-sm">{timeAgo(member.lastActive)}</span>

        {/* 3 Dot Menu */}
        <div ref={menuRef} className="relative ml-3">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 rounded hover:bg-gray-200"
          >
            ⋮
          </button>

          {menuOpen && (
            <div className="absolute z-100 right-0 mt-2 w-36  bg-white border rounded shadow">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onEdit();
                }}
                className="block w-full text-left px-3 py-2 hover:cursor-pointer hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="block w-full text-left px-3 py-2 hover:cursor-pointer hover:bg-gray-100 text-red-600"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
