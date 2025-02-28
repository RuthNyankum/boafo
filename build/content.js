"use strict";

// =====================
// Global Variables
// =====================
let synth = window.speechSynthesis;
let recognition = null;
let transcriptionDiv = null;
let currentLanguage = "en-US";
let accumulatedTranscript = "";
window.currentAudio = window.currentAudio || null;
let highlightedElements = [];
let isPaused = false; // Flag for transcription pause state

// =====================
// Helper Functions
// =====================

// Clean up any highlighted elements
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

// Highlight a given word and scroll it into view
function highlightText(text) {
  if (!text.trim()) return;
  cleanupHighlights();

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  while ((node = walker.nextNode())) {
    const regex = new RegExp(`\\b${text.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    const match = node.textContent.match(regex);
    if (match) {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.style.color = "black";
      span.style.fontWeight = "bold";
      span.textContent = match[0];

      const beforeText = document.createTextNode(node.textContent.substring(0, match.index));
      const afterText = document.createTextNode(
        node.textContent.substring(match.index + match[0].length)
      );

      const parent = node.parentNode;
      if (parent) {
        parent.replaceChild(afterText, node);
        parent.insertBefore(span, afterText);
        parent.insertBefore(beforeText, span);
        highlightedElements.push(span);
        span.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      break;
    }
  }
}

// =====================
// Highlighting via Silent Utterance
// =====================

// Uses a silent SpeechSynthesisUtterance to generate word-boundary events
function speakWithHighlight(text, rate = 1.0) {
  if (!text || !speechSynthesis) return;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = currentLanguage;
  utterance.volume = 0;
  utterance.rate = rate;

  const words = text.split(/\s+/);
  utterance.onboundary = (event) => {
    if (event.name === "word") {
      let totalChars = 0;
      let wordIndex = 0;
      // Apply a small offset to trigger highlighting slightly earlier.
      const adjustedCharIndex = Math.max(event.charIndex - 2, 0);
      for (let i = 0; i < words.length; i++) {
        totalChars += words[i].length + 1; // +1 for the space
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
    // Optionally clear highlights when finished:
    // cleanupHighlights();
  };

  speechSynthesis.speak(utterance);
}

// =====================
// Transcription UI & Speech Recognition
// =====================

// Create live caption UI with Pause, Resume, and Stop buttons
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
    
    // Controls container with Pause, Resume, and Stop buttons
    const controlContainer = document.createElement("div");
    controlContainer.id = "live-caption-controls";
    controlContainer.style.textAlign = "right";
    
    // Pause Button
    const pauseBtn = document.createElement("button");
    pauseBtn.id = "pause-btn";
    pauseBtn.style.cssText = "padding: 6px 12px; font-size: 14px; margin-right: 4px;";
    pauseBtn.innerText = "Pause";
    pauseBtn.addEventListener("click", pauseTranscription);
    
    // Resume Button
    const resumeBtn = document.createElement("button");
    resumeBtn.id = "resume-btn";
    resumeBtn.style.cssText = "padding: 6px 12px; font-size: 14px; margin-right: 4px;";
    resumeBtn.innerText = "Resume";
    resumeBtn.addEventListener("click", resumeTranscription);
    
    // Stop Button
    const stopBtn = document.createElement("button");
    stopBtn.id = "stop-btn";
    stopBtn.style.cssText = "padding: 6px 12px; font-size: 14px;";
    stopBtn.innerText = "Stop";
    stopBtn.addEventListener("click", stopTranscription);
    
    controlContainer.appendChild(pauseBtn);
    controlContainer.appendChild(resumeBtn);
    controlContainer.appendChild(stopBtn);
    
    transcriptionDiv.appendChild(header);
    transcriptionDiv.appendChild(transcriptText);
    transcriptionDiv.appendChild(controlContainer);
    document.body.appendChild(transcriptionDiv);
  }
}

// Update the live caption UI with the current transcript
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

// Initialize speech recognition for transcription
function initializeTranscription() {
  if (!("webkitSpeechRecognition" in window)) {
    console.error("Speech recognition not supported in this browser.");
    return;
  }
  createTranscriptionUI();
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
    // No auto-restart; use UI controls to restart if desired.
  };
  
  recognition.start();
  isPaused = false;
}

// Stop the transcription and hide the UI
function stopTranscription() {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
  accumulatedTranscript = "";
  if (transcriptionDiv) {
    transcriptionDiv.style.display = "none";
  }
  isPaused = false;
}

// Pause the transcription without clearing the transcript
function pauseTranscription() {
  if (recognition) {
    recognition.stop();
    isPaused = true;
  }
}

// Resume transcription without clearing the transcript
function resumeTranscription() {
  if (isPaused) {
    if (!("webkitSpeechRecognition" in window)) {
      console.error("Speech recognition not supported in this browser.");
      return;
    }
    createTranscriptionUI();
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
    
    recognition.start();
    isPaused = false;
  }
}

// =====================
// Toggle Functions for Keyboard Shortcuts
// =====================

function toggleTextToSpeech() {
  // If audio is playing, stop it; otherwise, start reading a default text.
  if (window.currentAudio) {
    chrome.runtime.sendMessage({ action: "stopReading" }, (response) =>
      console.log(response?.message)
    );
  } else {
    // For demo purposes, read a snippet of the page text.
    const text = document.body.innerText.slice(0, 200) || "No content available.";
    chrome.runtime.sendMessage(
      { action: "readText", text, rate: 1.0 },
      (response) => console.log(response?.message)
    );
  }
}

function toggleSpeechToText() {
  // If recognition is active, stop it; otherwise, start transcription.
  if (recognition) {
    stopTranscription();
  } else {
    initializeTranscription();
  }
}

function adjustZoom(amount) {
  let currentZoom = document.body.style.zoom ? parseInt(document.body.style.zoom) : 100;
  let newZoom = currentZoom + amount;
  document.body.style.zoom = `${newZoom}%`;
}

// =====================
// Message Listener for Background Commands
// =====================
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Resize Page
  if (request.action === "resizePage") {
    try {
      document.body.style.zoom = `${request.zoomLevel}%`;
      sendResponse({ status: "success", message: "Page resized successfully" });
    } catch (error) {
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  // Update Language
  if (request.action === "updateLanguage") {
    currentLanguage = request.language;
    if (recognition) {
      recognition.lang = currentLanguage;
    }
    sendResponse({ status: "success", message: `Language updated to ${currentLanguage}` });
    return true;
  }

  // Start Transcription
  if (request.type === "START_TRANSCRIPTION") {
    if (request.language) {
      currentLanguage = request.language;
    }
    initializeTranscription();
    sendResponse({ status: "success", message: "Transcription started" });
    return true;
  }

  // Stop Transcription
  if (request.type === "STOP_TRANSCRIPTION") {
    stopTranscription();
    sendResponse({ status: "success", message: "Transcription stopped" });
    return true;
  }

  // Update Playback Rate
  if (request.action === "updatePlaybackRate") {
    if (window.currentAudio) {
      window.currentAudio.playbackRate = request.rate;
      sendResponse({ status: "success", message: "Playback rate updated" });
    } else {
      sendResponse({ status: "error", message: "No audio playing" });
    }
    return true;
  }

  // Google TTS Audio Playback Commands
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

  // Start Highlighting (trigger silent utterance)
  if (request.action === "startHighlighting" && request.text) {
    speakWithHighlight(request.text, request.rate || 1.0);
    sendResponse({ status: "success", message: "Highlighting started" });
    return true;
  }

  // Keyboard Shortcuts for toggling features
  if (request.action === "toggleTextToSpeech") {
    toggleTextToSpeech();
    sendResponse({ status: "success", message: "TTS toggled" });
    return true;
  }
  if (request.action === "toggleSpeechToText") {
    toggleSpeechToText();
    sendResponse({ status: "success", message: "Speech-to-text toggled" });
    return true;
  }
  if (request.action === "adjustZoom") {
    if (request.zoomLevel === "in") {
      adjustZoom(10); // Increase zoom by 10%
    } else if (request.zoomLevel === "out") {
      adjustZoom(-10); // Decrease zoom by 10%
    }
    sendResponse({ status: "success", message: "Zoom adjusted" });
    return true;
  }

  return true;
});

// =====================
// Cleanup on Page Unload
// =====================
window.addEventListener("unload", () => {
  if (synth.speaking) synth.cancel();
  cleanupHighlights();
});
