chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "resizePage") {
    try {
      const zoomLevel = message.zoomLevel / 100;

      // Ensure document body exists
      if (document.body) {
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = "top left";
        document.body.style.width = `${100 / zoomLevel}%`;
        sendResponse({ status: "success", message: `Resized to ${message.zoomLevel}%` });
      } else {
        sendResponse({ status: "error", message: "Document body not found" });
      }
    } catch (error) {
      console.error("Error resizing page:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }
});
