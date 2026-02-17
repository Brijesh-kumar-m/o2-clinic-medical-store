import React from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-gradient-primary text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
        secondary: "border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/5",
        premium: "bg-gradient-premium text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
        success: "bg-gradient-success text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
        ghost: "hover:bg-brand-primary/10 text-txt-secondary hover:text-brand-primary",
        danger: "bg-medical-error text-white hover:bg-medical-error/90 shadow-md",
        outline: "border border-surface-border bg-white hover:bg-surface-light text-txt-body",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-sm",
        md: "h-11 px-6 rounded-md",
        lg: "h-14 px-8 text-lg rounded-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, isLoading, children, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = "Button";

export { Button, buttonVariants };
