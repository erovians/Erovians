// src/pages/sellerdashboard/team/TeamModal.jsx
import React from "react";

export default function TeamModal({
  form,
  setForm,
  editingId,
  roleOptions,
  close,
  save,
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Member" : "Add Member"}
          </h3>
          <button onClick={close}>✕</button>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="text-sm">Name</label>
          <input
            className="w-full p-2 border rounded-lg"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="text-sm">Email</label>
          <input
            className="w-full p-2 border rounded-lg"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        {/* Mobile */}
        <div className="mb-3">
          <label className="text-sm">Mobile</label>
          <input
            className="w-full p-2 border rounded-lg"
            value={form.mobile}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, mobile: e.target.value }))
            }
          />
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="text-sm">Role</label>
          <select
            className="w-full p-2 border rounded-lg bg-white"
            value={form.role}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, role: e.target.value }))
            }
          >
            {roleOptions.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Site */}
        <div className="mb-3">
          <label className="text-sm">Site</label>
          <input
            className="w-full p-2 border rounded-lg"
            value={form.site}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, site: e.target.value }))
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={close} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
