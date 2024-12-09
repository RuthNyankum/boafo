export const interfaceResize = (zoomLevel: number = 120) => {
    document.body.style.zoom = `${zoomLevel}%`;
    alert(`Interface resized to ${zoomLevel}% for accessibility.`);
  };