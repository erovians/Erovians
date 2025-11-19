// src/pages/sellerdashboard/team/Teams.jsx
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
    photo: null, // existing url (string)
    photoFile: null, // File object when user selects new
  });

  const pageSize = 5;
  const [page, setPage] = useState(1);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await listTeamMembers();
      // API returns { success: true, members: [...] }
      setMembers(res.data.members || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  const roleOptions = useMemo(() => {
    const s = new Set(members.map((m) => m.role).filter(Boolean));
    ["Member", "Director", "CTO", "CEO"].forEach((r) => s.add(r));
    return ["All", ...Array.from(s)];
  }, [members]);

  const timeAgo = (input) => {
    if (!input) return "Just now";
    const diff = (Date.now() - new Date(input)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const openAddModal = () => {
    setForm({
      name: "",
      email: "",
      mobile: "",
      role: "Member",
      site: "",
      photo: null,
      photoFile: null,
    });
    setEditingId(null);
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setForm({
      ...member,
      photo: member.photo || null,
      photoFile: null,
    });
    setEditingId(member._id);
    setModalOpen(true);
  };

  const save = async () => {
    try {
      // basic validations
      if (!form.name?.trim()) return alert("Name required");
      if (!form.email?.trim()) return alert("Email required");

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("mobile", form.mobile || "");
      fd.append("role", form.role);
      fd.append("site", form.site || "");

      // if user selected a file, append it
      if (form.photoFile) fd.append("photo", form.photoFile);

      if (editingId) {
        await updateTeamMember(editingId, fd);
      } else {
        await addTeamMember(fd);
      }

      setModalOpen(false);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save member");
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this member?")) return;
    try {
      await deleteTeamMember(id);
      loadMembers();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member");
    }
  };

  const filtered = useMemo(() => {
    let list = [...members];
    if (query.trim()) {
      list = list.filter((m) =>
        (m.name || "").toLowerCase().includes(query.toLowerCase())
      );
    }
    if (filterRole !== "All") list = list.filter((m) => m.role === filterRole);
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
          save={save}
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

          <div className="grid grid-cols-6 border-b pb-2 font-medium text-gray-600">
            <div className="col-span-3">Name</div>
            <div>Role</div>
            <div>Site</div>
            <div className="text-right mr-5">Last Activity</div>
          </div>

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
