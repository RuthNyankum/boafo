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

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle text-to-speech functionality
  if (request.action === "readText") {
    try {
      if (synth.speaking) synth.cancel();

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

  // Handle resize functionality
  if (request.action === "resizePage") {
    try {
      const zoomLevel = Math.max(0.1, Math.min(request.zoomLevel / 100, 5));
      if (document.body) {
        document.body.style.transform = `scale(${zoomLevel})`;
        document.body.style.transformOrigin = "top left";
        document.body.style.width = `${100 / zoomLevel}%`;
        sendResponse({ status: "success", message: `Resized to ${request.zoomLevel}%` });
      } else {
        sendResponse({ status: "error", message: "Document body not found" });
      }
    } catch (error) {
      console.error("Error resizing page:", error);
      sendResponse({ status: "error", message: error.message });
    }
    return true;
  }

  // Handle speech-to-text functionality
  if (request.action === "startSpeechRecognition") {
    try {
      if (typeof webkitSpeechRecognition !== "undefined") {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          chrome.runtime.sendMessage({
            action: "updateTranscript",
            transcript,
          });
        };

        recognition.onerror = (error) => {
          console.error("Speech recognition error:", error);
          sendResponse({ status: "error", message: error.message });
        };

        recognition.start();
        sendResponse({ status: "success", message: "Speech recognition started" });
      } else {
        throw new Error("Speech recognition not supported in this browser");
      }
    } catch (error) {
      console.error("Error starting speech recognition:", error);
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
  if (synth.speaking) synth.cancel();
  cleanupHighlights();
});
