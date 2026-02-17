import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from './Button';

const Modal = ({ isOpen, onClose, title, children, className }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-txt-dark/40 backdrop-blur-sm"
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={cn(
              "relative w-full max-w-lg overflow-hidden rounded-lg bg-white shadow-2xl animate-in fade-in zoom-in-95 duration-200",
              className
            )}
          >
            <div className="flex items-center justify-between border-b border-surface-border p-4">
              <h2 className="text-xl font-bold text-txt-dark">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-full p-1 text-txt-secondary hover:bg-surface-light transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
