// src/pages/sellerdashboard/team/TeamHeader.jsx
import React from "react";

export default function TeamHeader({
  query,
  setQuery,
  filterRole,
  setFilterRole,
  roleOptions,
  setPage,
  openAddModal,
}) {
  return (
    <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Team</h2>
        {/* <p className="text-gray-500 text-sm">Manage your team members</p> */}
      </div>

      <div className="flex items-center gap-3">
        <input
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setPage(1);
          }}
        >
          {roleOptions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <button
          onClick={openAddModal}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Member
        </button>
      </div>
    </div>
  );
}
