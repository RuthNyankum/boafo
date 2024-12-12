interface ResizeMessage {
  action: 'resizePage';
  zoomLevel: number;
}

chrome.runtime.onMessage.addListener((
  message: ResizeMessage, 
  _sender: chrome.runtime.MessageSender, 
  sendResponse: (response?: unknown) => void
) => {
  if (message.action === 'resizePage') {
    try {
      document.body.style.transform = `scale(${message.zoomLevel / 100})`;
      document.body.style.transformOrigin = 'top left';
      
      const scaleFactor = message.zoomLevel / 100;
      document.body.style.width = `${100 / scaleFactor}%`;

      // Send a success response
      sendResponse({ 
        status: 'success', 
        message: `Page resized to ${message.zoomLevel}%` 
      });
    } catch (error) {
      // Send an error response if something goes wrong
      sendResponse({ 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
});