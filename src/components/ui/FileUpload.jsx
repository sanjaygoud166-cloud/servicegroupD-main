import { useCallback, useState } from 'react';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatFileSize } from '../../lib/utils';

function FileUpload({
  accept = '.pdf,.jpg,.jpeg,.png,.docx',
  maxSize = 10 * 1024 * 1024,
  onFileSelect,
  onFileRemove,
  selectedFile,
  error,
  label,
  helperText,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        if (file.size > maxSize) {
          return;
        }
        onFileSelect(file);
      }
    },
    [maxSize, onFileSelect]
  );

  const handleInputChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        if (file.size > maxSize) {
          return;
        }
        onFileSelect(file);
      }
    },
    [maxSize, onFileSelect]
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <AnimatePresence mode="wait">
        {selectedFile ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div className="flex-shrink-0">
              <FileText className="w-8 h-8 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-500">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success-600" />
              {onFileRemove && (
                <button
                  type="button"
                  onClick={onFileRemove}
                  className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              'relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-all cursor-pointer',
              isDragging
                ? 'border-primary-500 bg-primary-50'
                : error
                ? 'border-error-300 bg-error-50'
                : 'border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-slate-100'
            )}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload
              className={cn(
                'w-10 h-10 mb-3',
                isDragging
                  ? 'text-primary-600'
                  : error
                  ? 'text-error-400'
                  : 'text-slate-400'
              )}
            />
            <p
              className={cn(
                'text-sm font-medium',
                isDragging
                  ? 'text-primary-700'
                  : error
                  ? 'text-error-600'
                  : 'text-slate-700'
              )}
            >
              {isDragging ? 'Drop file here' : 'Click or drag file to upload'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              PDF, JPG, PNG, or DOCX up to {formatFileSize(maxSize)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <p className="mt-1.5 text-sm text-error-600">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
}

export { FileUpload };
