import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Input = forwardRef(
  ({ className, label, error, helperText, leftIcon, rightIcon, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              'placeholder:text-slate-400',
              error
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
                : 'border-slate-200 hover:border-slate-300',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
