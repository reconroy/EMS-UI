import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const PDFPreviewModal = ({ isOpen, onClose, file }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl h-[80vh] bg-white dark:bg-gray-800 rounded-xl shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Document Preview
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* PDF Viewer */}
          <div className="w-full h-[calc(80vh-4rem)]">
            <iframe
              src={URL.createObjectURL(file) + '#toolbar=0'}
              className="w-full h-full rounded-b-xl"
              title="PDF Preview"
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PDFPreviewModal; 