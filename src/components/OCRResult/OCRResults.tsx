import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OCRResultProps {
  image: string;
  isProcessing: boolean;
  ocrResult: string;
}

const OCRResult: React.FC<OCRResultProps> = ({ 
  image, 
  isProcessing, 
  ocrResult 
}) => {
  return (
    <AnimatePresence>
      {image && (
        <motion.img
          key="image"
          src={image}
          alt="Captured Screenshot"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="mb-2 w-full rounded-md max-h-32 object-contain"
        />
      )}
      {isProcessing && (
        <motion.p
          key="processing"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="text-xs text-gray-600"
        >
          Processing image... Please wait.
        </motion.p>
      )}
      {ocrResult && (
        <motion.p
          key="result"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="mt-1 text-xs text-gray-700"
        >
          Extracted Text: {ocrResult}
        </motion.p>
      )}
    </AnimatePresence>
  );
};

export default OCRResult;

