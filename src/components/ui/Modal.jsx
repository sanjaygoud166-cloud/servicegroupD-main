import { Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

const Modal = ({ isOpen, onClose, title, description, children, size = 'md' }) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'w-full bg-white rounded-xl shadow-xl border border-slate-200',
                  sizes[size]
                )}
              >
                {(title || description) && (
                  <div className="flex items-start justify-between p-6 border-b border-slate-100">
                    <div>
                      {title && (
                        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
                      )}
                      {description && (
                        <p className="text-sm text-slate-500 mt-1">{description}</p>
                      )}
                    </div>
                    <button
                      onClick={onClose}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                )}
                <div className="p-6">{children}</div>
              </motion.div>
            </div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export { Modal };
