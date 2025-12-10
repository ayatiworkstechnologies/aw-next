// app/admin/blogs/new/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";
import Swal from "sweetalert2";
import {
  FiFileText,
  FiImage,
  FiType,
  FiTag,
  FiUser,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";

export default function NewBlogPage() {
  const router = useRouter();

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    banner_img: "",
    banner_title: "",
    deck: "",
    content: "",
    sectionsInput: "", // stringified JSON for textarea
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

  useEffect(() => {
    async function loadMeta() {
      try {
        const [authorsData, categoriesData] = await Promise.all([
          apiFetch("/authors").catch(() => []),
          apiFetch("/categories").catch(() => []),
        ]);
        setAuthors(authorsData || []);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMeta(false);
      }
    }
    loadMeta();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    // parse sections JSON if provided
    let sections = null;
    if (form.sectionsInput.trim()) {
      try {
        sections = JSON.parse(form.sectionsInput);
        if (!Array.isArray(sections)) {
          throw new Error("Sections JSON must be an array");
        }
      } catch (err) {
        setSaving(false);
        Swal.fire({
          icon: "error",
          title: "Invalid sections JSON",
          text:
            err.message ||
            "Please provide valid JSON (e.g. an array of section objects).",
        });
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
      author_id: form.author_id ? Number(form.author_id) : null,
      category_id: form.category_id ? Number(form.category_id) : null,
      read_mins: form.read_mins ? Number(form.read_mins) : null,
      is_published: form.is_published,
    };

    try {
      const created = await apiFetch("/blogs", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: "success",
        title: "Blog created",
        timer: 1300,
        showConfirmButton: false,
      });

      router.push("/admin/blogs");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to create blog",
        text: err.message || "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiFileText className="text-slate-500" />
            New Blog
          </h2>
          <p className="text-xs text-slate-500">
            Create a blog post with author, category, and banner.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="text-xs text-slate-600 hover:text-slate-900 underline"
        >
          Back to blogs
        </button>
      </div>

      {/* Form card */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title + slug */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] text-slate-500 mb-1">
                Title
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiType size={13} />
                </span>
                <input
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      slug: prev.slug || toSlug(title),
                    }));
                  }}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Slug
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                value={form.slug}
                onChange={(e) =>
                  setForm({ ...form, slug: toSlug(e.target.value) })
                }
                required
              />
              <p className="text-[10px] text-slate-400 mt-0.5">
                URL-friendly identifier (must be unique).
              </p>
            </div>
          </div>

          {/* Banner */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Banner image URL
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiImage size={13} />
                </span>
                <input
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  placeholder="https://..."
                  value={form.banner_img}
                  onChange={(e) =>
                    setForm({ ...form, banner_img: e.target.value })
                  }
                />
              </div>
              {form.banner_img && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-10 w-16 rounded-lg overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.banner_img}
                      alt="Banner preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Banner preview
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Banner title (overlay)
              </label>
              <input
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                placeholder="Optional heading shown on banner"
                value={form.banner_title}
                onChange={(e) =>
                  setForm({ ...form, banner_title: e.target.value })
                }
              />
            </div>
          </div>

          {/* Deck / meta */}
          <div className="grid md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-[11px] text-slate-500 mb-1">
                Short description / deck
              </label>
              <textarea
                rows={2}
                className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none resize-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                placeholder="One or two lines summarising the article…"
                value={form.deck}
                onChange={(e) => setForm({ ...form, deck: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Estimated read time (mins)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                    <FiClock size={13} />
                  </span>
                  <input
                    type="number"
                    min={1}
                    className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                    value={form.read_mins}
                    onChange={(e) =>
                      setForm({ ...form, read_mins: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">
                  Status
                </label>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      is_published: !prev.is_published,
                    }))
                  }
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[11px] border ${
                    form.is_published
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "bg-slate-50 border-border text-slate-600"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      form.is_published ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {form.is_published ? "Published" : "Draft"}
                </button>
              </div>
            </div>
          </div>

          {/* Author & category */}
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Author
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiUser size={13} />
                </span>
                <select
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  disabled={loadingMeta}
                  value={form.author_id}
                  onChange={(e) =>
                    setForm({ ...form, author_id: e.target.value })
                  }
                >
                  <option value="">
                    {loadingMeta ? "Loading authors…" : "Select author"}
                  </option>
                  {authors.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-slate-500 mb-1">
                Category
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 text-xs">
                  <FiTag size={13} />
                </span>
                <select
                  className="w-full bg-white text-slate-900 border border-border rounded-xl px-9 py-2 text-sm outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
                  disabled={loadingMeta}
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                >
                  <option value="">
                    {loadingMeta ? "Loading categories…" : "Select category"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-[11px] text-slate-500 mb-1">
              Content (markdown / HTML)
            </label>
            <textarea
              rows={8}
              className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-xs outline-none resize-y focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
              placeholder="Write the main article content here…"
              value={form.content}
              onChange={(e) =>
                setForm({ ...form, content: e.target.value })
              }
            />
          </div>

          {/* Sections JSON */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] text-slate-500">
                Sections JSON
              </label>
              <span className="text-[10px] text-slate-400">
                Optional. Array of section objects.
              </span>
            </div>
            <textarea
              rows={6}
              className="w-full bg-white text-slate-900 border border-border rounded-xl px-3 py-2 text-[11px] font-mono outline-none resize-y focus:border-slate-900 focus:ring-1 focus:ring-slate-900/15"
              placeholder={`e.g.\n[\n  { "type": "hero", "headline": "..." },\n  { "type": "paragraph", "content": "..." }\n]`}
              value={form.sectionsInput}
              onChange={(e) =>
                setForm({ ...form, sectionsInput: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => router.push("/admin/blogs")}
              className="px-3 py-1.5 rounded-full border border-border text-[11px] text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white text-[11px] font-medium hover:bg-slate-800 disabled:opacity-60"
            >
              <FiCheckCircle size={13} />
              {saving ? "Creating…" : "Create blog"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
