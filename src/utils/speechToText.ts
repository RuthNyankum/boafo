import { SpeechToTextResponse } from "../types/accessibility";

export const speechToText = async (): Promise<SpeechToTextResponse> => {
  try {
    const response = await chrome.runtime.sendMessage({ action: "monitorMedia" }) as SpeechToTextResponse;

    if (response?.status === "success") {
      const indicator = document.createElement("div");
      indicator.id = "speech-indicator";
      indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border-radius: 5px;
        z-index: 10000;
      `;
      indicator.textContent = "🎤 Converting Speech to Text...";
      document.body.appendChild(indicator);

      indicator.onclick = async () => {
        await chrome.runtime.sendMessage({ action: "stopMediaMonitoring" });
        indicator.remove();
      };
    }

    return response;
  } catch (error) {
    console.error("Error in speechToText:", error);
    return { status: "error", message: error instanceof Error ? error.message : "An unknown error occurred" };
  }
};
