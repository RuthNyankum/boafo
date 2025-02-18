import { useState, useCallback } from 'react';
import { interfaceResize } from '../utils/interfaceResize';

export const useZoom = () => {
  const [zoomLevel, setZoomLevel] = useState(120);

  const adjustZoom = useCallback((level: number) => {
    setZoomLevel(level);
    interfaceResize(level);
  }, []);

  return { zoomLevel, adjustZoom, setZoomLevel };
};