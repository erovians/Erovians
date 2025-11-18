import React, { useEffect, useMemo, useState } from "react";

//
// 🔗 BASE API URL FROM ENV
//
const API_BASE = `${import.meta.env.VITE_API_URL}/team`;

//
// 🔧 API Service Wrapper
//
const api = {
  list: async () => request("getteammember", "GET"),
  add: async (data) => request("addteammember", "POST", data),
  update: async (id, data) => request(`update/${id}`, "PUT", data),
  delete: async (id) => request(`delete/${id}`, "DELETE"),
};

async function request(path, method, body = null) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) throw new Error(`API Error: ${method} ${path}`);
  return res.json();
}

//
// 🕒 timeAgo utility
//
function timeAgo(input) {
  if (!input) return "Just now";
  const date = new Date(input);
  if (isNaN(date)) return input;

  const diff = (Date.now() - date) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
}

//
// --- Reusable Form Inputs (TOP-LEVEL so identity is stable)
//
function FormInput({ label, name, value, setForm, placeholder }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-700 block mb-1">{label}</label>
      <input
        name={name}
        className="w-full p-2 border rounded-lg"
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, [name]: e.target.value }))
        }
      />
    </div>
  );
}

function FormSelect({ label, name, value, setForm, options }) {
  return (
    <div className="mb-3">
      <label className="text-sm text-gray-700 block mb-1">{label}</label>
      <select
        name={name}
        className="w-full p-2 border rounded-lg bg-white"
        value={value}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, [name]: e.target.value }))
        }
      >
        {options.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}

function Header({
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
        <h2 className="text-2xl font-semibold text-gray-800">Team</h2>
        <p className="text-gray-500 text-sm">Manage your team members</p>
      </div>

      <div className="flex items-center gap-3">
        <input
          className="px-3 py-2 border rounded-lg"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-3 py-2 border rounded-lg bg-white"
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setPage(1);
          }}
        >
          {roleOptions.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>

        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Member
        </button>
      </div>
    </div>
  );
}

function TeamRow({ member, onEdit, onDelete }) {
  const initials = (member.name || "U")
    .split(" ")
    .map((n) => n[0] || "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="grid grid-cols-6 py-4 border-b border-gray-200 items-center hover:bg-gray-50">
      <div className="col-span-3 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
          {initials}
        </div>

        <div>
          <p className="text-gray-800 font-medium">{member.name}</p>
          <p className="text-gray-500 text-xs">
            Joined:{" "}
            {member.createdAt
              ? new Date(member.createdAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
      </div>

      <p className="text-gray-700">{member.role}</p>
      <p className="text-gray-500">{member.site}</p>

      <div className="flex items-center justify-end gap-3 text-sm text-gray-600">
        <span>{timeAgo(member.lastActive)}</span>

        <button
          onClick={onEdit}
          className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 text-xs border border-red-500 text-red-600 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, setPage, total, pageSize }) {
  return (
    <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
      <p>
        Showing <strong>{(page - 1) * pageSize + 1}</strong>–
        <strong>{Math.min(page * pageSize, total)}</strong> of{" "}
        <strong>{total}</strong>
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="px-3 py-1 border rounded bg-gray-50">
          {page} / {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

//
// 🧩 Main Component (stable child components above)
//
export default function Teams() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Search + Filter
  const [query, setQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");

  // Form
  const [form, setForm] = useState({ name: "", role: "Member", site: "" });

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Tick refresh for "last active"
  const [, refresh] = useState(0);

  //
  // Fetch Members
  //
  const loadMembers = async () => {
    setLoading(true);
    try {
      const data = await api.list();
      const normalized = (data.members || []).map((m) => ({
        ...m,
        lastActive: m.lastActive || m.updatedAt || m.createdAt,
      }));
      setMembers(normalized);
    } catch (err) {
      console.error("Failed to load members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    const t = setInterval(() => refresh((x) => x + 1), 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //
  // Role Options
  //
  const roleOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.role).filter(Boolean));
    ["Member", "Director", "CTO", "CEO"].forEach((r) => set.add(r));
    return ["All", ...set];
  }, [members]);

  //
  // Modal handlers
  //
  const openAddModal = () => {
    setForm({ name: "", role: "Member", site: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (m) => {
    setForm({
      name: m.name || "",
      role: m.role || "Member",
      site: m.site || "",
    });
    setEditingId(m._id);
    setModalOpen(true);
  };

  //
  // Save Member
  //
  const saveMember = async () => {
    if (!form.name.trim()) return alert("Name is required");

    const payload = { ...form, lastActive: new Date().toISOString() };

    try {
      if (editingId) {
        // Update
        setMembers((prev) =>
          prev.map((m) => (m._id === editingId ? { ...m, ...payload } : m))
        );
        await api.update(editingId, payload);
      } else {
        // Add temp
        const temp = { _id: `temp-${Date.now()}`, ...payload };
        setMembers((prev) => [temp, ...prev]);

        const res = await api.add(payload);
        if (res && res.member) {
          setMembers((prev) =>
            prev.map((m) => (m._id === temp._id ? res.member : m))
          );
        } else {
          // fallback
          loadMembers();
        }
      }

      setModalOpen(false);
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save member");
      loadMembers();
    }
  };

  //
  // Delete
  //
  const deleteMember = async (id) => {
    if (!confirm("Delete this member?")) return;

    const backup = members;
    setMembers((prev) => prev.filter((m) => m._id !== id));

    try {
      await api.delete(id);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete");
      setMembers(backup);
    }
  };

  //
  // Filtering + Pagination
  //
  const filtered = useMemo(() => {
    let list = [...members];

    if (query.trim()) {
      list = list.filter((m) =>
        (m.name || "").toLowerCase().includes(query.toLowerCase())
      );
    }

    if (filterRole !== "All") {
      list = list.filter((m) => m.role === filterRole);
    }

    return list;
  }, [members, query, filterRole]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  //
  // Render UI (modal inline to avoid remount focus issues)
  //
  return (
    <>
      {/* Modal Inline */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg border border-gray-200">
            <div className="flex justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? "Edit Member" : "Add Member"}
              </h3>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <FormInput
              label="Name"
              name="name"
              value={form.name}
              setForm={setForm}
            />
            <FormSelect
              label="Role"
              name="role"
              value={form.role}
              options={roleOptions.filter((r) => r !== "All")}
              setForm={setForm}
            />
            <FormInput
              label="Site"
              name="site"
              value={form.site}
              setForm={setForm}
              placeholder="Optional"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={saveMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page */}
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <Header
            query={query}
            setQuery={setQuery}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            roleOptions={roleOptions}
            setPage={setPage}
            openAddModal={openAddModal}
          />

          {/* Table Header */}
          <div className="grid grid-cols-6 border-b border-gray-200 pb-2 text-sm font-medium text-gray-600">
            <div className="col-span-3">Name</div>
            <div>Role</div>
            <div>Site</div>
            <div className="text-right">Activity</div>
          </div>

          {/* Rows */}
          {loading ? (
            <p className="py-6 text-center text-gray-500">Loading…</p>
          ) : paginated.length ? (
            paginated.map((m) => (
              <TeamRow
                key={m._id}
                member={m}
                onEdit={() => openEditModal(m)}
                onDelete={() => deleteMember(m._id)}
              />
            ))
          ) : (
            <p className="py-6 text-center text-gray-400">No members found</p>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            total={filtered.length}
            pageSize={pageSize}
          />
        </div>
      </div>
    </>
  );
}
