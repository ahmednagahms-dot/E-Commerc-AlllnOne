import { forwardRef } from "react";

const Input = forwardRef(function Input({ label, error, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        ref={ref}
        className={`px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500
          ${error ? "border-danger" : "border-gray-300"}`}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
});

export default Input;