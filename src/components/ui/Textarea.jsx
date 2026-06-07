import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Textarea = forwardRef(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            'placeholder:text-slate-400',
            error
              ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
              : 'border-slate-200 hover:border-slate-300',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea };
