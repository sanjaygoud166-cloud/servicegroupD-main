import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
  {
    variants: {
      variant: {
        default: 'bg-slate-100 text-slate-700 border-slate-200',
        primary: 'bg-primary-100 text-primary-700 border-primary-200',
        secondary: 'bg-secondary-100 text-secondary-700 border-secondary-200',
        success: 'bg-success-100 text-success-700 border-success-200',
        warning: 'bg-warning-100 text-warning-700 border-warning-200',
        error: 'bg-error-100 text-error-700 border-error-200',
        pending: 'bg-warning-100 text-warning-700 border-warning-200',
        verified: 'bg-success-100 text-success-700 border-success-200',
        under_review: 'bg-blue-100 text-blue-700 border-blue-200',
        rejected: 'bg-error-100 text-error-700 border-error-200',
        expired: 'bg-slate-100 text-slate-600 border-slate-200',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-1 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

function Badge({ className, variant, size, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
