import { cn } from "@/lib/utils";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export function Select({ label, error, className, id, children, ...props }: SelectProps) {
  const selectId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-medium text-brand-900"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          "w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-brand-950 transition focus:outline-none focus:ring-2",
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-200"
            : "border-brand-200 focus:border-brand-500 focus:ring-brand-200",
          className
        )}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
