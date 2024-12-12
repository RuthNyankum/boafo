import React from 'react';

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
    <div className="mt-4">
      <label htmlFor="zoomSlider" className="block text-sm font-medium text-gray-700">
        Zoom Level: {zoomLevel}%
      </label>
      <input
        id="zoomSlider"
        type="range"
        min="50"
        max="200"
        value={zoomLevel}
        onChange={handleChange}
        className="mt-2 w-full"
      />
    </div>
  );
};

export default ZoomSlider;
