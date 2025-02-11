export const interfaceResize = (zoomLevel: number = 120): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]?.id) {
      console.warn("No active tab found");
      return;
    }

    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "resizePage", zoomLevel },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error("Runtime error:", chrome.runtime.lastError.message);
          return;
        }
        
        if (response?.status === "success") {
          console.log("Resize successful:", response.message);
        }
      }
    );
  });
};