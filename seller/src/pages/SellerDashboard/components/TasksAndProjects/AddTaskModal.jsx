import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { taskSchema } from "../../schema/task.schema.js";


export default function AddTaskModal({ open, onClose, onSave }) {
  if (!open) return null;

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "To Do",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
 
 
 const handleSubmit = async () => {
    setErrors({}); 
    const validation = taskSchema.safeParse(form);

    if (!validation.success) {
      const fieldErrors = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[err.path[0]] = err.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    await onSave(form);
    setLoading(false);
  };
 return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl border">

        <h2 className="text-2xl font-semibold text-gray-900 mb-5">
          Add New Task
        </h2>

        <div className="space-y-4">

          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
            <input
              className={`w-full border p-2.5 rounded-lg focus:outline-none ${
                errors.title
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-navyblue"
              }`}
              placeholder="Enter task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              className={`w-full border p-2.5 rounded-lg focus:outline-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-navyblue"
              }`}
              placeholder="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Status</label>
            <select
              className={`w-full border p-2.5 rounded-lg focus:outline-none ${
                errors.status
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-navyblue"
              }`}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>To Do</option>
              <option>Doing</option>
              <option>Review</option>
              <option>Done</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-10 flex items-center gap-3 py-2 bg-navyblue text-white rounded-lg hover:bg-gray-900 transition"
          >
            {loading ? "Saving..." : "Save"}
            {loading && <Spinner />}
          </button>
        </div>

      </div>
    </div>
  );
}
