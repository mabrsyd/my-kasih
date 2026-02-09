'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-in-out rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-accent disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: clsx(
          'bg-purple-primary text-white',
          'hover:bg-purple-primary/90 hover:shadow-lg',
          'active:bg-purple-primary/80',
          'focus-visible:outline-purple-primary'
        ),
        secondary: clsx(
          'bg-purple-secondary/30 text-purple-primary border border-purple-secondary',
          'hover:bg-purple-secondary/50 hover:shadow-md',
          'active:bg-purple-secondary/70',
          'focus-visible:outline-purple-secondary'
        ),
        ghost: clsx(
          'text-purple-primary hover:bg-purple-secondary/15',
          'active:bg-purple-secondary/25',
          'focus-visible:outline-purple-primary'
        ),
        link: clsx(
          'text-purple-accent underline-offset-4',
          'hover:underline hover:text-purple-primary',
          'focus-visible:outline-purple-accent'
        ),
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, fullWidth, className })}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
