// Initialize text-to-speech when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tts.speak('Extension installed successfully', {
    lang: 'en-US',
    rate: 1.5,
    pitch: 2,
    volume: 1,
    requiredEventTypes: ['start', 'end'],
  });
});
let currentLanguage = 'en-US';
let audioStream = null;
let isPaused = false;


// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'toggle-speech') {
    // Trigger Speech Recognition
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleSpeechRecognition' });
      }
    });
  } else if (command === 'toggle-text-to-speech') {
    // Trigger Text-to-Speech
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleTextToSpeech' });
      }
    });
  } else if (command === 'adjust-zoom') {
    // Trigger interface zoom adjustment
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'adjustZoom' });
      }
    });
  }
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

   // Handle language updates
   if (request.action === "updateLanguage") {
    currentLanguage = request.language;
    sendResponse({ status: "success", message: `Language updated to ${currentLanguage}` });
    return true;
  }

  // Handle text-to-speech
  if (request.action === "readText") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "readText", text: request.text, lang: request.lang || currentLanguage},
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

   // Handle reading tags (tag-by-tag)
   if (request.action === "readTagByTag") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getTags", tagName: request.tagName }, (response) => {
          if (response?.tags?.length) {
            const tags = response.tags;
            let currentIndex = 0;

            const utterance = new SpeechSynthesisUtterance();
            // Use the updated language for tag reading
            utterance.lang = currentLanguage;

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

  // Handle live transcription request
  if (request.type === 'START_TRANSCRIPTION') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "START_TRANSCRIPTION" });
      }
    });
    return true;
  }
  // Handle pausing transcription
  if (request.type === 'PAUSE_TRANSCRIPTION') {
    isPaused = true;
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => track.stop());
    }
    return true;
  }

  // Handle resuming transcription
  if (request.type === 'RESUME_TRANSCRIPTION') {
    isPaused = false;
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => track.start());
    }
    return true;
  }

  // Handle stopping transcription
  if (request.type === 'STOP_TRANSCRIPTION') {
    isPaused = false;
    if (audioStream) {
      audioStream.getAudioTracks().forEach((track) => track.stop());
    }
    return true;
  }

  return true;
});


function initializeTranscription() {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported');
    return;
  }
}