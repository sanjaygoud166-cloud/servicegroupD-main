import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(
  ({ className, hover = false, padding = 'md', children, ...props }, ref) => {
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hover ? { y: -2, boxShadow: '0 12px 24px -8px rgba(0, 0, 0, 0.12)' } : undefined}
        className={cn(
          'bg-white rounded-xl border border-slate-200 shadow-sm',
          hover && 'cursor-pointer transition-all duration-200',
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = ({ className, children, ...props }) => (
  <div className={cn('mb-4', className)} {...props}>
    {children}
  </div>
);

const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn('text-lg font-semibold text-slate-900', className)} {...props}>
    {children}
  </h3>
);

const CardDescription = ({ className, children, ...props }) => (
  <p className={cn('text-sm text-slate-500 mt-1', className)} {...props}>
    {children}
  </p>
);

const CardContent = ({ className, children, ...props }) => (
  <div className={cn('', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ className, children, ...props }) => (
  <div className={cn('mt-4 pt-4 border-t border-slate-100', className)} {...props}>
    {children}
  </div>
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
