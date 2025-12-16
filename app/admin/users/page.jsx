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
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";

/* ================= CONSTANTS ================= */
const DEPARTMENTS = [
  "Graphic Design",
  "HR",
  "Web Development",
  "Content",
  "SEO",
  "Social Media",
  "Video Editing",
  "Intern",
];

/* ================= PAGE ================= */
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [createForm, setCreateForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    dept: "",
    role_id: "",
  });

  const [editForm, setEditForm] = useState({
    username: "",
    full_name: "",
    email: "",
    password: "",
    dept: "",
    role_id: "",
    is_active: true,
  });

  async function loadData() {
    const [u, r] = await Promise.all([
      apiFetch("/users"),
      apiFetch("/roles"),
    ]);
    setUsers(u || []);
    setRoles(r || []);
  }

  useEffect(() => {
    loadData();
  }, []);

  /* ================= CREATE ================= */
  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      setCreateForm({
        username: "",
        full_name: "",
        email: "",
        password: "",
        dept: "",
        role_id: "",
      });

      setCreateOpen(false);
      await loadData();

      Swal.fire({ icon: "success", title: "User created", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Failed", text: err?.message });
    } finally {
      setLoading(false);
    }
  }

  /* ================= EDIT ================= */
  function openEdit(user) {
    setEditUser(user);
    setEditForm({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      password: "",
      dept: user.dept || "",
      role_id: user.role?.id || "",
      is_active: user.is_active,
    });
    setEditOpen(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoadingEdit(true);

    const payload = { ...editForm };
    if (!payload.password) delete payload.password;

    await apiFetch(`/users/${editUser.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    setEditOpen(false);
    await loadData();

    Swal.fire({ icon: "success", title: "Updated", timer: 1000, showConfirmButton: false });
    setLoadingEdit(false);
  }

  async function handleDelete(id) {
    const ok = await Swal.fire({
      title: "Delete user?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });

    if (!ok.isConfirmed) return;

    await apiFetch(`/users/${id}`, { method: "DELETE" });
    await loadData();
  }

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.is_active).length;

  return (
    <section className="space-y-6">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiUsers className="text-indigo-600" />
          <div>
            <h1 className="text-lg font-semibold">Users</h1>
            <p className="text-xs text-slate-500">Manage employees & access</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Stat label="Total" value={totalUsers} dark />
          <Stat label="Active" value={activeUsers} />

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
          >
            <FiUserPlus /> Add User
          </button>
        </div>
      </header>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                      {u.full_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium">{u.full_name}</p>
                      <p className="text-[11px] text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3">
                  {u.dept ? (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium">
                      {u.dept}
                    </span>
                  ) : "—"}
                </td>

                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700 uppercase">
                    <FiShield size={10} /> {u.role?.name}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {u.is_active ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600">
                      <FiCheckCircle /> Active
                    </span>
                  ) : (
                    <span className="text-slate-400">Inactive</span>
                  )}
                </td>

                <td className="px-4 py-3 text-right space-x-1">
                  <IconBtn onClick={() => openEdit(u)}><FiEdit2 /></IconBtn>
                  <IconBtn danger onClick={() => handleDelete(u.id)}><FiTrash2 /></IconBtn>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <Modal title="Add user" onClose={() => setCreateOpen(false)}>
          <UserForm
            form={createForm}
            setForm={setCreateForm}
            roles={roles}
            submitLabel={loading ? "Creating..." : "Create user"}
            onSubmit={handleCreate}
          />
        </Modal>
      )}

      {editOpen && (
        <Modal title="Edit user" onClose={() => setEditOpen(false)}>
          <UserForm
            isEdit
            form={editForm}
            setForm={setEditForm}
            roles={roles}
            submitLabel={loadingEdit ? "Saving..." : "Save changes"}
            onSubmit={handleUpdate}
          />
        </Modal>
      )}
    </section>
  );
}

/* ================= COMPONENTS ================= */

function Stat({ label, value, dark }) {
  return (
    <div className={`px-4 py-2 rounded-xl text-xs font-medium shadow ${
      dark ? "bg-slate-900 text-white" : "bg-emerald-50 text-emerald-700 border"
    }`}>
      {label}: {value}
    </div>
  );
}

function IconBtn({ children, danger, ...props }) {
  return (
    <button
      {...props}
      className={`h-8 w-8 rounded-full inline-flex items-center justify-center
        ${danger ? "text-red-600 hover:bg-red-50" : "text-indigo-600 hover:bg-indigo-50"}`}
    >
      {children}
    </button>
  );
}

function UserForm({ form, setForm, roles, onSubmit, submitLabel, isEdit }) {
  const input =
    "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input className={input} placeholder="Username" value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })} required />

      <input className={input} placeholder="Full name" value={form.full_name}
        onChange={e => setForm({ ...form, full_name: e.target.value })} required />

      <input className={input} type="email" placeholder="Email" value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })} required />

      <select className={input} value={form.dept}
        onChange={e => setForm({ ...form, dept: e.target.value })}>
        <option value="">Select department</option>
        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <input className={input} type="password"
        placeholder={isEdit ? "New password (optional)" : "Password"}
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required={!isEdit}
      />

      <select className={input} value={form.role_id}
        onChange={e => setForm({ ...form, role_id: e.target.value })} required>
        <option value="">Select role</option>
        {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
      </select>

      {isEdit && (
        <div className="flex items-center justify-between rounded-xl border px-3 py-2">
          <span className="text-xs text-slate-600">Active user</span>
          <button
            type="button"
            onClick={() => setForm(p => ({ ...p, is_active: !p.is_active }))}
            className={`relative w-11 h-6 rounded-full ${
              form.is_active ? "bg-emerald-500" : "bg-slate-300"
            }`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
              form.is_active ? "left-5" : "left-0.5"
            }`} />
          </button>
        </div>
      )}

      <button className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-700">
        {submitLabel}
      </button>
    </form>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
