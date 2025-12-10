// app/admin/categories/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import { FiTag, FiPlusCircle, FiEdit2, FiTrash2, FiX } from "react-icons/fi";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  async function loadCategories() {
    try {
      const data = await apiFetch("/categories");
      setCategories(data || []);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  function toSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // CREATE
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoadingCreate(true);

    try {
      await apiFetch("/categories", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      setCreateForm({ name: "", slug: "", description: "" });
      setCreateOpen(false);
      await loadCategories();

      Swal.fire({
        icon: "success",
        title: "Category created",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message || "Failed to create category");
      Swal.fire({
        icon: "error",
        title: "Failed to create category",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingCreate(false);
    }
  }

  // EDIT OPEN/CLOSE
  function openEditModal(category) {
    setEditCategory(category);
    setEditForm({
      name: category.name || "",
      slug: category.slug || "",
      description: category.description || "",
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditCategory(null);
  }

  // UPDATE
  async function handleUpdate(e) {
    e.preventDefault();
    if (!editCategory) return;
    setLoadingEdit(true);

    try {
      await apiFetch(`/categories/${editCategory.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      await loadCategories();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "Category updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update category",
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
      title: "Delete this category?",
      text: "If any posts are linked, delete may fail.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/categories/${id}`, { method: "DELETE" });
      await loadCategories();
      Swal.fire({
        icon: "success",
        title: "Category deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete category",
        text: err.message || "Something went wrong",
      });
    }
  }

  const totalCategories = categories.length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiTag className="text-slate-500" />
            Categories
          </h2>
          <p className="text-xs text-slate-500">
            Group your blogs into clear categories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 text-white text-xs inline-flex items-center gap-2">
            <FiTag size={14} />
            <span>Total categories:</span>
            <span className="font-semibold">{totalCategories}</span>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-3 py-2 text-sm hover:opacity-95"
          >
            <FiPlusCircle size={16} />
            Add category
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Categories list */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FiTag className="text-slate-500" size={14} />
          All Categories
        </h3>

        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="flex items-start justify-between gap-3 border border-border rounded-xl px-3 py-3 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center text-[11px] uppercase text-white">
                  {c.name?.[0]}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-slate-900">
                    {c.name}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    slug:{" "}
                    <span className="font-mono text-slate-600">
                      {c.slug}
                    </span>
                  </p>
                  {c.description && (
                    <p className="text-xs text-slate-600 line-clamp-2">
                      {c.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(c)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border text-slate-700 hover:bg-slate-100 text-[11px]"
                  title="Edit"
                >
                  <FiEdit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[11px]"
                  title="Delete"
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-xs text-slate-500">
              No categories yet. Click “Add category” to create one.
            </p>
          )}
        </div>
      </div>

      {/* CREATE modal */}
      {createOpen && (
        <Modal title="Add category" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Name
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setCreateForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.slug || toSlug(name),
                  }));
                }}
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Slug
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none font-mono text-[11px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.slug}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    slug: toSlug(e.target.value),
                  })
                }
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Used in URLs (must be unique).
              </p>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none text-xs resize-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-3 py-1.5 rounded-full border border-border text-[11px] text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingCreate}
                className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 disabled:opacity-60"
              >
                {loadingCreate ? "Creating…" : "Create category"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT modal */}
      {editOpen && (
        <Modal title="Edit category" onClose={closeEditModal}>
          <form onSubmit={handleUpdate} className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Name
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Slug
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none font-mono text-[11px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    slug: toSlug(e.target.value),
                  })
                }
                required
              />
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none text-xs resize-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
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
                className="px-3 py-1.5 rounded-full border border-border text-[11px] text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loadingEdit}
                className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 disabled:opacity-60"
              >
                {loadingEdit ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </section>
  );
}

/* local modal */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100"
          >
            <FiX size={16} />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
