"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import Swal from "sweetalert2";
import {
  FiFileText,
  FiUser,
  FiTag,
  FiImage,
  FiClock,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";

export default function EditBlogPage() {
  const { slug } = useParams(); // ← using slug now
  const router = useRouter();

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    banner_img: "",
    banner_title: "",
    deck: "",
    content: "",
    sectionsInput: "",
    author_id: "",
    category_id: "",
    read_mins: "",
    is_published: true,
  });

  function toSlug(value) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // Load blog + meta by slug
  useEffect(() => {
    async function loadAll() {
      try {
        // NOTE: endpoint here assumes your backend exposes blog fetch by slug at /blogs/slug/:slug
        // If your API uses a different path (e.g. /blogs/:slug), change the URL accordingly.
        const [blog, authorsData, categoriesData] = await Promise.all([
          apiFetch(`/blogs/${encodeURIComponent(slug)}`),
          apiFetch("/authors").catch(() => []),
          apiFetch("/categories").catch(() => []),
        ]);

        setAuthors(authorsData || []);
        setCategories(categoriesData || []);

        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          banner_img: blog.banner_img || "",
          banner_title: blog.banner_title || "",
          deck: blog.deck || "",
          content: blog.content || "",
          sectionsInput: blog.sections
            ? JSON.stringify(blog.sections, null, 2)
            : "",
          author_id: blog.author_id || "",
          category_id: blog.category_id || "",
          read_mins: blog.read_mins || "",
          is_published: blog.is_published ?? true,
        });
      } catch (err) {
        Swal.fire("Error", "Failed to load blog", "error");
      } finally {
        setLoading(false);
      }
    }

    if (slug) loadAll();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    let sections = null;
    if (form.sectionsInput.trim()) {
      try {
        sections = JSON.parse(form.sectionsInput);
      } catch {
        setSaving(false);
        Swal.fire("Invalid JSON", "Sections JSON is invalid", "error");
        return;
      }
    }

    const payload = {
      title: form.title,
      slug: form.slug || toSlug(form.title),
      banner_img: form.banner_img || null,
      banner_title: form.banner_title || null,
      deck: form.deck || null,
      content: form.content || null,
      sections,
      author_id: form.author_id || null,
      category_id: form.category_id || null,
      read_mins: form.read_mins || null,
      is_published: form.is_published,
    };

    try {
      // NOTE: updating by slug — backend should support PUT /blogs/slug/:slug
      // If your backend expects an ID, adapt this to PUT /blogs/:id instead.
      await apiFetch(`/blogs/${encodeURIComponent(slug)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: "success",
        title: "Blog updated",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/admin/blogs");
    } catch (err) {
      Swal.fire("Error", err.message || "Update failed", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-xs text-slate-500">
        Loading blog…
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <FiFileText className="text-slate-500" />
            Edit Blog
          </h2>
          <p className="text-xs text-slate-500">Update blog details</p>
        </div>
        <button
          onClick={() => router.push("/admin/blogs")}
          className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900"
        >
          <FiArrowLeft size={12} />
          Back
        </button>
      </div>

      {/* Form */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="text-[11px] text-slate-500">Title</label>
            <input
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm focus:ring-1 focus:ring-slate-900/15"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  title: e.target.value,
                  slug: p.slug || toSlug(e.target.value),
                }))
              }
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label className="text-[11px] text-slate-500">Slug</label>
            <input
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs font-mono"
              value={form.slug}
              onChange={(e) =>
                setForm({ ...form, slug: toSlug(e.target.value) })
              }
              required
            />
          </div>

          {/* Banner */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500">Banner image</label>
              <input
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm"
                value={form.banner_img}
                onChange={(e) =>
                  setForm({ ...form, banner_img: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-500">Banner title</label>
              <input
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm"
                value={form.banner_title}
                onChange={(e) =>
                  setForm({ ...form, banner_title: e.target.value })
                }
              />
            </div>
          </div>

          {/* Deck */}
          <div>
            <label className="text-[11px] text-slate-500">Short description</label>
            <textarea
              rows={2}
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs"
              value={form.deck}
              onChange={(e) => setForm({ ...form, deck: e.target.value })}
            />
          </div>

          {/* Author & Category */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500">Author</label>
              <select
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm"
                value={form.author_id}
                onChange={(e) =>
                  setForm({ ...form, author_id: e.target.value })
                }
              >
                <option value="">Select author</option>
                {authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500">Category</label>
              <select
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm"
                value={form.category_id}
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Read mins + status */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-500">Read minutes</label>
              <input
                type="number"
                className="w-full bg-white border border-border rounded-xl px-3 py-2 text-sm"
                value={form.read_mins}
                onChange={(e) =>
                  setForm({ ...form, read_mins: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-500">Status</label>
              <button
                type="button"
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    is_published: !p.is_published,
                  }))
                }
                className={`w-full px-3 py-2 rounded-xl text-xs border ${
                  form.is_published
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-slate-50 border-border text-slate-600"
                }`}
              >
                {form.is_published ? "Published" : "Draft"}
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="text-[11px] text-slate-500">Content</label>
            <textarea
              rows={8}
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-xs"
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>

          {/* Sections */}
          <div>
            <label className="text-[11px] text-slate-500">Sections (JSON)</label>
            <textarea
              rows={6}
              className="w-full bg-white border border-border rounded-xl px-3 py-2 text-[11px] font-mono"
              value={form.sectionsInput}
              onChange={(e) =>
                setForm({ ...form, sectionsInput: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="px-3 py-1.5 border border-border rounded-full text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-xs"
            >
              {saving ? "Saving…" : "Update blog"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
