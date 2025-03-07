import { useCallback, useState } from "react";
import {
  startTranscription,
  stopTranscription,
  pauseTranscription,
  resumeTranscription,
} from "../utils/speechToText";
import { useLanguage } from "../context/language.context";

export const useSpeechToText = () => {
  const { selectedLanguage } = useLanguage();
  // Local state for process control
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStopped, setIsStopped] = useState<boolean>(true);

  const handleSpeechToText = useCallback(async () => {
    // Only start if not already processing and currently stopped.
    if (isProcessing || !isStopped) return;
    try {
      setIsProcessing(true);
      setIsStopped(false);
      setIsPaused(false);
      await startTranscription({ language: selectedLanguage });
    } catch (error) {
      console.error("Speech-to-text error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, isStopped, selectedLanguage]);

  const handlePauseTranscription = useCallback(async () => {
    // Only pause if transcription is active and not already paused.
    if (isStopped || isPaused) return;
    setIsPaused(true);
    try {
      await pauseTranscription();
    } catch (error) {
      console.error("Error pausing transcription:", error);
      setIsPaused(false);
    }
  }, [isStopped, isPaused]);

  const handleResumeTranscription = useCallback(async () => {
    // Only resume if transcription is active and currently paused.
    if (isStopped || !isPaused) return;
    setIsPaused(false);
    try {
      await resumeTranscription();
    } catch (error) {
      console.error("Error resuming transcription:", error);
      setIsPaused(true);
    }
  }, [isStopped, isPaused]);

  const handleStopTranscription = useCallback(async () => {
    if (isStopped) return;
    // Optimistically update state: transcription stops and pause is reset.
    setIsStopped(true);
    setIsPaused(false);
    try {
      await stopTranscription();
    } catch (error) {
      console.error("Error stopping transcription:", error);
      // Optionally, you could revert state here.
    }
  }, [isStopped]);

  return {
    isProcessing,
    isStopped,
    isPaused,
    handleSpeechToText,
    handlePauseTranscription,
    handleResumeTranscription,
    handleStopTranscription,
  };
};
