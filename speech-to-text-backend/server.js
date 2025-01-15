const express = require("express");
const { SpeechClient } = require("@google-cloud/speech");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Google Cloud Speech client
const client = new SpeechClient({
  keyFilename: path.join(__dirname, "path/to/your-google-cloud-key.json"),
});

// API endpoint to process audio to text
app.post("/speech-to-text", express.json(), async (req, res) => {
  const audio = req.body.audio;  // Base64 encoded audio

  const audioBytes = audio; // assuming you send the audio in base64 format

  const request = {
    audio: {
      content: audioBytes,
    },
    config: {
      encoding: "LINEAR16", // Adjust encoding as needed
      sampleRateHertz: 16000,
      languageCode: "en-US",
    },
  };

  try {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join("\n");
    res.json({ status: "success", transcription });
  } catch (error) {
    console.error("Error during speech-to-text:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
