const WebSocket = require('ws');
const { SpeechClient } = require('@google-cloud/speech');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const client = new SpeechClient();
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server running on ws://localhost:8080');

wss.on('connection', (ws) => {
  console.log('Client connected for live transcription');

  const recognizeStream = client
    .streamingRecognize({
      config: {
        encoding: 'LINEAR16', // Or other supported format
        sampleRateHertz: 16000,
        languageCode: 'en-US',
      },
      interimResults: true,
    })
    .on('data', (data) => {
      const transcription =
        data.results
          ?.map((result) => result.alternatives[0].transcript)
          ?.join('\n') || '';
      ws.send(JSON.stringify({ transcription, isFinal: data.results[0]?.isFinal }));
    })
    .on('error', (err) => {
      console.error('Error in streaming recognition:', err);
      ws.send(JSON.stringify({ error: 'Error in transcription' }));
    });

  ws.on('message', (message) => {
    const audioChunk = Buffer.from(message);
    recognizeStream.write(audioChunk);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    recognizeStream.end();
  });
});
