import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-medium text-brand-900"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 placeholder:text-brand-400 transition focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-brand-200 focus:border-brand-500 focus:ring-brand-200",
          className
        )}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-brand-500">{hint}</p>
      ) : null}
    </div>
  );
}
