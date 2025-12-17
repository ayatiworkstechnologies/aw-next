"use client";

import { useEffect, useState, useCallback } from "react";
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
  FiLayers,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  const emptyForm = {
    username: "",
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: "",
    department_id: "",
    is_active: true,
  };

  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);

  const [showPassword, setShowPassword] = useState(false);

  /* ================= LOAD DATA (FIXED) ================= */
  const loadData = useCallback(async () => {
    const [u, r, d] = await Promise.all([
      apiFetch("/users"),
      apiFetch("/roles"),
      apiFetch("/departments"),
    ]);

    setUsers(u || []);
    setRoles(r || []);
    setDepartments(d || []);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ================= CREATE ================= */
  async function handleCreate(e) {
    e.preventDefault();

    if (createForm.password !== createForm.confirm_password) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    setLoading(true);

    try {
      const payload = { ...createForm };
      delete payload.confirm_password;

      await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setCreateForm(emptyForm);
      setCreateOpen(false);
      await loadData();

      Swal.fire({
        icon: "success",
        title: "User created",
        timer: 1200,
        showConfirmButton: false,
      });
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
      confirm_password: "",
      role_id: user.role?.id || "",
      department_id: user.department?.id || "",
      is_active: user.is_active,
    });
    setEditOpen(true);
  }

  async function handleUpdate(e) {
    e.preventDefault();

    if (
      editForm.password &&
      editForm.password !== editForm.confirm_password
    ) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    setLoadingEdit(true);

    const payload = { ...editForm };
    delete payload.confirm_password;
    if (!payload.password) delete payload.password;

    await apiFetch(`/users/${editUser.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    setEditOpen(false);
    await loadData();

    Swal.fire({
      icon: "success",
      title: "User updated",
      timer: 1000,
      showConfirmButton: false,
    });

    setLoadingEdit(false);
  }

  /* ================= DELETE ================= */
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

  const input =
    "w-full rounded-xl border border-black/10 px-3 py-2 text-xs focus:border-black/20 focus:ring-2 focus:ring-indigo-100";

  return (
    <section className="space-y-6">
      {/* ================= HEADER ================= */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FiUsers className="text-indigo-600" />
          <div>
            <h1 className="text-lg font-semibold">Users</h1>
            <p className="text-xs text-slate-500">
              Manage employees & access
            </p>
          </div>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-black/90 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
        >
          <FiUserPlus /> Add User
        </button>
      </header>

      {/* ================= TABLE ================= */}
      <div className="rounded-2xl border border-black/10 bg-white shadow-sm overflow-hidden">
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
            {users.map((u) => (
              <tr key={u.id} className="border-t border-t-black/10 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{u.full_name}</p>
                  <p className="text-[11px] text-slate-500">
                    {u.email}
                  </p>
                </td>

                <td className="px-4 py-3">
                  {u.department ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px]">
                      <FiLayers size={10} /> {u.department.name}
                    </span>
                  ) : (
                    "—"
                  )}
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
                  <button
                    onClick={() => openEdit(u)}
                    className="h-8 w-8 rounded-full text-indigo-600 hover:bg-indigo-50"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="h-8 w-8 rounded-full text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= CREATE MODAL ================= */}
      {createOpen && (
        <Modal title="Add user" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-4">
            <input className={input} placeholder="Username"
              value={createForm.username}
              onChange={e => setCreateForm({ ...createForm, username: e.target.value })}
              required />

            <input className={input} placeholder="Full name"
              value={createForm.full_name}
              onChange={e => setCreateForm({ ...createForm, full_name: e.target.value })}
              required />

            <input className={input} type="email" placeholder="Email"
              value={createForm.email}
              onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
              required />

            <select className={input} value={createForm.department_id}
              onChange={e => setCreateForm({ ...createForm, department_id: e.target.value })}>
              <option value="">Select department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* PASSWORD */}
            <div className="relative">
              <input
                className={input}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={createForm.password}
                onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-2.5 text-slate-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <input
              className={input}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={createForm.confirm_password}
              onChange={e => setCreateForm({ ...createForm, confirm_password: e.target.value })}
              required
            />

            <select className={input} value={createForm.role_id}
              onChange={e => setCreateForm({ ...createForm, role_id: e.target.value })}
              required>
              <option value="">Select role</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <button className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-700">
              {loading ? "Creating..." : "Create user"}
            </button>
          </form>
        </Modal>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editOpen && (
        <Modal title="Edit user" onClose={() => setEditOpen(false)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            {/* same fields as create */}
            <input className={input} placeholder="Username"
              value={editForm.username}
              onChange={e => setEditForm({ ...editForm, username: e.target.value })}
              required />

            <input className={input} placeholder="Full name"
              value={editForm.full_name}
              onChange={e => setEditForm({ ...editForm, full_name: e.target.value })}
              required />

            <input className={input} type="email" placeholder="Email"
              value={editForm.email}
              onChange={e => setEditForm({ ...editForm, email: e.target.value })}
              required />

            <select className={input} value={editForm.department_id}
              onChange={e => setEditForm({ ...editForm, department_id: e.target.value })}>
              <option value="">Select department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            <div className="relative">
              <input
                className={input}
                type={showPassword ? "text" : "password"}
                placeholder="New password (optional)"
                value={editForm.password}
                onChange={e => setEditForm({ ...editForm, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-2.5 text-slate-500"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <input
              className={input}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              value={editForm.confirm_password}
              onChange={e => setEditForm({ ...editForm, confirm_password: e.target.value })}
            />

            <select className={input} value={editForm.role_id}
              onChange={e => setEditForm({ ...editForm, role_id: e.target.value })}
              required>
              <option value="">Select role</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <button className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-700">
              {loadingEdit ? "Saving..." : "Save changes"}
            </button>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* ================= MODAL ================= */
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
