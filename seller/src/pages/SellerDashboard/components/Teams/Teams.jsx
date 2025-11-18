import React, { useEffect, useMemo, useState } from "react";
import {
  listTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "./team.api";

import TeamHeader from "./TeamHeader";
import TeamModal from "./TeamModal";
import TeamRow from "./TeamRow";

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
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "Member",
    site: "",
  });

  const pageSize = 5;
  const [page, setPage] = useState(1);

  // Load members
  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await listTeamMembers();
      setMembers(res.data.members);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Roles
  const roleOptions = useMemo(() => {
    const set = new Set(members.map((m) => m.role).filter(Boolean));
    ["Member", "Director", "CTO", "CEO"].forEach((r) => set.add(r));
    return ["All", ...set];
  }, [members]);

  // timeAgo
  const timeAgo = (input) => {
    if (!input) return "Just now";
    const diff = (Date.now() - new Date(input)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  // Add / Edit Modal Handlers
  const openAddModal = () => {
    setForm({ name: "", email: "", mobile: "", role: "Member", site: "" });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setForm(member);
    setEditingId(member._id);
    setModalOpen(true);
  };

  // Save (Add or Update)
  const saveMember = async () => {
    try {
      if (editingId) {
        await updateTeamMember(editingId, form);
      } else {
        await addTeamMember(form);
      }
      setModalOpen(false);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Error saving member");
    }
  };

  // Delete
  const remove = async (id) => {
    if (!confirm("Delete this member?")) return;
    await deleteTeamMember(id);
    loadMembers();
  };

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

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      {modalOpen && (
        <TeamModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          roleOptions={roleOptions.filter((r) => r !== "All")}
          close={() => setModalOpen(false)}
          save={saveMember}
        />
      )}

      <div className="p-6">
        <div className="bg-white border rounded-xl p-6">
          <TeamHeader
            query={query}
            setQuery={setQuery}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            roleOptions={roleOptions}
            setPage={setPage}
            openAddModal={openAddModal}
          />

          {/* Header */}
          <div className="grid grid-cols-6 border-b pb-2 font-medium text-gray-600">
            <div className="col-span-3">Name</div>
            <div>Role</div>
            <div>Site</div>
            <div className="text-right">Activity</div>
          </div>

          {/* Rows */}
          {loading ? (
            <p className="py-6 text-center">Loading...</p>
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
            <p className="py-6 text-center text-gray-400">No members found</p>
          )}
        </div>
      </div>
    </>
  );
}
