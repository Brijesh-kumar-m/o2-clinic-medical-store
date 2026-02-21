import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn, buttonVariants } from './variants';

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

export { Button };
