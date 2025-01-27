// Initialize TTS engine when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tts.speak('Extension installed successfully', {
    lang: 'en-US',
    rate: 1.5,
    pitch: 2,
    volume: 1,
    requiredEventTypes: ['start', 'end'],
  });
});

// Listener for messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle resizing
  if (request.action === "resizePage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "resizePage", zoomLevel: request.zoomLevel },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Detailed runtime error:", chrome.runtime.lastError);
              sendResponse({ status: "error", message: chrome.runtime.lastError.message });
            } else {
              sendResponse(response);
            }
          }
        );
      } else {
        console.error("No active tab found for resizing.");
        sendResponse({ status: "error", message: "No active tab found." });
      }
    });
    return true; // Required for async response
  }

  // Handle text-to-speech
  if (request.action === "readText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "readText", text: request.text, lang: request.lang },
          (response) => {
            sendResponse(response);
          }
        );
      } else {
        console.warn("No active tab found.");
        sendResponse({ status: "error", message: "No active tab found" });
      }
    });
    return true; // Required for async response
  }

  // Stop speech
  if (request.action === "stopReading") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "stopReading" }, (response) => {
          sendResponse(response);
        });
      } else {
        sendResponse({ status: "error", message: "No active tab found" });
      }
    });
    return true; // Required for async response
  }

  // Handle reading tags
  if (request.action === "readTagByTag") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getTags", tagName: request.tagName }, (response) => {
          if (response?.tags?.length) {
            const tags = response.tags;
            let currentIndex = 0;

            const utterance = new SpeechSynthesisUtterance();
            utterance.onend = () => {
              currentIndex++;
              if (currentIndex < tags.length) {
                utterance.text = tags[currentIndex];
                speechSynthesis.speak(utterance);
                chrome.tabs.sendMessage(tabs[0].id, { action: "highlightText", text: tags[currentIndex] });
              }
            };

            utterance.text = tags[currentIndex];
            speechSynthesis.speak(utterance);
            chrome.tabs.sendMessage(tabs[0].id, { action: "highlightText", text: tags[currentIndex] });
          } else {
            sendResponse({ status: "error", message: "No tags found" });
          }
        });
      } else {
        sendResponse({ status: "error", message: "No active tab found" });
      }
    });
    return true; // Required for async response
  }

  // Handle media monitoring
  if (request.action === "monitorMedia") {
    if (sender.tab?.id) {
      chrome.tabs.sendMessage(sender.tab.id, { action: "monitorMedia" });
      sendResponse({ status: "success", message: "Media monitoring started" });
    } else {
      console.error("No active tab found for media monitoring.");
      sendResponse({ status: "error", message: "No active tab found" });
    }
  }

  return true; // Required for async response
});
