let synth = window.speechSynthesis;
let utterance = null;
let highlightedElements = [];
let recognition = null;
let transcriptionDiv = null;
let currentLanguage = "en-US";
// Global variable to hold the current Google TTS audio
window.currentAudio = window.currentAudio || null;

// Helper function to clean up highlights
function cleanupHighlights() {
  highlightedElements.forEach((el) => {
    if (el && el.parentNode) {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    }
  });
  highlightedElements = [];
}

// Function to highlight text and scroll to it
function highlightText(text) {
  if (!text.trim()) return;
  cleanupHighlights();

  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;

  while ((node = walk.nextNode())) {
    const regex = new RegExp(`\\b${text.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    const match = node.textContent.match(regex);

    if (match) {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.style.color = "black";
      span.style.fontWeight = "bold";
      span.textContent = match[0];

      const beforeText = document.createTextNode(node.textContent.substring(0, match.index));
      const afterText = document.createTextNode(node.textContent.substring(match.index + match[0].length));

      const parent = node.parentNode;
      if (parent) {
        parent.replaceChild(afterText, node);
        parent.insertBefore(span, afterText);
        parent.insertBefore(beforeText, span);
        highlightedElements.push(span);

        span.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
      }
      break;
    }
  }
}

function createTranscriptionUI() {
  if (!transcriptionDiv) {
    transcriptionDiv = document.createElement("div");
    transcriptionDiv.id = "live-caption-container";
    transcriptionDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      background-color: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 16px;
      border-radius: 4px;
      font-family: sans-serif;
      font-size: 18px;
      line-height: 1.5;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      word-wrap: break-word;
      max-height: calc(1.5em * 4); /* Limits the box to 4 lines */
      overflow: hidden; /* Hides any text beyond 4 lines */
      display: none;
    `;
    document.body.appendChild(transcriptionDiv);
  }
}



function updateTranscriptionUI(finalText, interimText) {
  if (!transcriptionDiv) return;
  const fullText = finalText + interimText;
  const lines = fullText.split('\n');
  const displayText = lines.slice(-4).join('\n');
  transcriptionDiv.style.display = "block";
  transcriptionDiv.textContent = displayText;
  if (!displayText.trim()) {
    transcriptionDiv.style.display = "none";
  }
}


function initializeTranscription() {
  if (!('webkitSpeechRecognition' in window)) {
    console.error("Speech recognition not supported in this browser.");
    return;
  }

  if (!transcriptionDiv) createTranscriptionUI();

  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = currentLanguage;

  recognition.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    updateTranscriptionUI(finalTranscript, interimTranscript);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
}

function stopTranscription() {
  if (recognition) {
    recognition.stop();
    if (transcriptionDiv) transcriptionDiv.style.display = "none";
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // interface resize 
  if (request.action === "resizePage") {
    try {
      document.body.style.zoom = `${request.zoomLevel}%`;
      sendResponse({
        status: "success",
        message: "Page resized successfully"
      });
    } catch (error) {
      sendResponse({
        status: "error",
        message: error.message
      });
    }
    return true;
  }

  // Update language setting
  if (request.action === "updateLanguage") {
    currentLanguage = request.language;
    if (recognition) {
      recognition.lang = currentLanguage;
    }
    sendResponse({
      status: "success",
      message: `Language updated to ${currentLanguage}`
    });
    return true;
  }

  if (request.type === "START_TRANSCRIPTION") {
    if (request.language) {
      currentLanguage = request.language;
    }
    initializeTranscription();
    sendResponse({ status: "success" });
  } else if (request.type === "STOP_TRANSCRIPTION") {
    stopTranscription();
    sendResponse({
      status: "success"
    });
  }

  if (request.action === "updatePlaybackRate") {
    if (window.currentAudio) {
      window.currentAudio.playbackRate = request.rate;
      sendResponse({ status: "success", message: "Playback rate updated" });
    } else {
      sendResponse({ status: "error", message: "No audio playing" });
    }
    return true;
  }
  
  // --- Handle Google TTS Audio Playback Commands ---
  if (request.action === "playAudio") {
    if (window.currentAudio) {
      window.currentAudio.pause();
    }
    window.currentAudio = new Audio(request.audioUrl);
    window.currentAudio.play();
    sendResponse({ status: "success", message: "Audio playing" });
    return true;
  }
  if (request.action === "pauseAudio") {
    if (window.currentAudio && !window.currentAudio.paused) {
      window.currentAudio.pause();
      sendResponse({ status: "success", message: "Audio paused" });
    } else {
      sendResponse({ status: "info", message: "No audio to pause" });
    }
    return true;
  }
  if (request.action === "resumeAudio") {
    if (window.currentAudio && window.currentAudio.paused) {
      window.currentAudio.play();
      sendResponse({ status: "success", message: "Audio resumed" });
    } else {
      sendResponse({ status: "info", message: "No audio to resume" });
    }
    return true;
  }
  if (request.action === "stopAudio") {
    if (window.currentAudio) {
      window.currentAudio.pause();
      window.currentAudio.currentTime = 0;
      window.currentAudio = null;
      sendResponse({ status: "success", message: "Audio stopped" });
    } else {
      sendResponse({ status: "info", message: "No audio to stop" });
    }
    return true;
  }
  return true;
});

// Cleanup on page unload
window.addEventListener("unload", () => {
  if (synth.speaking) synth.cancel();
  cleanupHighlights();
});