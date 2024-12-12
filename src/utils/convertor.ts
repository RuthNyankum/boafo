import { createWorker } from "tesseract.js";

const convertor = async (img: string, lang: string = 'eng'): Promise<string> => {
  console.log(`Initializing Tesseract.js worker for ${lang} language`);
  const worker = await createWorker({
    workerPath: chrome.runtime.getURL('lib/tesseract/worker.min.js'),
    langPath: chrome.runtime.getURL('lib/tesseract/'),
    corePath: chrome.runtime.getURL('lib/tesseract/tesseract-core.wasm.js'),
  });

  try {
    console.log(`Loading language: ${lang}`);
    await worker.loadLanguage(lang);

    console.log(`Initializing language: ${lang}`);
    await worker.initialize(lang);

    console.log("Starting OCR on image...");
    const { data: { text } } = await worker.recognize(img);
    console.log("OCR Result:", text);

    return text;
  } catch (error) {
    console.log(`Error in Tesseract.js: ${error}`);
    throw new Error("Failed to process OCR.");
  } finally {
    console.log("Terminating Tesseract.js worker...");
    await worker.terminate();
  }
};

export default convertor;