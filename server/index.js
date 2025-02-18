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

    // Capture microphone audio
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = event => {
                recognizeStream.write(event.data);
            };
            mediaRecorder.start(500); // Send data every 500ms
        })
        .catch(err => console.error('Microphone error:', err));
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
