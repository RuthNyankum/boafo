// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Optional: Enable CORS if your extension needs it
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // adjust as needed for security
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// POST /tts endpoint to proxy Google TTS requests
app.post('/tts', async (req, res) => {
  const { text, languageCode, ssmlGender, audioConfig } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Missing required field: text" });
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server configuration error: API key not set" });
  }

  // Construct the request payload for Google TTS API
  const payload = {
    input: { text },
    voice: {
      languageCode: languageCode || "en-US",
      ssmlGender: ssmlGender || "NEUTRAL"
    },
    audioConfig: {
      audioEncoding: "MP3",
      speakingRate: audioConfig?.speakingRate || 1.0,
      pitch: audioConfig?.pitch || 0,
      volumeGainDb: audioConfig?.volumeGainDb || 0
    }
  };

  const googleUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  try {
    const response = await fetch(googleUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Google TTS:", errorData);
      return res.status(response.status).json({ error: "Error from Google TTS", details: errorData });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error calling Google TTS:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /stt endpoint to proxy Google Speech-to-Text requests
// app.post('/stt', async (req, res) => {
//   const { audioContent, config } = req.body;
//   if (!audioContent) {
//     return res.status(400).json({ error: "Missing required field: audioContent" });
//   }
//   const apiKey = process.env.GOOGLE_STT_API_KEY;
//   if (!apiKey) {
//     return res.status(500).json({ error: "Server configuration error: API key not set" });
//   }

//   // Construct the request payload for Google Speech-to-Text API
//   const payload = {
//     config: {
//       encoding: config?.encoding || "LINEAR16",
//       sampleRateHertz: config?.sampleRateHertz || 16000,
//       languageCode: config?.languageCode || "en-US"
//     },
//     audio: {
//       content: audioContent
//     }
//   };

//   const googleUrl = `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`;

//   try {
//     const response = await fetch(googleUrl, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error("Error from Google STT:", errorData);
//       return res.status(response.status).json({ error: "Error from Google STT", details: errorData });
//     }

//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("Error calling Google STT:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Backend service is running on port ${port}`);
});
