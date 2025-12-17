// app/admin/departments/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import { FiLayers, FiPlusCircle, FiTrash2, FiEdit2, FiX } from "react-icons/fi";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editDept, setEditDept] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });
  const [loadingEdit, setLoadingEdit] = useState(false);

  const [error, setError] = useState("");

  async function loadDepartments() {
    try {
      const data = await apiFetch("/departments");
      setDepartments(data || []);
    } catch (err) {
      setError(err.message || "Failed to load departments");
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  // CREATE
  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await apiFetch("/departments", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setForm({ name: "", description: "" });
      setCreateOpen(false);
      await loadDepartments();

      Swal.fire({
        icon: "success",
        title: "Department created",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to create department",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  // EDIT MODAL
  function openEditModal(dept) {
    setEditDept(dept);
    setEditForm({
      name: dept.name || "",
      description: dept.description || "",
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditDept(null);
  }

  // UPDATE
  async function handleUpdate(e) {
    e.preventDefault();
    if (!editDept) return;

    setLoadingEdit(true);
    try {
      await apiFetch(`/departments/${editDept.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });
      await loadDepartments();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "Department updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update department",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // DELETE
  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this department?",
      text: "If users are linked, delete may fail.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/departments/${id}`, { method: "DELETE" });
      await loadDepartments();
      Swal.fire({
        icon: "success",
        title: "Department deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete department",
        text: err.message || "Department is in use",
      });
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiLayers className="text-slate-500" />
            Departments
          </h2>
          <p className="text-xs text-slate-500">
            Manage departments like HR, Web Dev, UI/UX, SEO, etc.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 text-white text-xs inline-flex items-center gap-2">
            <FiLayers size={14} />
            <span>Total:</span>
            <span className="font-semibold">{departments.length}</span>
          </div>

          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-3 py-2 text-sm hover:opacity-95"
          >
            <FiPlusCircle size={16} />
            Add department
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* LIST */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FiLayers className="text-slate-500" size={14} />
          All Departments
        </h3>

        <div className="space-y-2">
          {departments.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between gap-3 border border-border rounded-xl px-3 py-2 bg-white"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[11px] uppercase text-white">
                  {d.name?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{d.name}</p>
                  {d.description && (
                    <p className="text-xs text-slate-500">{d.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(r)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border text-slate-700 hover:bg-slate-100 text-[11px]"
                  title="Edit"
                >
                  <FiEdit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[11px]"
                  title="Delete"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {departments.length === 0 && (
            <p className="text-xs text-slate-500">
              No departments yet. Click “Add department”.
            </p>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {createOpen && (
        <Modal title="Add department" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <Input
              label="Department name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <ModalActions
              onCancel={() => setCreateOpen(false)}
              loading={loading}
              submitText="Create Department"
            />
          </form>
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editOpen && (
        <Modal title="Edit department" onClose={closeEditModal}>
          <form onSubmit={handleUpdate} className="space-y-3 text-xs">
            <Input
              label="Department name"
              value={editForm.name}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
              required
            />
            <Input
              label="Description"
              value={editForm.description}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  description: e.target.value,
                })
              }
            />
            <ModalActions
              onCancel={closeEditModal}
              loading={loadingEdit}
              submitText="Save changes"
            />
          </form>
        </Modal>
      )}
    </section>
  );
}

/* ---------- Reusable UI ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-[11px] text-slate-500 mb-1">{label}</label>
      <input
        {...props}
        className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
      />
    </div>
  );
}

function ModalActions({ onCancel, loading, submitText }) {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="px-3 py-1.5 rounded-full border border-border text-[11px]"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium disabled:opacity-60"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <FiX size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
