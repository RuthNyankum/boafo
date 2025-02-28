// =====================
// Initialize text-to-speech when the extension is installed
// =====================
chrome.runtime.onInstalled.addListener(() => {
  chrome.tts.speak('Extension installed successfully', {
    lang: 'en-US',
    rate: 1.5,
    pitch: 2,
    volume: 1,
    requiredEventTypes: ['start', 'end'],
  });
});

// =====================
// Global Variables
// =====================
let currentLanguage = 'en-US';
let isPaused = false;

// =====================
// Handle Keyboard Shortcuts
// =====================
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  
  const actions = {
    'toggle-extension': () => chrome.action.openPopup().catch(err => console.error('Failed to open popup:', err)),
    'toggle-speech': () => sendMessageToActiveTab({ action: 'toggleSpeechRecognition' }),
    'toggle-text-to-speech': () => sendMessageToActiveTab({ action: 'toggleTextToSpeech' }),
    'adjust-zoom': () => sendMessageToActiveTab({ action: 'adjustZoom' }),
  };
  
  if (actions[command]) actions[command]();
});

// =====================
// Function to Send Messages to Active Tab
// =====================
function sendMessageToActiveTab(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    }
  });
}

// =====================
// Handle Messages from Popup or Content Scripts
// =====================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const handlers = {
    resizePage: () => handleResizePage(request, sendResponse),
    updateLanguage: () => updateLanguage(request, sendResponse),
    readText: () => handleTextToSpeech(request, sendResponse),
    pauseReading: () => sendMessageToActiveTab({ action: 'pauseAudio' }),
    resumeReading: () => sendMessageToActiveTab({ action: 'resumeAudio' }),
    stopReading: () => sendMessageToActiveTab({ action: 'stopAudio' }),
    readTagByTag: () => handleReadTagByTag(request, sendResponse),
    START_TRANSCRIPTION: () => sendMessageToActiveTab({ type: 'START_TRANSCRIPTION', language: request.language }),
    PAUSE_TRANSCRIPTION: () => isPaused = true,
    RESUME_TRANSCRIPTION: () => isPaused = false,
    STOP_TRANSCRIPTION: () => isPaused = false,
  };

  if (handlers[request.action || request.type]) {
    handlers[request.action || request.type]();
    return true; // Required for async responses
  }
});

// =====================
// Handle Resizing the Page
// =====================
function handleResizePage(request, sendResponse) {
  sendMessageToActiveTab({ action: 'resizePage', zoomLevel: request.zoomLevel });
}

// =====================
// Update Language Settings
// =====================
function updateLanguage(request, sendResponse) {
  currentLanguage = request.language;
  sendResponse({ status: 'success', message: `Language updated to ${currentLanguage}` });
}

// =====================
// Handle Text-to-Speech Request via Secure Backend Proxy
// =====================
async function handleTextToSpeech(request, sendResponse) {
  const response = await googleTextToSpeech(request.text, request.lang || currentLanguage, request.rate, request.pitch, request.volume, request.voiceType);
  sendMessageToActiveTab({ action: 'startHighlighting', text: request.text, rate: request.rate });
  sendResponse(response);
}

// =====================
// Google Text-to-Speech API Call
// =====================
async function googleTextToSpeech(text, lang, rate = 1.0, pitch = 0, volume = 1.0, voiceType = 'NEUTRAL') {
  const proxyUrl = 'http://localhost:3000/tts'; // Secure backend URL
  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, languageCode: lang, ssmlGender: voiceType, audioConfig: { audioEncoding: 'MP3', speakingRate: rate, pitch, volumeGainDb: volume } }),
    });
    const data = await response.json();
    
    if (data.audioContent) {
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      sendMessageToActiveTab({ action: 'playAudio', audioUrl });
      return { status: 'success', message: 'Started reading' };
    } else {
      return { status: 'error', message: 'No audio content returned' };
    }
  } catch (error) {
    console.error('Google TTS error:', error);
    return { status: 'error', message: error.message };
  }
}

// =====================
// Read Webpage Content Tag by Tag
// =====================
function handleReadTagByTag(request, sendResponse) {
  sendMessageToActiveTab({ action: 'getTags', tagName: request.tagName }, (response) => {
    if (response?.tags?.length) {
      let currentIndex = 0;
      const utterance = new SpeechSynthesisUtterance();
      utterance.lang = currentLanguage;

      utterance.onend = () => {
        currentIndex++;
        if (currentIndex < response.tags.length) {
          utterance.text = response.tags[currentIndex];
          speechSynthesis.speak(utterance);
          sendMessageToActiveTab({ action: 'highlightText', text: response.tags[currentIndex] });
        }
      };

      utterance.text = response.tags[currentIndex];
      speechSynthesis.speak(utterance);
      sendMessageToActiveTab({ action: 'highlightText', text: response.tags[currentIndex] });
    } else {
      sendResponse({ status: 'error', message: 'No tags found' });
    }
  });
}

// =====================
// Initialize Transcription
// =====================
function initializeTranscription() {
  if (!('webkitSpeechRecognition' in window)) {
    console.error('Speech recognition not supported');
    return;
  }
}
