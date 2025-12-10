import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
export default function TeamModal({
  form,
  setForm,
  editingId,
  roleOptions = [],
  close,
  save,
  saving,
  setSaving,
  errors = {},
  setErrors = () => {},
}) {
  const [preview, setPreview] = useState(null);

  const [localErrors, setLocalErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);

  const dialogRef = useRef(null);
  const firstInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const lastFocusedElementRef = useRef(null);

  // set initial preview (existing photo url or file)
  useEffect(() => {
    if (form?.photoFile) {
      const url = URL.createObjectURL(form.photoFile);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(form?.photo || null);
  }, [form?.photo, form?.photoFile]);

  // prevent body scroll while modal open, restore on close
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // focus management: focus first input & remember previously focused element
  useEffect(() => {
    lastFocusedElementRef.current = document.activeElement;
    setTimeout(() => {
      firstInputRef.current && firstInputRef.current.focus();
    }, 0);
    return () => {
      // restore focus to previous element on unmount
      try {
        lastFocusedElementRef.current && lastFocusedElementRef.current.focus();
      } catch (e) {}
    };
  }, []);

  // keyboard: Esc to close, trap focus within modal (basic trap)
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      } else if (e.key === "Tab") {
        // basic focus trap
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close]);

  // small helpers
  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setLocalErrors((prev) => ({ ...prev, [key]: null }));
    setErrors((prev) => ({ ...(prev || {}), [key]: null }));
  };

  const onFile = (file) => {
    if (!file) return;
    // client-side checks: type and size
    const maxMB = 5;
    if (!file.type.startsWith("image/")) {
      setLocalErrors((p) => ({ ...p, photo: "Please upload an image file." }));
      return;
    }
    if (file.size > maxMB * 1024 * 1024) {
      setLocalErrors((p) => ({ ...p, photo: `Image must be < ${maxMB}MB.` }));
      return;
    }
    setField("photoFile", file);
  };

  const removePhoto = () => {
    // if existing url present, keep a flag (here we just clear photo & photoFile)
    setForm((p) => ({ ...p, photo: null, photoFile: null }));
    setPreview(null);
    setLocalErrors((prev) => ({ ...prev, photo: null }));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    file && onFile(file);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      aria-hidden={false}
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onMouseDown={(e) => {
          // clicking outside the dialog closes it
          if (e.target === e.currentTarget) close();
        }}
      />

      {/* dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="team-modal-title"
        className="relative w-full max-w-lg bg-white rounded-xl shadow-lg border p-6 z-10 
            sm:max-h-[90vh] overflow-y-auto 
            max-sm:h-full max-sm:rounded-none max-sm:p-4"
        onDrop={onDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3
              id="team-modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {editingId ? "Edit Member" : "Add Member"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Add or update team member information.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={close}
              aria-label="Close dialog"
              className="rounded-md p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            >
              <svg
                className="w-4 h-4 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="mt-4 grid grid-cols-1 gap-4">
          {/* Photo + Drop zone */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Profile Photo
            </label>

            <div
              className={`flex items-center gap-4 p-3 rounded-lg border ${
                dragOver
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Preview / Upload area */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-xs text-gray-500">No photo</div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        fileInputRef.current && fileInputRef.current.click()
                      }
                      disabled={saving}
                      className="px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    >
                      {preview ? "Change" : "Upload"}
                    </button>

                    {preview && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        disabled={saving}
                        className="px-3 py-1.5 border rounded-md text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="text-xs text-gray-500">
                    PNG, JPG • up to 5MB
                  </div>
                </div>
              </div>

              {/* hidden file input */}
              <input
                ref={fileInputRef}
                id="team-photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) onFile(f);
                }}
                aria-hidden="true"
              />
            </div>

            {/* photo errors */}
            {(localErrors.photo || errors.photo) && (
              <p className="text-xs text-red-500 mt-2">
                {localErrors.photo || errors.photo}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              You can also drag & drop an image onto the modal area.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Name
            </label>
            <input
              ref={firstInputRef}
              value={form.name || ""}
              onChange={(e) => setField("name", e.target.value)}
              className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                localErrors.name || errors.name
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-navyblue"
              }`}
              placeholder="Full name"
              disabled={saving}
            />
            {(localErrors.name || errors.name) && (
              <p className="text-xs text-red-500 mt-1">
                {localErrors.name || errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email
            </label>
            <input
              value={form.email || ""}
              onChange={(e) => setField("email", e.target.value)}
              className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                localErrors.email || errors.email
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-navblue"
              }`}
              placeholder="name@example.com"
              disabled={saving}
            />
            {(localErrors.email || errors.email) && (
              <p className="text-xs text-red-500 mt-1">
                {localErrors.email || errors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mobile */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Mobile
              </label>
              <input
                value={form.mobile || ""}
                onChange={(e) => setField("mobile", e.target.value)}
                className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  localErrors.mobile || errors.mobile
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-navyblue"
                }`}
                placeholder="+91 98765 43210"
                disabled={saving}
              />
              {(localErrors.mobile || errors.mobile) && (
                <p className="text-xs text-red-500 mt-1">
                  {localErrors.mobile || errors.mobile}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Role
              </label>
              <select
                value={form.role || ""}
                onChange={(e) => setField("role", e.target.value)}
                className={`w-full  p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  localErrors.role || errors.role
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-200 focus:ring-indigo-200"
                }`}
                disabled={saving}
              >
                {roleOptions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
              {(localErrors.role || errors.role) && (
                <p className="text-xs text-red-500 mt-1">
                  {localErrors.role || errors.role}
                </p>
              )}
            </div>
          </div>

          {/* Site */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Site
            </label>
            <input
              value={form.site || ""}
              onChange={(e) => setField("site", e.target.value)}
              className={`w-full text-sm p-2 border rounded-lg focus:outline-none focus:ring-2 ${
                localErrors.site || errors.site
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-200 focus:ring-navyblue  "
              }`}
              placeholder="eg. www.example.com"
              disabled={saving}
            />
            {(localErrors.site || errors.site) && (
              <p className="text-xs text-red-500 mt-1">
                {localErrors.site || errors.site}
              </p>
            )}
          </div>

          {/* generic form error */}
          {localErrors.form && (
            <p className="text-sm text-red-500">{localErrors.form}</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={close}
            disabled={saving}
            className="px-4 py-2 rounded-md border bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navyblue"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={save}
            disabled={saving}
            className={`px-4 py-2 flex items-center gap-2 rounded-md text-white focus:outline-none focus:ring-2 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-navyblue hover:bg-white hover:text-navyblue border border-navyblue focus:ring-navyblue"
            }`}
            aria-disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
            {saving && <Spinner className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
