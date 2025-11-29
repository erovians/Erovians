// File: src/pages/sellerdashboard/team/Teams.jsx (JSX only)
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from './team.api';
import TeamHeader from './TeamHeader';
import TeamModal from './TeamModal';
import { TeamRow } from './TeamRow';
import { teamSchema } from "../../schema/team.schema";

/**
 * Senior-ready Teams (JSX)
 * - Uses a semantic table for perfect alignment
 * - Accessible action menu
 * - Optimistic delete and proper error handling hooks
 */
export default function Teams() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Search + Filter
  const [query, setQuery] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  // error
  const [errors, setErrors] = useState({});

  // Form
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    role: 'Member',
    site: '',
    photo: null,
    photoFile: null,
  });

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listTeamMembers();
      setMembers(res?.data?.members || []);
    } catch (err) {
      console.error(err);
      // replace with toast in real app
      alert('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const roleOptions = useMemo(() => {
    const s = new Set(members.map((m) => m.role).filter(Boolean));
    ['Member', 'Director', 'CTO', 'CEO'].forEach((r) => s.add(r));
    return ['All', ...Array.from(s)];
  }, [members]);

  const timeAgo = useCallback((input) => {
    if (!input) return 'Just now';
    const diff = (Date.now() - new Date(input)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }, []);

  const openAddModal = useCallback(() => {
    setForm({
      name: '',
      email: '',
      mobile: '',
      role: 'Member',
      site: '',
      photo: null,
      photoFile: null,
    });
    setEditingId(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((member) => {
    setForm({ ...member, photo: member.photo || null, photoFile: null });
    setEditingId(member._id);
    setModalOpen(true);
  }, []);

  const save = useCallback(async () => {
     const result = teamSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      // convert from array → single message
      const formatted = {};
      for (const key in fieldErrors) {
        formatted[key] = fieldErrors[key]?.[0] || null;
      }

      setErrors(formatted);
      return;
    }

    setErrors({});

    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('mobile', form.mobile || '');
      fd.append('role', form.role);
      fd.append('site', form.site || '');
      if (form.photoFile) fd.append('photo', form.photoFile);

      if (editingId) await updateTeamMember(editingId, fd);
      else await addTeamMember(fd);

      setModalOpen(false);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'Failed to save member');
    }
  }, [form, editingId, loadMembers]);

  // optimistic delete
  const remove = useCallback(
    async (id) => {
      if (!confirm('Delete this member?')) return;
      const prev = members;
      setMembers((m) => m.filter((x) => x._id !== id));
      try {
        await deleteTeamMember(id);
      } catch (err) {
        console.error(err);
        setMembers(prev);
        alert('Failed to delete member');
      }
    },
    [members]
  );

  const filtered = useMemo(() => {
    let list = [...members];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((m) => (m.name || '').toLowerCase().includes(q) || (m.email || '').toLowerCase().includes(q));
    }
    if (filterRole !== 'All') list = list.filter((m) => m.role === filterRole);
    return list;
  }, [members, query, filterRole]);

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);

  return (
    <div className="p-6">
      {modalOpen && (
        <TeamModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          roleOptions={roleOptions.filter((r) => r !== 'All')}
          close={() => setModalOpen(false)}
          save={save}
          errors={errors}
          setErrors={setErrors}
        />
      )}
<div className="bg-white border rounded-xl p-4 sm:p-6 shadow-sm">

        <TeamHeader
          query={query}
          setQuery={setQuery}
          filterRole={filterRole}
          setFilterRole={setFilterRole}
          roleOptions={roleOptions}
          setPage={setPage}
          openAddModal={openAddModal}
        />

        <div className="mt-4 overflow-x-auto">
          {/* DESKTOP & TABLET TABLE */}
<div className="hidden sm:block overflow-x-auto">
  <table className="min-w-full table-auto text-sm">
    <thead>
      <tr className="text-left text-gray-600 border-b bg-gray-50">
        <th className="w-3/6 px-4 py-3">Name</th>
        <th className="w-1/6 px-4 py-3">Role</th>
        <th className="w-1/6 px-4 py-3">Site</th>
        <th className="w-1/6 px-4 py-3">Last Activity</th>
        <th className="w-1/12 px-4 py-3">Actions</th>
      </tr>
    </thead>

    <tbody>
      {loading ? (
        <tr>
          <td colSpan={5} className="py-6 text-center text-gray-500">
            Loading...
          </td>
        </tr>
      ) : paginated.length ? (
        paginated.map((m) => (
          <TeamRow
            key={m._id}
            member={m}
            timeAgo={timeAgo}
            onEdit={() => openEditModal(m)}
            onDelete={() => remove(m._id)}
          />
        ))
      ) : (
        <tr>
          <td
            colSpan={5}
            className="py-6 text-center text-gray-400"
          >
            No members found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

{/* MOBILE CARD VIEW */}
<div className="sm:hidden flex flex-col gap-4 mt-4">
  {loading ? (
    <p className="text-center py-4 text-gray-500">Loading...</p>
  ) : paginated.length ? (
    paginated.map((m) => (
      <div
        key={m._id}
        className="bg-white p-4 rounded-lg shadow border flex flex-col gap-3"
      >
        {/* Top section */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
            {m.photo ? (
              <img
                src={m.photo}
                className="w-full h-full object-cover"
                alt={m.name}
              />
            ) : (
              <span className="text-blue-600 font-bold text-lg">
                {m.name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div>
            <p className="text-gray-900 font-semibold">{m.name}</p>
            <p className="text-gray-500 text-xs">{m.email || "No email"}</p>
          </div>
        </div>

        {/* Info section */}
        <div className="text-sm text-gray-700">
          <p>
            <span className="font-semibold">Role:</span> {m.role}
          </p>
          <p>
            <span className="font-semibold">Site:</span>{" "}
            {m.site || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Last Active:</span>{" "}
            {timeAgo(
              m.lastActive || m.updatedAt || m.createdAt
            )}{" "}
            ago
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 mt-2">
          <button
            onClick={() => openEditModal(m)}
            className="px-3 py-1 text-sm rounded bg-navyblue text-white"
          >
            Edit
          </button>
          <button
            onClick={() => remove(m._id)}
            className="px-3 py-1 text-sm rounded border border-navyblue text-navyblue "
          >
            Delete
          </button>
        </div>
      </div>
    ))
  ) : (
    <p className="text-center text-gray-500 py-3">
      No members found
    </p>
  )}
</div>


          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <div>Showing {Math.min((page - 1) * pageSize + 1, filtered.length || 0)} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
              <div>Page {page} / {totalPages}</div>
              <button className="px-3 py-1 border rounded" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
