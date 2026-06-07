import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showLabel = false,
  className,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variants = {
    default: 'bg-primary-600',
    success: 'bg-success-600',
    warning: 'bg-warning-600',
    error: 'bg-error-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-slate-700">{value}%</span>
        </div>
      )}
      <div
        className={cn(
          'w-full bg-slate-100 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', variants[variant])}
        />
      </div>
    </div>
  );
}

function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  variant = 'default',
  showLabel = true,
  className,
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percentage = Math.min(100, Math.max(0, value));
  const offset = circumference - (percentage / 100) * circumference;

  const variants = {
    default: 'stroke-primary-600',
    success: 'stroke-success-600',
    warning: 'stroke-warning-600',
    error: 'stroke-error-600',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          className="stroke-slate-100"
          fill="none"
          strokeWidth={strokeWidth}
          cx={size / 2}
          cy={size / 2}
          r={radius}
        />
        <motion.circle
          className={variants[variant]}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{percentage}%</span>
        </div>
      )}
    </div>
  );
}

export { Progress, CircularProgress };
