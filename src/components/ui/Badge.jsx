import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from './Button';

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-white",
        secondary: "bg-surface-light text-txt-secondary",
        success: "bg-medical-success/10 text-medical-success border border-medical-success/20",
        warning: "bg-medical-warning/10 text-medical-warning border border-medical-warning/20",
        error: "bg-medical-error/10 text-medical-error border border-medical-error/20",
        info: "bg-medical-info/10 text-medical-info border border-medical-info/20",
        outline: "text-txt-body border border-surface-border hover:bg-surface-light",
        premium: "bg-gradient-premium text-white shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
