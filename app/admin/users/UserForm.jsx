"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function UserForm({
  form,
  setForm,
  roles,
  departments,
  onSubmit,
  isEdit,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const input =
    "w-full rounded-xl border border-slate-300 px-3 py-2 text-xs focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input className={input} placeholder="Username"
        value={form.username}
        onChange={e => setForm({ ...form, username: e.target.value })}
        required />

      <input className={input} placeholder="Full name"
        value={form.full_name}
        onChange={e => setForm({ ...form, full_name: e.target.value })}
        required />

      <input className={input} type="email" placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required />

      <select className={input} value={form.department_id}
        onChange={e => setForm({ ...form, department_id: e.target.value })}>
        <option value="">Select department</option>
        {departments.map(d => (
          <option key={d.id} value={d.id}>{d.name}</option>
        ))}
      </select>

      {/* PASSWORD */}
      <div className="relative">
        <input
          className={input}
          type={showPwd ? "text" : "password"}
          placeholder={isEdit ? "New password (optional)" : "Password"}
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required={!isEdit}
        />
        <button
          type="button"
          onClick={() => setShowPwd(p => !p)}
          className="absolute right-3 top-2.5 text-slate-500"
        >
          {showPwd ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {/* CONFIRM PASSWORD */}
      <input
        className={input}
        type={showPwd ? "text" : "password"}
        placeholder="Confirm password"
        value={form.confirm_password}
        onChange={e => setForm({ ...form, confirm_password: e.target.value })}
        required={!isEdit || form.password}
      />

      <select className={input} value={form.role_id}
        onChange={e => setForm({ ...form, role_id: e.target.value })}
        required>
        <option value="">Select role</option>
        {roles.map(r => (
          <option key={r.id} value={r.id}>{r.name}</option>
        ))}
      </select>

      {isEdit && (
        <div className="flex justify-between items-center border rounded-xl px-3 py-2">
          <span className="text-xs">Active</span>
          <input type="checkbox"
            checked={form.is_active}
            onChange={() => setForm(p => ({ ...p, is_active: !p.is_active }))} />
        </div>
      )}

      <button className="w-full rounded-xl bg-indigo-600 py-2 text-xs font-medium text-white hover:bg-indigo-700">
        {isEdit ? "Save changes" : "Create user"}
      </button>
    </form>
  );
}
