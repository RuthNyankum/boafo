export const interfaceResize = (zoomLevel: number = 120): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { action: 'resizePage', zoomLevel },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Runtime error:", chrome.runtime.lastError.message);
            console.log("Failed to resize the page. Please check console logs.");
          } else if (response?.status === 'success') {
            console.log("Resize successful:", response.message);
          } else {
            console.warn("Unexpected response:", response);
          }
        }
      );
    } else {
      console.warn("No active tab found.");
    }
  });
};
