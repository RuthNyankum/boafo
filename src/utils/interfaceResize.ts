export const interfaceResize = (zoomLevel: number = 120): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      try {
        chrome.tabs.sendMessage(
          tabs[0].id, 
          { action: 'resizePage', zoomLevel }, 
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Runtime error:", chrome.runtime.lastError);
              alert("Failed to resize the page. Please try again.");
            } else if (response?.status === 'success') {
              console.log('Resize successful:', response);
              alert("Interface resized successfully!");
            } else {
              console.warn('Unexpected response:', response);
              alert("Unexpected response. Please check if the extension is enabled.");
            }
          }
        );
      } catch (error) {
        console.error('Error sending resize message:', error);
        alert("An unexpected error occurred. Please check the console for details.");
      }
    } else {
      console.warn("No active tab found.");
      alert("Unable to find the active tab. Please try again.");
    }
  });
};
