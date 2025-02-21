import { useCallback, useState } from 'react';
import { readAloud, pauseReading, resumeReading, stopReading } from '../utils/textToSpeech';
import { useLanguage } from '../context/language.context';
import { useVoice } from '../context/voice.context';

export const useTextToSpeech = () => {
  const { selectedLanguage } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0); 
  const { selectedVoice } = useVoice();

  // Function to update the audio playback rate dynamically
  const updateAudioRate = useCallback((rate: number) => {
    chrome.runtime.sendMessage({ action: "updatePlaybackRate", rate });
  }, []);

  const handleTextToSpeech = useCallback(async () => {
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      // Start the TTS with the current speech rate.
      await readAloud({ language: selectedLanguage, rate: speechRate,voiceType: selectedVoice });
    } catch (error) {
      console.error("Text-to-speech error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isStopped, selectedLanguage, speechRate,selectedVoice]);

  const handlePauseResume = useCallback(async () => {
    if (isStopped) return;
    try {
      if (isPaused) {
        await resumeReading();
        setIsPaused(false);
      } else {
        await pauseReading();
        setIsPaused(true);
      }
    } catch (error) {
      console.error("Error toggling pause/resume:", error);
    }
  }, [isPaused, isStopped]);

  const handleStopReading = useCallback(async () => {
    if (isStopped) return;
    try {
      await stopReading();
      setIsStopped(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error stopping reading:", error);
    }
  }, [isStopped]);

  // Increase the rate (capped at 2.0x)
  const increaseRate = useCallback(() => {
    setSpeechRate((prev) => {
      const newRate = Math.min(prev + 0.1, 2.0);
      if (!isStopped) {
        updateAudioRate(newRate);
      }
      return newRate;
    });
  }, [isStopped, updateAudioRate]);

  // Decrease the rate (capped at 0.5x)
  const decreaseRate = useCallback(() => {
    setSpeechRate((prev) => {
      const newRate = Math.max(prev - 0.1, 0.5);
      if (!isStopped) {
        updateAudioRate(newRate);
      }
      return newRate;
    });
  }, [isStopped, updateAudioRate]);

  return { 
    isProcessing, 
    isPaused, 
    isStopped, 
    speechRate, 
    handleTextToSpeech, 
    handlePauseResume, 
    handleStopReading,
    increaseRate,
    decreaseRate
  };
};
