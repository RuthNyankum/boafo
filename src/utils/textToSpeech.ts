import { TTSResponse, TTSConfig } from "../types/accessibility";
import { getLanguageCodes } from "../utils/languageMapping";

// Send messages to the background script (which now handles TTS via Google API)
const sendMessageToBackground = async (
  message: object
): Promise<TTSResponse> => {
  return new Promise<TTSResponse>((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response as TTSResponse);
      }
    });
  });
};

export const readAloud = async ({
  mode = "auto",
  language = "en-US",
  rate = 1.0,
  pitch = 0,
  volume = 1.0,
}: TTSConfig): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    let text = "";

    if (mode === "selection") {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab!.id! },
        func: () => window.getSelection()?.toString() || "",
      });
      text = result || "";
    }

    if (!text && mode === "auto") {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab!.id! },
        func: () => document.body.innerText,
      });
      text = result || "";
    }

    if (!text) {
      throw new Error(`No text found to read in mode: ${mode}`);
    }

    // Convert using mapping for TTS
    const languageCodes = getLanguageCodes(language);

    // Send message to background for Google TTS processing including rate, pitch, and volume
    return await sendMessageToBackground({
      action: "readText",
      text,
      lang: languageCodes.tts,
      rate,
      pitch,
      volume,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in readAloud:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};

export const stopReading = async (): Promise<TTSResponse> => {
  try {
    return await sendMessageToBackground({ action: "stopReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in stopReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};

export const pauseReading = async (): Promise<TTSResponse> => {
  try {
    return await sendMessageToBackground({ action: "pauseReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in pauseReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};

export const resumeReading = async (): Promise<TTSResponse> => {
  try {
    return await sendMessageToBackground({ action: "resumeReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in resumeReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};
