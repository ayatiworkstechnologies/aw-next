// app/admin/blogs/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "../../lib/api";
import Swal from "sweetalert2";
import {
  FiFileText,
  FiPlusCircle,
  FiTrash2,
  FiEdit2,
  FiTag,
  FiUser,
  FiClock,
} from "react-icons/fi";

export default function BlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadBlogs() {
    try {
      const data = await apiFetch("/blogs");
      setBlogs(data || []);
    } catch (err) {
      setError(err.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, []);

  async function handleDelete(id) {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete this blog?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#4b5563",
      confirmButtonText: "Yes, delete",
    });

    if (!result.isConfirmed) return;

    try {
      await apiFetch(`/blogs/${id}`, { method: "DELETE" });
      await loadBlogs();
      Swal.fire({
        icon: "success",
        title: "Blog deleted",
        timer: 1000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to delete blog",
        text: err.message || "Something went wrong",
      });
    }
  }

  const publishedCount = blogs.filter((b) => b.is_published).length;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 text-slate-900">
            <FiFileText className="text-slate-500" />
            Blogs
          </h2>
          <p className="text-xs text-slate-500">
            Manage blog posts, authors, and publishing status.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3 py-2 rounded-2xl bg-slate-900 text-white inline-flex items-center gap-2">
            <FiFileText size={14} />
            <span>Total:</span>
            <span className="font-semibold">{blogs.length}</span>
          </div>
          <div className="px-3 py-2 rounded-2xl bg-emerald-50 text-emerald-800 border border-emerald-100 inline-flex items-center gap-2">
            <FiClock size={14} />
            <span>Published:</span>
            <span className="font-semibold">{publishedCount}</span>
          </div>
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 rounded-xl bg-primary text-white px-3 py-2 text-sm hover:opacity-95"
          >
            <FiPlusCircle size={16} />
            New blog
          </Link>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      {/* Blogs table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <FiFileText className="text-slate-500" size={14} />
          All Blogs
        </h3>

        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] text-slate-500">
                <th className="text-left px-3 py-2 border-b border-border">
                  Title
                </th>
                <th className="text-left px-3 py-2 border-b border-border">
                  Author
                </th>
                <th className="text-left px-3 py-2 border-b border-border">
                  Category
                </th>
                <th className="text-left px-3 py-2 border-b border-border">
                  Read time
                </th>
                <th className="text-left px-3 py-2 border-b border-border">
                  Status
                </th>
                <th className="text-left px-3 py-2 border-b border-border">
                  Created
                </th>
                <th className="text-right px-3 py-2 border-b border-border">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-xs text-slate-500"
                  >
                    Loading blogs…
                  </td>
                </tr>
              )}

              {!loading &&
                blogs.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border last:border-0 hover:bg-slate-50 transition"
                  >
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-slate-900 text-sm font-medium line-clamp-1">
                          {b.title}
                        </span>
                        {b.deck && (
                          <span className="text-[11px] text-slate-500 line-clamp-1">
                            {b.deck}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono">
                          {b.slug}
                        </span>
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top text-slate-600">
                      <div className="inline-flex items-center gap-1.5 text-[11px]">
                        <FiUser size={11} className="text-slate-400" />
                        <span>{b.author_name || "—"}</span>
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top text-slate-600">
                      <div className="inline-flex items-center gap-1.5 text-[11px]">
                        <FiTag size={11} className="text-slate-400" />
                        <span>{b.category_obj?.name || "—"}</span>
                      </div>
                    </td>

                    <td className="px-3 py-2 align-top text-slate-600">
                      {b.read_mins ? `${b.read_mins} min` : "—"}
                    </td>

                    <td className="px-3 py-2 align-top">
                      {b.is_published ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-50 text-slate-600 border border-border text-[10px]">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-3 py-2 align-top text-slate-500">
                      {b.created_at
                        ? new Date(b.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="px-3 py-2 align-top text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* Later you can make /admin/blogs/[id] edit page */}
                        {/* <Link ...>Edit</Link> or keep as button if you add modal */}
                        <Link
                          href={`/admin/blogs/${b.id}`}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-border text-slate-700 hover:bg-slate-100 text-[11px]"
                          title="Edit"
                        >
                          <FiEdit2 size={12} />
                        </Link>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full border border-red-200 text-red-600 hover:bg-red-50 text-[11px]"
                          title="Delete"
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && blogs.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-3 py-4 text-center text-xs text-slate-500"
                  >
                    No blogs yet. Click “New blog” to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
