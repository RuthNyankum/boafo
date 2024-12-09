chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "captureTab") {
      chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
        sendResponse({ screenshotUrl: dataUrl });
      });
      return true;
    }
  });
  