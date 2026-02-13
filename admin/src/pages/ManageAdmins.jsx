import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import {
  UserPlus,
  Users,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Check,
  Ban,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  UserCog,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "sellers", label: "Sellers" },
  { key: "buyers", label: "Buyers" },
  { key: "company", label: "Company" },
  { key: "orders", label: "Orders" },
  { key: "payments", label: "Payments" },
  { key: "inquiries", label: "Inquiries" },
  { key: "requests", label: "Requests" },
  { key: "settings", label: "Settings" },
];

// ── Create Admin Form ──────────────────────────────────────
function CreateAdminForm({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    assignedPermissions: ["dashboard"],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // { password, name }
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [copied, setCopied] = useState(false);

  const togglePermission = (key) => {
    setForm((prev) => ({
      ...prev,
      assignedPermissions: prev.assignedPermissions.includes(key)
        ? prev.assignedPermissions.filter((p) => p !== key)
        : [...prev.assignedPermissions, key],
    }));
  };

  const selectAll = () =>
    setForm((prev) => ({
      ...prev,
      assignedPermissions: ALL_PERMISSIONS.map((p) => p.key),
    }));

  const clearAll = () =>
    setForm((prev) => ({ ...prev, assignedPermissions: [] }));

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim()) return setError("Name is required");
    if (!form.email.trim() && !form.mobile.trim())
      return setError("Email or Mobile is required");

    setLoading(true);
    try {
      const { data } = await api.post("/admin/manage/create", form);
      setResult(data.data);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(result.generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Success screen ──
  if (result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-bold text-green-800">
            Admin Created Successfully!
          </h3>
        </div>

        <div className="bg-white rounded-xl p-4 border border-green-200 mb-4">
          <p className="text-sm text-gray-600 mb-1">
            Name: <strong>{result.name}</strong>
          </p>
          <p className="text-sm text-gray-600 mb-3">
            Email: <strong>{result.email || result.mobile}</strong>
          </p>

          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Generated Password (share with admin):
          </p>
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3 border">
            <code className="flex-1 font-mono text-lg tracking-widest text-indigo-700">
              {showPassword
                ? result.generatedPassword
                : "•".repeat(result.generatedPassword.length)}
            </code>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={copyPassword}
              className="text-indigo-500 hover:text-indigo-700"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-red-500 mt-2">
            ⚠️ Save this password now — it won't be shown again
          </p>
        </div>

        <button
          onClick={() => {
            setResult(null);
            setForm({
              name: "",
              email: "",
              mobile: "",
              assignedPermissions: ["dashboard"],
            });
          }}
          className="text-sm text-indigo-600 hover:underline font-medium"
        >
          + Create another admin
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Enter admin's full name"
          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Email + Mobile row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="admin@email.com"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mobile
          </label>
          <input
            type="tel"
            value={form.mobile}
            onChange={(e) => setForm({ ...form, mobile: e.target.value })}
            placeholder="+91 9876543210"
            className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Permissions */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Assign Permissions
          </label>
          <div className="flex gap-3 text-xs">
            <button
              onClick={selectAll}
              className="text-indigo-600 hover:underline font-medium"
            >
              Select All
            </button>
            <button
              onClick={clearAll}
              className="text-gray-500 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {ALL_PERMISSIONS.map((perm) => {
            const isSelected = form.assignedPermissions.includes(perm.key);
            return (
              <label
                key={perm.key}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all text-sm ${
                  isSelected
                    ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-medium"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => togglePermission(perm.key)}
                  className="accent-indigo-600"
                />
                {perm.label}
              </label>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800">
        <strong>Note:</strong> Password will be auto-generated and shown once.
        Credentials will also be emailed to the admin.
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <RefreshCw className="w-4 h-4 animate-spin" />
        ) : (
          <UserPlus className="w-4 h-4" />
        )}
        {loading ? "Creating..." : "Create Admin"}
      </button>
    </div>
  );
}

// ── Admin List ─────────────────────────────────────────────
function AdminList({ refresh }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/manage/all");
      setAdmins(data.data || []);
    } catch {
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins, refresh]);

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handlePermissionChange = (adminId, key, checked) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a._id === adminId
          ? {
              ...a,
              adminPermissions: checked
                ? [...(a.adminPermissions || []), key]
                : (a.adminPermissions || []).filter((p) => p !== key),
            }
          : a
      )
    );
  };

  const savePermissions = async (admin) => {
    setSavingId(admin._id);
    try {
      await api.patch(`/admin/manage/${admin._id}/permissions`, {
        permissions: admin.adminPermissions,
      });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update");
    } finally {
      setSavingId(null);
    }
  };

  const handleSuspend = async (adminId, currentStatus) => {
    const action = currentStatus === "suspended" ? "activate" : "suspend";
    if (!confirm(`Are you sure you want to ${action} this admin?`)) return;

    try {
      await api.patch(`/admin/manage/${adminId}/suspend`, {
        status: currentStatus === "suspended" ? "active" : "suspended",
      });
      fetchAdmins();
    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (admins.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
        <p className="font-medium">No admins yet</p>
        <p className="text-sm">Create your first admin above</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {admins.map((admin) => {
        const isExpanded = expandedId === admin._id;
        return (
          <div
            key={admin._id}
            className="border border-gray-200 rounded-2xl overflow-hidden"
          >
            {/* Admin row */}
            <div className="flex items-center justify-between p-4 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {(admin.name || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">
                    {admin.name || "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {admin.email || admin.mobile}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    admin.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {admin.status}
                </span>

                {/* Suspend/Activate */}
                <button
                  onClick={() => handleSuspend(admin._id, admin.status)}
                  title={
                    admin.status === "suspended" ? "Activate" : "Suspend"
                  }
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-red-500"
                >
                  <Ban className="w-4 h-4" />
                </button>

                {/* Expand */}
                <button
                  onClick={() => toggleExpand(admin._id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Expanded: Permissions editor */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                  Edit Permissions
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                  {ALL_PERMISSIONS.map((perm) => {
                    const isChecked = (admin.adminPermissions || []).includes(
                      perm.key
                    );
                    return (
                      <label
                        key={perm.key}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm transition-all ${
                          isChecked
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700 font-medium"
                            : "bg-white border-gray-200 text-gray-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) =>
                            handlePermissionChange(
                              admin._id,
                              perm.key,
                              e.target.checked
                            )
                          }
                          className="accent-indigo-600"
                        />
                        {perm.label}
                      </label>
                    );
                  })}
                </div>
                <button
                  onClick={() => savePermissions(admin)}
                  disabled={savingId === admin._id}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  {savingId === admin._id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Save Permissions
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function ManageAdmins() {
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  // Access guard
  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center">
        <Shield className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Access Denied</h2>
        <p className="text-gray-500 text-sm">
          Only Super Admins can manage admin accounts.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 text-indigo-600 text-sm hover:underline"
        >
          ← Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <UserCog className="w-5 h-5 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Manage Admins</h1>
        </div>
        <p className="text-sm text-gray-500">
          Create admin accounts, assign permissions, and manage access.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        {[
          { key: "list", label: "All Admins", icon: Users },
          { key: "create", label: "Create Admin", icon: UserPlus },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        {activeTab === "create" ? (
          <CreateAdminForm
            onSuccess={() => {
              setRefreshKey((k) => k + 1);
            }}
          />
        ) : (
          <AdminList refresh={refreshKey} />
        )}
      </div>
    </div>
  );
}