import React from 'react';
import { cn } from './variants';

const Input = React.forwardRef(({ className, type, label, error, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-txt-dark ml-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-md border border-surface-border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-placeholder focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          error && "border-medical-error focus-visible:ring-medical-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-medical-error ml-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
