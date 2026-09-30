"use client";

import { useState } from "react";

// Password input with a show/hide button
export default function PasswordField({ label, id, hint, error, className = "", ...props }) {
  const [visible, setVisible] = useState(false);
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-800">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type={visible ? "text" : "password"}
          className={`block w-full rounded-lg border bg-white py-2.5 pl-3.5 pr-16 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-slate-300 focus:border-brand-500 focus:ring-brand-200"
          }`}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={hint || error ? `${inputId}-hint` : undefined}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-0 px-3 text-sm font-medium text-slate-500 hover:text-slate-800"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? "Hide" : "Show"}
        </button>
      </div>
      {(error || hint) && (
        <p id={`${inputId}-hint`} className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
