let synth = window.speechSynthesis;
let utterance = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle resize page action
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

  // Handle text extraction
  if (message.action === "extractText") {
    try {
      const textContent = document.body.innerText;
      sendResponse({ status: "success", text: textContent });
    } catch (error) {
      console.error("Error extracting text:", error);
      sendResponse({ status: "error", message: error.message });
    }
  }
  if (message.action === "readText") {
    const text = message.text;
    const lang = message.lang || "en-US";

    // Cancel any ongoing speech synthesis
    if (synth.speaking) {
      synth.cancel();
    }

    // Highlight the text being read
    const textElement = document.body.querySelector(`[data-read-text="true"]`);
    if (textElement) textElement.removeAttribute("data-read-text");

    const range = document.createRange();
    const selection = window.getSelection();

    const startNode = document.body; // Update this to target a specific container if needed
    const textContent = startNode.textContent || "";
    const startIndex = textContent.indexOf(text);

    if (startIndex !== -1) {
      range.setStart(startNode.firstChild, startIndex);
      range.setEnd(startNode.firstChild, startIndex + text.length);
      selection.removeAllRanges();
      selection.addRange(range);

      // Add attribute to identify highlighted text
      const highlightSpan = document.createElement("span");
      highlightSpan.style.backgroundColor = "yellow";
      highlightSpan.dataset.readText = "true";
      range.surroundContents(highlightSpan);
    }

    // Create and speak the utterance
    utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    utterance.onend = () => {
      selection.removeAllRanges();
      if (highlightSpan) highlightSpan.remove();
      sendResponse({ status: "success", message: "Reading completed." });
    };

    utterance.onerror = (error) => {
      console.error("Error in speech synthesis:", error);
      sendResponse({ status: "error", message: error.message });
    };

    synth.speak(utterance);
    return true; // Required for async response
  }

  if (message.action === "stopReading") {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      sendResponse({ status: "success", message: "Speech stopped successfully." });
    } else {
      sendResponse({ status: "error", message: "No speech synthesis to stop." });
    }
  }

  // Handle Spacebar navigation
  if (message.action === "setupSpaceNavigation") {
    let currentElement = null;
    let elements = [];

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (!elements.length) {
          elements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, article, section'));
        }
        if (!currentElement) {
          currentElement = 0;
        } else {
          currentElement = (currentElement + 1) % elements.length;
        }
        elements[currentElement].scrollIntoView({ behavior: 'smooth' });

        // Highlight current element
        elements.forEach(el => el.style.backgroundColor = '');
        elements[currentElement].style.backgroundColor = 'rgba(255, 255, 0, 0.3)';

        // Send text to be read
        chrome.runtime.sendMessage({
          action: "readText",
          text: elements[currentElement].innerText
        });
      }
    });

    sendResponse({ status: "success", message: "Space navigation enabled" });
  }

  // Handle text highlighting
  if (message.action === "highlightText") {
    const highlightClass = "highlighted-text";

    // Remove previous highlights
    document.querySelectorAll(`.${highlightClass}`).forEach((el) => {
      el.classList.remove(highlightClass);
    });

    const textToHighlight = message.text;
    const elements = document.body.querySelectorAll("*:not(script):not(style)");

    elements.forEach((el) => {
      if (el.textContent.includes(textToHighlight)) {
        el.innerHTML = el.innerHTML.replace(
          textToHighlight,
          `<span class="${highlightClass}">${textToHighlight}</span>`
        );
      }
    });

    // Add a basic style for highlighting
    const style = document.createElement("style");
    style.innerHTML = `
      .highlighted-text {
        background-color: yellow;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);

    sendResponse({ status: "success", message: "Text highlighted" });
  }

  // Handle getting tags
  if (message.action === "getTags") {
    const elements = Array.from(document.querySelectorAll(message.tagName || "p"));
    const tags = elements.map((el) => el.textContent.trim()).filter((text) => text);
    sendResponse({ tags });
  }

  return true; // Required for async response
});
