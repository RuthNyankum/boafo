let synth = window.speechSynthesis;
let utterance = null;
let highlightedElements = [];

// Helper function to clean up highlights
function cleanupHighlights() {
  highlightedElements.forEach(el => {
    if (el && el.parentNode) {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.textContent), el);
      parent.normalize();
    }
  });
  highlightedElements = [];
}

// Function to highlight text
function highlightText(text, container) {
  cleanupHighlights();

  const walk = document.createTreeWalker(
    container || document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walk.nextNode())) {
    const index = node.textContent.indexOf(text);
    if (index >= 0) {
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.textContent = text;

      const range = document.createRange();
      range.setStart(node, index);
      range.setEnd(node, index + text.length);
      range.surroundContents(span);

      highlightedElements.push(span);
      break;
    }
  }
}

// Function to adjust zoom level
function adjustZoomLevel(zoomLevel) {
  document.body.style.zoom = zoomLevel;
}

// Function to update transcript in real-time
function updateTranscript(transcript) {
  const transcriptElement = document.getElementById("speech-transcript");
  if (!transcriptElement) {
    const container = document.createElement("div");
    container.id = "speech-transcript";
    container.style.position = "fixed";
    container.style.bottom = "10px";
    container.style.right = "10px";
    container.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    container.style.color = "white";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.style.zIndex = "10000";
    container.style.fontSize = "14px";
    document.body.appendChild(container);
  }

  document.getElementById("speech-transcript").textContent = transcript;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "readText") {
    try {
      if (synth.speaking) {
        synth.cancel();
      }

      const textToRead = request.text || getSelectedText() || document.body.textContent;
      utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = request.lang || "en-US";
      utterance.rate = request.rate || 1;
      utterance.pitch = request.pitch || 1;

      const sentences = textToRead.match(/[^.!?]+[.!?]+/g) || [textToRead];
      let currentSentenceIndex = 0;

      utterance.onboundary = (event) => {
        if (event.name === "sentence") {
          const currentSentence = sentences[currentSentenceIndex];
          if (currentSentence) {
            highlightText(currentSentence.trim());
            currentSentenceIndex++;
          }
        }
      };

      utterance.onend = () => {
        cleanupHighlights();
        sendResponse({ status: "success", message: "Reading completed" });
      };

      utterance.onerror = (error) => {
        cleanupHighlights();
        console.error("Speech synthesis error:", error);
        sendResponse({ status: "error", message: error.message });
      };

      synth.speak(utterance);
      sendResponse({ status: "success", message: "Started reading" });
    } catch (error) {
      console.error("Error in readText:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  if (request.action === "stopReading") {
    try {
      if (synth.speaking) {
        synth.cancel();
        cleanupHighlights();
        sendResponse({ status: "success", message: "Speech stopped" });
      } else {
        sendResponse({ status: "info", message: "No active speech to stop" });
      }
    } catch (error) {
      console.error("Error stopping speech:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  if (request.action === "pauseReading") {
    try {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        sendResponse({ status: "success", message: "Speech paused" });
      } else {
        sendResponse({ status: "info", message: "No active speech to pause" });
      }
    } catch (error) {
      console.error("Error pausing speech:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  if (request.action === "resumeReading") {
    try {
      if (synth.paused) {
        synth.resume();
        sendResponse({ status: "success", message: "Speech resumed" });
      } else {
        sendResponse({ status: "info", message: "No paused speech to resume" });
      }
    } catch (error) {
      console.error("Error resuming speech:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  if (message.action === "resizePage") {
    try {
      const zoomLevel = Math.max(0.1, Math.min(message.zoomLevel / 100, 5)); // Constrain zoom level
      if (document.body) {
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = "top left";
        document.body.style.width = `${100 / zoomLevel}%`;
        sendResponse({ status: "success", message: `Resized to ${message.zoomLevel}%` });
      } else {
        sendResponse({ status: "error", message: "Document body not found" });
      }
    } catch (error) {
      console.error("Error resizing page:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }

  if (request.action === "updateTranscript") {
    try {
      updateTranscript(request.transcript);
      sendResponse({ status: "success", message: "Transcript updated" });
    } catch (error) {
      console.error("Error updating transcript:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }
});

// Function to get selected text
function getSelectedText() {
  return window.getSelection().toString();
}

// Cleanup on page unload
window.addEventListener("unload", () => {
  if (synth.speaking) {
    synth.cancel();
  }
  cleanupHighlights();
});
