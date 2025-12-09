// app/admin/roles/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import {
  FiShield,
  FiPlusCircle,
  FiTrash2,
  FiEdit2,
  FiX,
} from "react-icons/fi";

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);

  async function loadRoles() {
    try {
      const data = await apiFetch("/roles");
      setRoles(data);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadRoles();
  }, []);

  // ===== CREATE ROLE =====
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/roles", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", description: "" });
      await loadRoles();

      Swal.fire({
        icon: "success",
        title: "Role created",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Failed to create role",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  // ===== OPEN EDIT MODAL =====
  function openEditModal(role) {
    setEditRole(role);
    setEditForm({
      name: role.name || "",
      description: role.description || "",
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditRole(null);
  }

  // ===== UPDATE ROLE =====
  async function handleUpdate(e) {
    e.preventDefault();
    if (!editRole) return;
    setLoadingEdit(true);

    try {
      await apiFetch(`/roles/${editRole.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      await loadRoles();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "Role updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update role",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // ===== DELETE ROLE =====
  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this role?",
      text: "If any users are linked, delete may fail.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/roles/${id}`, { method: "DELETE" });
      await loadRoles();
      Swal.fire({
        icon: "success",
        title: "Role deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete role",
        text: err.message || "Something went wrong",
      });
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-50">
            <FiShield className="text-slate-400" />
            Roles
          </h2>
          <p className="text-xs text-slate-400">
            Define access levels like admin, manager, HR, employee.
          </p>
        </div>
        <div className="px-3 py-2 rounded-2xl bg-slate-900 text-slate-100 text-xs inline-flex items-center gap-2">
          <FiShield size={14} />
          <span>Total roles:</span>
          <span className="font-semibold">{roles.length}</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-900/70 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Create role card */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center">
              <FiPlusCircle className="text-slate-100" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-50">
                Create Role
              </h3>
              <p className="text-xs text-slate-400">
                Give each role a clear name and description.
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleCreate}
          className="grid gap-3 md:grid-cols-3 text-xs"
        >
          <input
            className="border border-slate-700 bg-slate-900 text-slate-50 rounded-xl px-3 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
            placeholder="Role name (admin, manager, hr, employee...)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="border border-slate-700 bg-slate-900 text-slate-50 rounded-xl px-3 py-2 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500 md:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          <button
            type="submit"
            disabled={loading}
            className="md:col-span-3 inline-flex items-center justify-center gap-2 bg-slate-50 text-slate-950 rounded-xl py-2 text-xs font-medium hover:bg-white disabled:opacity-60 transition"
          >
            {loading ? "Creating…" : "Create Role"}
          </button>
        </form>
      </div>

      {/* Roles list */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-50 mb-3 flex items-center gap-2">
          <FiShield className="text-slate-400" size={14} />
          All Roles
        </h3>

        <div className="space-y-2">
          {roles.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between gap-3 border border-slate-800 rounded-xl px-3 py-2 bg-slate-900/60"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-[11px] uppercase text-slate-100">
                  {r.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-50">
                    {r.name}
                  </p>
                  {r.description && (
                    <p className="text-xs text-slate-400">
                      {r.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(r)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800 text-[11px]"
                  title="Edit"
                >
                  <FiEdit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-900 text-red-300 hover:bg-red-950/80 text-[11px]"
                  title="Delete"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {roles.length === 0 && (
            <p className="text-xs text-slate-500">
              No roles yet. Create one above.
            </p>
          )}
        </div>
      </div>

      {/* Edit Role Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-50 flex items-center gap-2">
                  <FiEdit2 className="text-slate-400" />
                  Edit Role
                </h3>
                <p className="text-[11px] text-slate-400">
                  Update role name or description.
                </p>
              </div>
              <button
                onClick={closeEditModal}
                className="h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-800"
              >
                <FiX size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Role name
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Description
                </label>
                <input
                  className="w-full bg-slate-900 text-slate-50 border border-slate-700 rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-500"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      description: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-3 py-1.5 rounded-full border border-slate-700 text-[11px] text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingEdit}
                  className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-950 text-[11px] font-medium hover:bg-white disabled:opacity-60"
                >
                  {loadingEdit ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
