import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = cva(
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

export const badgeVariants = cva(
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
