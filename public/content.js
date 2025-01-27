let synth = window.speechSynthesis;
let utterance = null;
let highlightedElements = [];
let recognition = null; // Add recognition object
let isRecognitionPaused = false; // State for recognizing pause

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

// Function to highlight text and scroll to it
function highlightText(text) {
  cleanupHighlights();

  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
  let node;
  let found = false;

  while ((node = walk.nextNode())) {
    const regex = new RegExp(`\\b${text}\\b`, "i"); // Match exact word
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

        // Scroll smoothly to the highlighted word
        span.scrollIntoView({ behavior: "smooth", block: "center" });
        found = true;
      }
    }
    if (found) break; // Stop at the first match to avoid wrong highlights
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
