"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, Waves, Settings2, Speaker, Mic2, Volume2 } from "lucide-react";
import { useTextToSpeech } from "../../hooks/useTextToSpeech";
import { useAccessibility } from "../../context/AccessibilityContext";
import { ViewProps } from "../../types";
import { fadeInVariants } from "../ui/animations";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackButton, SettingHeader, StatusCard } from "../ui/common";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useLanguage } from "../../context/language.context";

export default function VirtualImpairmentView({ onBack }: ViewProps) {
  // Local state for TTS status
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Get the selected language from the global language context
  const { selectedLanguage, langOptions } = useLanguage();
  const currentLanguageOption = langOptions.find(option => option.value === selectedLanguage);
  const currentLanguageLabel = currentLanguageOption ? currentLanguageOption.lang : selectedLanguage;

    // Global settings for TTS (reading speed, voice, etc.)
  const { readerSpeed, setReaderSpeed, readerVoice, setReaderVoice } = useAccessibility();

  // TTS hook (uses selectedLanguage, readerSpeed, and selectedVoice)
  const {
    isProcessing,
    isStopped,
    handleTextToSpeech,
    handlePauseResume,
    handleStopReading,
  } = useTextToSpeech();

  // Control functions
  const startReading = () => {
    setIsReading(true);
    setIsPaused(false);
    handleTextToSpeech();
  };

  const togglePlayPause = () => {
    setIsPaused((prev) => !prev);
    handlePauseResume();
  };

  const stopReading = () => {
    setIsReading(false);
    setIsPaused(false);
    handleStopReading();
  };

  return (
    <motion.div variants={fadeInVariants} initial="initial" animate="animate" exit="exit" layout>
      <Card className="w-80 shadow-lg border-0 overflow-hidden relative">
        {/* Decorative background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-40 -right-8 w-32 h-32"
          >
            <Waves className="w-full h-full text-accent" strokeWidth={0.5} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute -bottom-8 -left-8 w-32 h-32"
          >
            <Speaker className="w-full h-full text-accent" strokeWidth={0.5} />
          </motion.div>
        </div>

       {/* Header */}
       <CardHeader className="bg-green-600 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton onClick={onBack} />
            <span className="font-bold text-white text-lg">Virtual Impairment</span>
          </div>
          {/* Badge showing the selected language */}
          <div className="px-2 py-1 bg-white bg-opacity-30 backdrop-blur-sm rounded text-xs text-gray-800">
            {currentLanguageLabel}
          </div>
        </CardHeader>

        {/* Main Content */}
        <CardContent className="p-6 space-y-6 relative">
          {/* Screen Reader Controls */}
          <div className="space-y-3">
            <SettingHeader icon={Mic2} title="Screen Reader Controls" />
            <div className="flex justify-center gap-3">
              <AnimatePresence mode="wait">
                {isStopped ? (
                  <motion.div
                    key="start"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Button
                      variant="default"
                      size="lg"
                      className="h-16 px-6 bg-green-600 hover:bg-green-500 duration-300 text-white rounded-full text-base font-medium focus:ring-4 focus:ring-green-300 relative overflow-hidden"
                      onClick={startReading}
                      aria-label="Start screen reader"
                      disabled={isProcessing}
                    >
                      <motion.div
                        className="absolute inset-0 bg-green-600/10"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                      />
                      <Play className="h-5 w-5 mr-2" />
                      {isProcessing ? "Starting..." : "Start Reading"}
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="controls"
                    className="flex gap-3"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.5 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="h-14 w-14 hover:bg-blue-400 hover:text-white rounded-full border-2 focus:ring-4 focus:ring-green-300 relative"
                      onClick={togglePlayPause}
                      aria-label={isPaused ? "Resume screen reader" : "Pause screen reader"}
                    >
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-300/30"
                        animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeOut" }}
                      />
                      {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6" />}
                    </Button>
                    <Button
                      variant="destructive"
                      size="lg"
                      className="h-14 w-14 bg-red-600 hover:bg-red-500 duration-300 text-white rounded-full focus:ring-4 focus:ring-red-300"
                      onClick={stopReading}
                      aria-label="Stop screen reader"
                    >
                      <Square className="h-6 w-6" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {!isStopped && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-center text-sm text-green-600 font-medium mt-2"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    {isPaused ? "Reading paused" : "Currently reading page content..."}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reading Speed Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label htmlFor="speed-slider" className="text-base font-medium flex items-center gap-2">
                <Settings2 className="text-blue-600 h-4 w-4" />
                Reading Speed
              </Label>
              <motion.span
                key={readerSpeed}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-green-600/10 px-2 py-1 rounded text-sm font-medium"
              >
                {readerSpeed.toFixed(1)}x
              </motion.span>
            </div>
            <Slider
              id="speed-slider"
              min={0.5}
              max={2}
              step={0.1}
              value={[readerSpeed]}
              onValueChange={(value) => setReaderSpeed(value[0])}
              aria-label="Adjust reading speed"
              className="focus-visible:ring-4 focus-visible:ring-green-300"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Faster</span>
            </div>
          </div>

          {/* Speaker Selection */}
          <div className="space-y-3">
            <Label htmlFor="speaker-select" className="text-base font-medium flex items-center gap-2">
              <Volume2 className="text-blue-600 h-4 w-4" />
              Speaker Voice
            </Label>
            <Select value={readerVoice} onValueChange={setReaderVoice} aria-label="Select speaker voice">
              <SelectTrigger id="speaker-select" className="w-full h-12 text-base outline-none">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="neutral">Neutral Voice (Default)</SelectItem>
                <SelectItem value="female">Female Voice</SelectItem>
                <SelectItem value="male">Male Voice</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Footer */}
        <AnimatePresence>
          {isReading ? (
            <StatusCard
              title="Current Status"
              statusText={
                isPaused
                  ? "Paused"
                  : `Reading at ${readerSpeed.toFixed(1)}x speed with ${readerVoice} voice`
              }
              isActive={!isStopped && !isPaused}
            />
          ) : (
            <motion.div key="help" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <CardFooter className="flex justify-between p-4 bg-gray-100">
                <div className="text-sm text-muted-foreground text-center w-full">
                  Configure your preferences and press Start Reading to begin
                </div>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
