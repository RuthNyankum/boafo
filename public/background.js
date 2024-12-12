chrome.runtime.onInstalled.addListener(() => {
  if (chrome.notifications?.create) {
    chrome.notifications.create(
      `notification-${Date.now()}`, // Generate a unique ID
      {
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Extension Installed',
        message: 'Accessibility Options is now active!',
      },
      (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error('Notification creation error:', chrome.runtime.lastError);
        } else {
          console.log('Notification created:', notificationId);
        }
      }
    );
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureTab') {
    chrome.tabs.captureVisibleTab(
      chrome.windows.WINDOW_ID_CURRENT, // Explicitly use the current window
      { format: 'png', quality: 100 },
      (dataUrl) => {
        if (chrome.runtime.lastError) {
          console.error('Tab capture error:', chrome.runtime.lastError);
          sendResponse({ error: chrome.runtime.lastError.message });
        } else {
          sendResponse({ screenshotUrl: dataUrl });
        }
      }
    );
    return true; // Necessary for async sendResponse
  }
});

