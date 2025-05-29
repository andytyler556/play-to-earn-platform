import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500 shadow-sm',
  success: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm',
  warning: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400 shadow-sm',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
  outline: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary-500 shadow-sm',
  ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
};

const buttonSizes = {
  xs: 'px-2.5 py-1.5 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-6 py-3 text-base',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        className={clsx(
          // Base styles
          'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          // Variant styles
          buttonVariants[variant],
          // Size styles
          buttonSizes[size],
          // Full width
          fullWidth && 'w-full',
          // Custom className
          className
        )}
        disabled={isDisabled}
        ref={ref}
        {...props}
      >
        {loading && (
          <Loader2 className={clsx('animate-spin', size === 'xs' ? 'w-3 h-3' : 'w-4 h-4', children && 'mr-2')} />
        )}
        {!loading && leftIcon && (
          <span className={clsx(size === 'xs' ? 'w-3 h-3' : 'w-4 h-4', children && 'mr-2')}>
            {leftIcon}
          </span>
        )}
        {children}
        {!loading && rightIcon && (
          <span className={clsx(size === 'xs' ? 'w-3 h-3' : 'w-4 h-4', children && 'ml-2')}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
