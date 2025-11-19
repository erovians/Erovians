import React, { useState, useEffect } from "react";

export default function TeamModal({
  form,
  setForm,
  editingId,
  roleOptions,
  close,
  save,
  errors = {},
  setErrors,
}) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (form.photo) {
      setPreview(form.photo);
    } else if (form.photoFile) {
      const url = URL.createObjectURL(form.photoFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [form.photo, form.photoFile]);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {editingId ? "Edit Member" : "Add Member"}
          </h3>
          <button onClick={close}>✕</button>
        </div>

        {/* Photo Upload */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Profile Photo
          </label>

          <div className="flex items-center gap-4">
            {/* Circle Preview */}
            <label
              htmlFor="teamPhoto"
              className="
        w-24 h-24 rounded-full overflow-hidden 
        border border-gray-300 bg-gray-100
        flex items-center justify-center 
        cursor-pointer relative group
      "
            >
              {/* Preview Image */}
              {preview || form.photo ? (
                <img
                  src={preview || form.photo}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-gray-500">Upload</div>
              )}

              {/* Hover Overlay */}
              <div
                className="
          absolute inset-0 bg-black/40 text-white 
          flex items-center justify-center 
          opacity-0 group-hover:opacity-100 
          transition
        "
              >
                Change
              </div>
            </label>

            {/* Hidden File Input */}
            <input
              id="teamPhoto"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setForm((prev) => ({ ...prev, photoFile: file }));
                }
              }}
            />

            {/* Small note */}
            {form.photo && !form.photoFile && (
              <p className="text-xs text-gray-500 w-40">
                Existing photo will remain unless you upload a new one.
              </p>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="text-sm">Name</label>
          <input
            className={`w-full p-2 border rounded-lg ${
              errors.name ? "border-red-500" : ""
            }`}
            value={form.name || ""}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, name: e.target.value }));
              setErrors((prev) => ({ ...prev, name: null }));
            }}
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="text-sm">Email</label>
          <input
            className={`w-full p-2 border rounded-lg ${
              errors.email ? "border-red-500" : ""
            }`}
            value={form.email || ""}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, email: e.target.value }));
              setErrors((prev) => ({ ...prev, email: null }));
            }}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* Mobile */}
        <div className="mb-3">
          <label className="text-sm">Mobile</label>
          <input
            className={`w-full p-2 border rounded-lg ${
              errors.mobile ? "border-red-500" : ""
            }`}
            value={form.mobile || ""}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, mobile: e.target.value }));
              setErrors((prev) => ({ ...prev, mobile: null }));
            }}
          />
          {errors.mobile && (
            <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>
          )}
        </div>

        {/* Role */}
        <div className="mb-3">
          <label className="text-sm">Role</label>
          <select
            className={`w-full p-2 border rounded-lg ${
              errors.role ? "border-red-500" : ""
            }`}
            value={form.role}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, role: e.target.value }));
              setErrors((prev) => ({ ...prev, role: null }));
            }}
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="text-xs text-red-500 mt-1">{errors.role}</p>
          )}
        </div>

        {/* Site */}
        <div className="mb-3">
          <label className="text-sm">Site</label>
          <input
            className={`w-full p-2 border rounded-lg ${
              errors.site ? "border-red-500" : ""
            }`}
            value={form.site || ""}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, site: e.target.value }));
              setErrors((prev) => ({ ...prev, site: null }));
            }}
          />
          {errors.site && (
            <p className="text-xs text-red-500 mt-1">{errors.site}</p>
          )}
        </div>

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
