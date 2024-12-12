import { createWorker } from "tesseract.js";

const convertor = async (img: string, lang: string): Promise<string> => {
  console.log("Initializing Tesseract.js worker...");
  const worker = await createWorker({
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.1/dist/worker.min.js',
    langPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@v5.1.1/dist/lang/',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@v2.4.0/tesseract-core.wasm.js',
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
