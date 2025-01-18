let recognition = null;

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
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "resizePage", zoomLevel: request.zoomLevel }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Detailed runtime error:", chrome.runtime.lastError);
            sendResponse({ status: "error", message: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      } else {
        console.error("No active tab found for resizing.");
        sendResponse({ status: "error", message: "No active tab found." });
      }
    });
    return true;
  }

  // Handle text-to-speech
  if (request.action === "readText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
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

  document.getElementById("pauseButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "pauseReading" }, (response) => {
      console.log(response.message);
    });
  });
  
  document.getElementById("resumeButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "resumeReading" }, (response) => {
      console.log(response.message);
    });
  });
  
  // Stop speech
  if (request.action === "stopReading") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
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
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getTags", tagName: request.tagName }, (response) => {
          if (response?.tags?.length) {
            let currentIndex = 0;

            const readNextTag = () => {
              if (currentIndex < response.tags.length) {
                const text = response.tags[currentIndex];
                const utterance = new SpeechSynthesisUtterance(text);

                utterance.onend = () => {
                  currentIndex++;
                  readNextTag();
                };

                speechSynthesis.speak(utterance);
                chrome.tabs.sendMessage(tabs[0].id, { action: "highlightText", text });
              }
            };

            readNextTag();
          } else {
            sendResponse({ status: "error", message: "No tags found" });
          }
        });
      }
    });
  }

  // Speech recognition handling
  if (request.action === "startSpeechRecognition") {
    try {
      if (typeof webkitSpeechRecognition !== "undefined") {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "updateTranscript", transcript });
            }
          });
        };

        recognition.start();
        sendResponse({ status: "success", message: "Speech recognition started" });
      } else {
        throw new Error("Speech recognition not supported in this browser");
      }
    } catch (error) {
      console.error("Speech Recognition Error:", error);
      sendResponse({ status: "error", message: error.toString() });
    }
  }

  // Handle media monitoring
  if (request.action === "monitorMedia") {
    try {
      chrome.tabs.sendMessage(sender.tab.id, { action: "monitorMedia" });
      sendResponse({ status: "success", message: "Media monitoring started" });
    } catch (error) {
      console.error("Error monitoring media:", error);
      sendResponse({
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return true; // Required for async response
});
