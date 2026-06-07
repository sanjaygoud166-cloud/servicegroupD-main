import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

const Select = forwardRef(
  ({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 appearance-none',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
              error
                ? 'border-error-300 focus:ring-error-500 focus:border-error-500'
                : 'border-slate-200 hover:border-slate-300',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
        </div>
        {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
