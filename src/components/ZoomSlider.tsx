import React from 'react';
import { motion } from 'framer-motion';

interface ZoomSliderProps {
  zoomLevel: number;
  setZoomLevel: (level: number) => void;
  adjustZoom: (level: number) => void;
}

const ZoomSlider: React.FC<ZoomSliderProps> = ({ zoomLevel, setZoomLevel, adjustZoom }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLevel = parseInt(event.target.value, 10);
    setZoomLevel(newLevel);
    adjustZoom(newLevel);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="mb-2"
    >
      <label htmlFor="zoomSlider" className="block text-xs font-medium text-gray-700 mb-1">
        Zoom Level: {zoomLevel}%
      </label>
      <input
        id="zoomSlider"
        type="range"
        min="50"
        max="200"
        value={zoomLevel}
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </motion.div>
  );
};

export default ZoomSlider;

