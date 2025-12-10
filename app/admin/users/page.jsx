// app/admin/users/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import {
  FiUserPlus,
  FiUsers,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMail,
  FiLock,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  // Create form (for modal)
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
  });

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    try {
      const [usersData, rolesData] = await Promise.all([
        apiFetch("/users"),
        apiFetch("/roles"),
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      setError(err?.message || "Failed to load data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // ===== CREATE USER =====
  async function handleCreate(e) {
    e && e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      setCreateForm({ full_name: "", email: "", password: "", role_id: "" });
      setCreateOpen(false);
      await loadData();

      Swal.fire({
        icon: "success",
        title: "User created",
        text: "The user has been added successfully.",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err?.message || "Failed to create user");
      Swal.fire({
        icon: "error",
        title: "Failed to create user",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  // ===== OPEN EDIT MODAL =====
  function openEditModal(user) {
    setEditUser(user);
    setEditForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password: "",
      role_id: user.role?.id || "",
      is_active: !!user.is_active,
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditUser(null);
  }

  // ===== UPDATE USER =====
  async function handleUpdate(e) {
    e && e.preventDefault();
    if (!editUser) return;
    setLoadingEdit(true);

    try {
      const body = {
        full_name: editForm.full_name,
        email: editForm.email,
        is_active: editForm.is_active,
        role_id: editForm.role_id,
      };

      if (editForm.password?.trim()) {
        body.password = editForm.password.trim();
      }

      await apiFetch(`/users/${editUser.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      await loadData();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "User updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update user",
        text: err?.message || "Something went wrong",
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // ===== DELETE USER =====
  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this user?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      await loadData();
      Swal.fire({
        icon: "success",
        title: "User deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete user",
        text: err?.message || "Something went wrong",
      });
    }
  }

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.is_active).length;

  return (
    <section className="space-y-6">
      {/* Header + stats + Add button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiUsers className="text-slate-500" />
            Users
          </h2>
          <p className="text-xs text-slate-500">
            Manage admin, HR, managers, and employees.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-2 text-xs">
            <div className="px-3 py-2 rounded-2xl bg-slate-900 text-white flex items-center gap-2">
              <FiUsers size={14} />
              <span>Total:</span>
              <span className="font-semibold">{totalUsers}</span>
            </div>
            <div className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 flex items-center gap-2">
              <FiCheckCircle size={14} />
              <span>Active:</span>
              <span className="font-semibold">{activeUsers}</span>
            </div>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-3 py-2 text-sm hover:opacity-95"
          >
            <FiUserPlus />
            Add user
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Users table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FiUsers className="text-slate-500" size={14} />
          All Users
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] text-slate-500">
                <th className="text-left px-3 py-2 border-b border-border">ID</th>
                <th className="text-left px-3 py-2 border-b border-border">Name</th>
                <th className="text-left px-3 py-2 border-b border-border">Email</th>
                <th className="text-left px-3 py-2 border-b border-border">Role</th>
                <th className="text-left px-3 py-2 border-b border-border">Active</th>
                <th className="text-right px-3 py-2 border-b border-border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0 hover:bg-slate-50 transition">
                  <td className="px-3 py-2 text-slate-500">{u.id}</td>
                  <td className="px-3 py-2 text-slate-900">{u.full_name}</td>
                  <td className="px-3 py-2 text-slate-600">{u.email}</td>
                  <td className="px-3 py-2 text-slate-700">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] uppercase tracking-wide">
                      <FiShield size={10} />
                      {u.role?.name || "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    {u.is_active ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 text-[11px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border text-slate-700 hover:bg-slate-100 text-[11px]"
                        title="Edit"
                      >
                        <FiEdit2 size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[11px]"
                        title="Delete"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-4 text-center text-xs text-slate-500">
                    No users yet. Click “Add user” to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE Modal */}
      {createOpen && (
        <Modal onClose={() => setCreateOpen(false)} title="Add user">
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Full name</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.full_name}
                onChange={(e) => setCreateForm({ ...createForm, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Email</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Password</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Role</label>
              <select
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.role_id}
                onChange={(e) => setCreateForm({ ...createForm, role_id: e.target.value })}
                required
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-3 py-1.5 rounded-full border border-border text-[11px] text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800">
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT Modal */}
      {editOpen && (
        <Modal onClose={closeEditModal} title="Edit user">
          <form onSubmit={handleUpdate} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Full name</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Email</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">New password (optional)</label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                type="password"
                placeholder="Leave blank to keep current password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Role</label>
              <select
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.role_id}
                onChange={(e) => setEditForm({ ...editForm, role_id: e.target.value })}
                required
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">Status</label>
              <button
                type="button"
                onClick={() => setEditForm(prev => ({ ...prev, is_active: !prev.is_active }))}
                className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] border ${editForm.is_active ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-border text-slate-600"}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${editForm.is_active ? "bg-emerald-500" : "bg-slate-400"}`}></span>
                {editForm.is_active ? "Active" : "Inactive"}
              </button>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={closeEditModal} className="px-3 py-1.5 rounded-full border border-border text-[11px] text-slate-700 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={loadingEdit} className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800">
                {loadingEdit ? "Saving..." : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* ---------- Modal component (local, simple) ---------- */
function Modal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100">
            <FiX size={16} />
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
