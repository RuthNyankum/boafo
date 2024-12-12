import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccessibilityOption } from '../../types/accessibility';

interface AccessibilityOptionItemProps {
  item: AccessibilityOption;
  index: number;
  openSection: number | null;
  toggleSection: (section: number) => void;
}

const AccessibilityOptionItem: React.FC<AccessibilityOptionItemProps> = ({
  item,
  index,
  openSection,
  toggleSection,
}) => {
  const isOpen = openSection === index;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      className="border rounded-md overflow-hidden"
    >
      <button
        onClick={() => {
          toggleSection(index);
          item.action();
        }}
        className="w-full flex justify-between items-center p-3 text-sm font-medium bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        aria-expanded={isOpen}
        aria-controls={`section-${index}`}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-full">
            <item.icon size={16} className="text-blue-500" />
          </div>
          <span>{item.title}</span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          ▼
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-3 bg-white text-xs text-gray-700"
          >
            {item.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AccessibilityOptionItem;