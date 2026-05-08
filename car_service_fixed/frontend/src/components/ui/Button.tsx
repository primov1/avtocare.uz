import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-[#0F6E56] text-white hover:bg-[#0a5544] active:scale-95 shadow-md hover:shadow-lg',
        secondary: 'bg-[#E8E8E8] text-[#1A1A1A] hover:bg-[#D5D5D5] active:scale-95',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:scale-95',
        ghost: 'text-[#0F6E56] hover:bg-[#0F6E56]/10 active:scale-95',
      },
      size: {
        xs: 'h-8 px-3 text-xs',
        sm: 'h-10 px-4 text-sm',
        md: 'h-12 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button, buttonVariants };
