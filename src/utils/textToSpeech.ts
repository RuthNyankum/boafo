import { TTSResponse, TTSConfig } from "../types/accessibility";

const sendMessageToTab = async (
  tabId: number,
  message: object
): Promise<TTSResponse> => {
  return new Promise<TTSResponse>((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
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
}: TTSConfig): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    let text = "";
    if (mode === "selection") {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.getSelection()?.toString() || "",
      });
      text = result || "";
    }

    if (!text && mode === "auto") {
      const [{ result }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => document.body.innerText,
      });
      text = result || "";
    }

    if (!text) {
      throw new Error(`No text found to read in mode: ${mode}`);
    }

    return await sendMessageToTab(tab.id, {
      action: "readText",
      text,
      lang: language,
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
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    return await sendMessageToTab(tab.id, { action: "stopReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in stopReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};

export const pauseReading = async (): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    return await sendMessageToTab(tab.id, { action: "pauseReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in pauseReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};

export const resumeReading = async (): Promise<TTSResponse> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    return await sendMessageToTab(tab.id, { action: "resumeReading" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error in resumeReading:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};
