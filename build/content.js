let synth = window.speechSynthesis;
let utterance = null;
let highlightedElements = [];
let recognition = null;
let transcriptionDiv = null;
let currentLanguage = "en-US";

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
      text-align: center;
      line-height: 1.5;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      word-wrap: break-word;
      overflow-y: auto;
      max-height: 200px;
      display: none;
    `;
    document.body.appendChild(transcriptionDiv);
  }
}


function updateTranscriptionUI(finalText, interimText) {
  if (!transcriptionDiv) return;
  transcriptionDiv.style.display = "block";
  transcriptionDiv.textContent = finalText + interimText;
  if (!finalText && !interimText) transcriptionDiv.style.display = "none";
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

  // Handle language updates from the extension UI
  if (request.action === "updateLanguage") {
    currentLanguage = request.language;
    // If transcription is active, update its language setting immediately
    if (recognition) {
      recognition.lang = currentLanguage;
    }
    sendResponse({
      status: "success",
      message: `Language updated to ${currentLanguage}`
    });
    return true;
  }

  // Handle text-to-speech functionality
  if (request.action === "readText") {
    try {
      if (synth.speaking) synth.cancel();

      const textToRead = request.text || getSelectedText() || document.body.textContent;
      utterance = new SpeechSynthesisUtterance(textToRead);
      // Use the updated global currentLanguage for speech synthesis
      utterance.lang = currentLanguage;
      utterance.rate = request.rate || 1;
      utterance.pitch = request.pitch || 1;

      // Highlighting logic: highlight words as they are spoken
      utterance.onboundary = (event) => {
        if (event.name === "word" || event.name === "boundary") {
          const charIndex = event.charIndex; // Get exact character position
          const words = textToRead.substring(charIndex).match(/\b\w+\b/g); // Extract word at charIndex
          if (words && words.length > 0) {
            highlightText(words[0]); // Highlight the exact spoken word
          }
        }
      };

      utterance.onend = () => {
        setTimeout(cleanupHighlights, 500); // Delay cleanup for smooth transition
        sendResponse({
          status: "success",
          message: "Reading completed"
        });
      };
      utterance.onerror = (error) => {
        cleanupHighlights();
        console.error("Speech synthesis error:", error);
        sendResponse({
          status: "error",
          message: error.message
        });
      };

      synth.speak(utterance);
      sendResponse({
        status: "success",
        message: "Started reading"
      });
    } catch (error) {
      console.error("Error in readText:", error);
      sendResponse({
        status: "error",
        message: error.message
      });
    }
    return true;
  }

  if (request.action === "stopReading") {
    try {
      if (synth.speaking) {
        synth.cancel();
        cleanupHighlights();
        sendResponse({
          status: "success",
          message: "Speech stopped"
        });
      } else {
        sendResponse({
          status: "info",
          message: "No active speech to stop"
        });
      }
    } catch (error) {
      console.error("Error stopping speech:", error);
      sendResponse({
        status: "error",
        message: error.message
      });
    }
    return true;
  }

  if (request.action === "pauseReading") {
    try {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        sendResponse({
          status: "success",
          message: "Speech paused"
        });
      } else {
        sendResponse({
          status: "info",
          message: "No active speech to pause"
        });
      }
    } catch (error) {
      console.error("Error pausing speech:", error);
      sendResponse({
        status: "error",
        message: error.message
      });
    }
    return true;
  }

  if (request.action === "resumeReading") {
    try {
      if (synth.paused) {
        synth.resume();
        sendResponse({
          status: "success",
          message: "Speech resumed"
        });
      } else {
        sendResponse({
          status: "info",
          message: "No paused speech to resume"
        });
      }
    } catch (error) {
      console.error("Error resuming speech:", error);
      sendResponse({
        status: "error",
        message: error.message
      });
    }
    return true;
  }

  if (request.type === "START_TRANSCRIPTION") {
    initializeTranscription();
    sendResponse({
      status: "success"
    });
  } else if (request.type === "STOP_TRANSCRIPTION") {
    stopTranscription();
    sendResponse({
      status: "success"
    });
  }
  return true;
});
// Function to get selected text
function getSelectedText() {
  return window.getSelection().toString();
}
// Cleanup on page unload
window.addEventListener("unload", () => {
  if (synth.speaking) synth.cancel();
  cleanupHighlights();
});