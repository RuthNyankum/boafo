chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension Installed");
});

// Listener for messages from popup or other scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "captureTab") {
    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
      sendResponse({ screenshotUrl: dataUrl });
    });
    return true; // Indicates async response
  }

  if (request.action === "resizePage") {
    // Forward the resizePage action to the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "resizePage", zoomLevel: request.zoomLevel },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Detailed runtime error:", chrome.runtime.lastError);
              sendResponse({ 
                status: "error", 
                message: chrome.runtime.lastError.message 
              });
            } else {
              sendResponse(response);
            }
          }
        );
      } else {
        console.error("No active tab found for resizing.");
        sendResponse({ 
          status: "error", 
          message: "No active tab found." 
        });
      }
    });
    return true; // Indicates async response
  }
});