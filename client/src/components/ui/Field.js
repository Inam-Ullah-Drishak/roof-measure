// Labeled input with optional hint/error. Pass any <input> props through.
export default function Field({ label, id, hint, error, className = "", ...props }) {
  const inputId = id || props.name;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-slate-800">
          {label}
          {props.required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`block w-full rounded-lg border bg-white px-3.5 py-2.5 text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 focus:border-brand-500 focus:ring-brand-200"
        }`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={hint || error ? `${inputId}-hint` : undefined}
        {...props}
      />
      {(error || hint) && (
        <p id={`${inputId}-hint`} className={`mt-1.5 text-sm ${error ? "text-red-600" : "text-slate-500"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}
