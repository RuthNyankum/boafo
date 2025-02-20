const speech = require('@google-cloud/speech');
process.env.GOOGLE_APPLICATION_CREDENTIALS = 'boafo-448803-43d3166a8626.json';

async function startLiveTranscription(language = 'en-US') {
    const speechClient = new speech.SpeechClient();

    // Configure request with a dynamic languageCode
    const request = {
        config: {
            encoding: 'LINEAR16',
            sampleRateHertz: 44100,
            languageCode: language,
        },
        interimResults: true, // Get real-time updates
    };

    const recognizeStream = speechClient
        .streamingRecognize(request)
        .on('data', data => {
            const transcript = data.results
                .map(result => result.alternatives[0].transcript)
                .join('\n');
            console.log('Transcription:', transcript);
            updateUI(transcript); // Update Chrome extension UI
        })
        .on('error', err => console.error('Error:', err));

        chrome.tabCapture.capture({ audio: true, video: false }, stream => {
            if (!stream) {
              console.error('Failed to capture tab audio.');
              return;
            }
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
              if (event.data.size > 0) {
                recognizeStream.write(event.data);
              }
            };
            mediaRecorder.start(500); // Send data every 500ms
          });
}

// Function to update the Chrome extension UI
function updateUI(text) {
    const transcriptContainer = document.getElementById('transcript');
    if (transcriptContainer) {
        transcriptContainer.innerText = text;
    }
}

// Start transcription when page loads using the default language
startLiveTranscription();


// TEXT TO SPEECH 
require("dotenv").config(); // Load environment variables
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/text-to-speech", async (req, res) => {
    const { text, language } = req.body;
    const apiKey = process.env.GOOGLE_API_KEY; // Secure API key
    
    if (!apiKey) {
        return res.status(500).send("Server Error: API Key not found.");
    }

    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    try {
        const response = await axios.post(url, {
            input: { text },
            voice: { languageCode: language, ssmlGender: "NEUTRAL" },
            audioConfig: { audioEncoding: "MP3" },
        });

        res.send(response.data.audioContent);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
