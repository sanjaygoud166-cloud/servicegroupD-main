import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import React from 'react';

function AccordionItem({ title, content, isOpen, onToggle }) {
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full py-4 text-left"
      >
        <span className="text-base font-medium text-slate-900">{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-slate-600 leading-relaxed">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Accordion({ items, className }) {
  const [openIndex, setOpenIndex] = React.useState(null);

  return (
    <div className={cn('divide-y divide-slate-200 rounded-lg', className)}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}

export { Accordion, AccordionItem };
