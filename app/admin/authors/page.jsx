// app/admin/authors/page.jsx
"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import {
  FiUser,
  FiUserPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiMail,
  FiImage,
  FiType,
  FiFeather,
} from "react-icons/fi";

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [error, setError] = useState("");

  // Create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    slug: "",
    role: "",
    bio: "",
    avatar: "",
  });
  const [loadingCreate, setLoadingCreate] = useState(false);

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editAuthor, setEditAuthor] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    slug: "",
    role: "",
    bio: "",
    avatar: "",
  });
  const [loadingEdit, setLoadingEdit] = useState(false);

  async function loadAuthors() {
    try {
      const data = await apiFetch("/authors");
      setAuthors(data || []);
    } catch (err) {
      setError(err.message || "Failed to load authors");
    }
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  // small helper to slugify
  function toSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // ===== CREATE AUTHOR =====
  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    setLoadingCreate(true);

    try {
      await apiFetch("/authors", {
        method: "POST",
        body: JSON.stringify(createForm),
      });

      setCreateForm({
        name: "",
        slug: "",
        role: "",
        bio: "",
        avatar: "",
      });
      setCreateOpen(false);
      await loadAuthors();

      Swal.fire({
        icon: "success",
        title: "Author created",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      setError(err.message || "Failed to create author");
      Swal.fire({
        icon: "error",
        title: "Failed to create author",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingCreate(false);
    }
  }

  // ===== OPEN EDIT MODAL =====
  function openEditModal(author) {
    setEditAuthor(author);
    setEditForm({
      name: author.name || "",
      slug: author.slug || "",
      role: author.role || "",
      bio: author.bio || "",
      avatar: author.avatar || "",
    });
    setEditOpen(true);
  }

  function closeEditModal() {
    setEditOpen(false);
    setEditAuthor(null);
  }

  // ===== UPDATE AUTHOR =====
  async function handleUpdate(e) {
    e.preventDefault();
    if (!editAuthor) return;
    setLoadingEdit(true);

    try {
      await apiFetch(`/authors/${editAuthor.id}`, {
        method: "PUT",
        body: JSON.stringify(editForm),
      });

      await loadAuthors();
      closeEditModal();

      Swal.fire({
        icon: "success",
        title: "Author updated",
        timer: 1200,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to update author",
        text: err.message || "Something went wrong",
      });
    } finally {
      setLoadingEdit(false);
    }
  }

  // ===== DELETE AUTHOR =====
  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this author?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/authors/${id}`, { method: "DELETE" });
      await loadAuthors();
      Swal.fire({
        icon: "success",
        title: "Author deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete author",
        text: err.message || "Something went wrong",
      });
    }
  }

  const totalAuthors = authors.length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiUser className="text-slate-500" />
            Authors
          </h2>
          <p className="text-xs text-slate-500">
            Manage blog authors, bios, and avatars.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 text-white text-xs inline-flex items-center gap-2">
            <FiUser size={14} />
            <span>Total authors:</span>
            <span className="font-semibold">{totalAuthors}</span>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-3 py-2 text-sm hover:opacity-95"
          >
            <FiUserPlus size={16} />
            Add author
          </button>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Authors list */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FiUser className="text-slate-500" size={14} />
          All Authors
        </h3>

        <div className="space-y-2">
          {authors.map((a) => {
            const initials =
              a.name
                ?.split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0]?.toUpperCase())
                .join("") || "AU";

            return (
              <div
                key={a.id}
                className="flex items-start justify-between gap-3 border border-border rounded-xl px-3 py-3 bg-white"
              >
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden text-xs font-semibold text-slate-900">
                    {a.avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-slate-900">
                      {a.name}
                    </p>
                    {a.role && (
                      <p className="text-[11px] text-slate-500">
                        {a.role}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400">
                      slug: <span className="font-mono text-slate-600">{a.slug}</span>
                    </p>
                    {a.bio && (
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {a.bio}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(a)}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border text-slate-700 hover:bg-slate-100 text-[11px]"
                    title="Edit"
                  >
                    <FiEdit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(a.id)}
                    className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[11px]"
                    title="Delete"
                  >
                    <FiTrash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}

          {authors.length === 0 && (
            <p className="text-xs text-slate-500">
              No authors yet. Click “Add author” to create one.
            </p>
          )}
        </div>
      </div>

      {/* CREATE modal */}
      {createOpen && (
        <Modal title="Add author" onClose={() => setCreateOpen(false)}>
          <form onSubmit={handleCreate} className="space-y-3 text-xs">
            {/* Name */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiType size={13} />
                </span>
                <input
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
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
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Slug
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none font-mono text-[11px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.slug}
                onChange={(e) =>
                  setCreateForm({ ...createForm, slug: toSlug(e.target.value) })
                }
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                Used in URLs (must be unique).
              </p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Role / Title
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiFeather size={13} />
                </span>
                <input
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  placeholder='e.g. "Senior SEO Strategist"'
                  value={createForm.role}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, role: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Avatar URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiImage size={13} />
                </span>
                <input
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  placeholder="https://..."
                  value={createForm.avatar}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, avatar: e.target.value })
                  }
                />
              </div>
              {createForm.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={createForm.avatar}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Avatar preview
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none text-xs resize-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={createForm.bio}
                onChange={(e) =>
                  setCreateForm({ ...createForm, bio: e.target.value })
                }
              />
            </div>

            {/* Actions */}
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
                {loadingCreate ? "Creating…" : "Create author"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT modal */}
      {editOpen && (
        <Modal title="Edit author" onClose={closeEditModal}>
          <form onSubmit={handleUpdate} className="space-y-3 text-xs">
            {/* Name */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Name
              </label>
              <input
                className="w-full bg:white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Slug
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none font-mono text-[11px] focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.slug}
                onChange={(e) =>
                  setEditForm({ ...editForm, slug: toSlug(e.target.value) })
                }
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Role / Title
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm({ ...editForm, role: e.target.value })
                }
              />
            </div>

            {/* Avatar */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Avatar URL
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                placeholder="https://..."
                value={editForm.avatar}
                onChange={(e) =>
                  setEditForm({ ...editForm, avatar: e.target.value })
                }
              />
              {editForm.avatar && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editForm.avatar}
                      alt="Avatar preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Avatar preview
                  </span>
                </div>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 outline-none text-xs resize-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={editForm.bio}
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
              />
            </div>

            {/* Actions */}
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

/* Shared local modal */
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
