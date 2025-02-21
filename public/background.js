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
let isPaused = false;
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-extension") {
    chrome.action.openPopup().catch((err) => console.error("Failed to open popup:", err));
  }
});


async function googleTextToSpeech(text, lang, rate = 1.0, pitch = 0, volume = 1.0,voiceType = "NEUTRAL") {
  const apiKey = "AIzaSyDiIJJdPVUwTuM5d-QIaTYy0OIFX9vfNtk"; // Replace with a secure method
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: { text },
        voice: { languageCode: lang || "en-US", ssmlGender:voiceType },
        audioConfig: {
          audioEncoding: "MP3",
          speakingRate: rate,
          pitch: pitch,
          volumeGainDb: volume,
        },
      }),
    });

    const data = await response.json();

    if (data.audioContent) {
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      
      // Send message to active tab to play the audio
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "playAudio", audioUrl });
        }
      });

      return { status: "success", message: "Started reading" };
    } else {
      return { status: "error", message: "No audio content returned" };
    }
  } catch (error) {
    console.error("Google TTS error:", error);
    return { status: "error", message: error.message };
  }
}



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

  // Handle text-to-speech request via Google TTS API
  if (request.action === "readText") {
    googleTextToSpeech(
      request.text,
      request.lang || currentLanguage,
      request.rate,
      request.pitch,
      request.volume,
      request.voiceType
    )
      .then(response => sendResponse(response));
    return true; // Asynchronous response
  }
// Pause reading
if (request.action === "pauseReading") {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "pauseAudio" }, (response) => {
        sendResponse(response);
      });
    } else {
      sendResponse({ status: "error", message: "No active tab found" });
    }
  });
  return true;
}

// Resume reading
if (request.action === "resumeReading") {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "resumeAudio" }, (response) => {
        sendResponse(response);
      });
    } else {
      sendResponse({ status: "error", message: "No active tab found" });
    }
  });
  return true;
}

// Stop reading
if (request.action === "stopReading") {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "stopAudio" }, (response) => {
        sendResponse(response);
      });
    } else {
      sendResponse({ status: "error", message: "No active tab found" });
    }
  });
  return true;
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

  // Handle live transcription requests
if (request.type === 'START_TRANSCRIPTION') {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      // Forward the language along with the transcription start request
      chrome.tabs.sendMessage(tabs[0].id, { type: "START_TRANSCRIPTION", language: request.language });
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