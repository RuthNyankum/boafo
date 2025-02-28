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

// Function to drive highlighting using SpeechSynthesis boundary events
function speakWithHighlight(text, rate = 1.0) {
  if (!text || !speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage;
  utterance.volume = 0;
  // Set the silent utterance rate to match your audio playback rate
  utterance.rate = rate;

  const words = text.split(/\s+/);

  utterance.onboundary = (event) => {
    if (event.name === "word") {
      let totalChars = 0;
      let wordIndex = 0;
      // Apply a small offset to trigger highlighting slightly earlier.
      const adjustedCharIndex = Math.max(event.charIndex - 2, 0); // adjust offset value as needed
      for (let i = 0; i < words.length; i++) {
        totalChars += words[i].length + 1; // adding 1 for space
        if (totalChars > adjustedCharIndex) {
          wordIndex = i;
          break;
        }
      }
      const currentWord = words[wordIndex];
      if (currentWord) {
        highlightText(currentWord);
      }
    }
  };

  utterance.onend = () => {
    // Optionally, clear highlights if desired:
    // cleanupHighlights();
  };

  speechSynthesis.speak(utterance);
}



// Create the live caption UI with only the STOP control
function createTranscriptionUI() {
  if (!transcriptionDiv) {
    transcriptionDiv = document.createElement("div");
    transcriptionDiv.id = "live-caption-container";
    transcriptionDiv.style.cssText = `
      position: fixed;
      bottom: 5%;
      left: 50%;
      transform: translateX(-50%);
      width: 65%;
      max-width: 800px;
      background-color: rgba(0, 0, 0, 0.8);
      color: #fff;
      padding: 12px 16px;
      font-family: Arial, sans-serif;
      font-size: 16px;
      line-height: 1.4;
      border-radius: 10px;
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5);
      z-index: 9999;
      display: none;
    `;
    
    // Header
    const header = document.createElement("div");
    header.innerText = "Boafo Live Caption";
    header.style.cssText = `
      font-weight: bold;
      margin-bottom: 8px;
      font-size: 14px;
      opacity: 0.8;
    `;
    
    // Transcript text container
    const transcriptText = document.createElement("div");
    transcriptText.id = "live-caption-text";
    transcriptText.style.cssText = `
      max-height: 100px;
      overflow-y: auto;
      word-wrap: break-word;
      margin-bottom: 8px;
    `;
    
    // Controls container with only the STOP button
    const controlContainer = document.createElement("div");
    controlContainer.id = "live-caption-controls";
    controlContainer.style.cssText = "text-align: right;";
    
    const stopBtn = document.createElement("button");
    stopBtn.id = "stop-btn";
    stopBtn.style.cssText = "padding: 6px 12px; font-size: 14px;";
    stopBtn.innerText = "Stop";
    stopBtn.addEventListener("click", () => {
      stopTranscription();
    });
    
    controlContainer.appendChild(stopBtn);
    
    transcriptionDiv.appendChild(header);
    transcriptionDiv.appendChild(transcriptText);
    transcriptionDiv.appendChild(controlContainer);
    
    document.body.appendChild(transcriptionDiv);
  }
}

// Update the transcription UI with transcript text and auto-scroll
function updateTranscriptionUI(finalText, interimText) {
  if (!transcriptionDiv) return;
  const fullText = (finalText + " " + interimText).trim();
  
  const transcriptText = document.getElementById("live-caption-text");
  if (transcriptText) {
    transcriptText.textContent = fullText;
    transcriptText.scrollTop = transcriptText.scrollHeight;
  }
  
  transcriptionDiv.style.display = fullText ? "block" : "none";
}

// Start speech recognition
function initializeTranscription() {
  if (!("webkitSpeechRecognition" in window)) {
    console.error("Speech recognition not supported in this browser.");
    return;
  }
  if (!transcriptionDiv) createTranscriptionUI();
  
  accumulatedTranscript = "";
  
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = currentLanguage;
  
  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        accumulatedTranscript += event.results[i][0].transcript + " ";
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    updateTranscriptionUI(accumulatedTranscript, interimTranscript);
  };
  
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
  
  recognition.onend = () => {
    // End handling: no auto-restart since only STOP is available.
  };
  
  recognition.start();
}

// Stop transcription completely: stop recognition, clear transcript, and hide UI
function stopTranscription() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  accumulatedTranscript = "";
  if (transcriptionDiv) {
    transcriptionDiv.style.display = "none";
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
    sendResponse({ status: "success", message: "Transcription started" });
    return true;
  }
  
  if (request.type === "STOP_TRANSCRIPTION") {
    stopTranscription();
    sendResponse({ status: "success", message: "Transcription stopped" });
    return true;
  }
  
  // Optionally still support PAUSE and RESUME messages if needed by external controls
  if (request.type === "PAUSE_TRANSCRIPTION") {
    if (recognition) {
      recognition.stop();
    }
    sendResponse({ status: "success", message: "Transcription paused" });
    return true;
  }
  
  if (request.type === "RESUME_TRANSCRIPTION") {
    if (!recognition) {
      initializeTranscription();
    }
    sendResponse({ status: "success", message: "Transcription resumed" });
    return true;
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

  // --- start highlighting text ---
  if (request.action === "startHighlighting" && request.text) {
    // Pass the speaking rate from your request so that both TTS and highlighting are synchronized.
    speakWithHighlight(request.text, request.rate || 1.0);
    sendResponse({ status: "success", message: "Highlighting started" });
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