import convertor from "./convertor";

export const captureScreenshot = async (
  selectedLanguage: string, 
  setImage: (url: string) => void,
  setOcrResult: (text: string) => void,
  readAloud: (text: string) => void
) => {
  return new Promise<void>((resolve, reject) => {
    chrome.runtime.sendMessage({ action: "captureTab" }, async (response) => {
      if (response?.screenshotUrl) {
        setImage(response.screenshotUrl);
        try {
          const text = await convertor(response.screenshotUrl, selectedLanguage);
          setOcrResult(text);
          readAloud(text);
          resolve();
        } catch (error) {
          console.error("Error during OCR processing:", error);
          console.log("An error occurred during OCR processing.");
          reject(error);
        }
      } else {
        console.error("Failed to capture screenshot.");
        console.log("Failed to capture screenshot.");
        reject(new Error("Screenshot capture failed"));
      }
    });
  });
};