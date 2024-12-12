import { createWorker } from "tesseract.js";

const convertor = async (img: string, lang: string = 'eng'): Promise<string> => {
  console.log(`Initializing Tesseract.js worker for ${lang} language`);
  const worker = await createWorker({
    workerPath: chrome.runtime.getURL('lib/tesseract/worker.min.js'),
    langPath: chrome.runtime.getURL('lib/tesseract/'),
    corePath: chrome.runtime.getURL('lib/tesseract/tesseract-core.wasm.js'),
  });

  try {
    await worker.loadLanguage(lang);
    await worker.initialize(lang);

    const { data: { text } } = await worker.recognize(img);
    console.log("OCR Result:", text);

    return text;
  } catch (error) {
    console.error("OCR Error:", error);
    throw new Error(`Failed to process OCR: ${error}`);
  } finally {
    await worker.terminate();
  }
};

export default convertor;