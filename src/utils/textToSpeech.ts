import { TextToSpeechResponse } from "../types/accessibility";

export const readAloud = async (text: string, lang: string = "en-US"): Promise<TextToSpeechResponse> => {
  try {
    const response = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = response[0];

    if (!activeTab?.id) {
      throw new Error("No active tab found");
    }

    if (text === "auto") {
      const textResponse = await chrome.tabs.sendMessage(activeTab.id, {
        action: "extractText",
      }) as TextToSpeechResponse;

      if (textResponse?.status === "success" && textResponse.text) {
        text = textResponse.text;
      } else {
        throw new Error("Failed to extract text from the page");
      }
    }

    await chrome.runtime.sendMessage({
      action: "readText",
      text,
      lang,
    });

    return { status: "success", message: "Text-to-speech initiated", text };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error("Error in readAloud:", errorMessage);
    return { status: "error", message: errorMessage };
  }
};
