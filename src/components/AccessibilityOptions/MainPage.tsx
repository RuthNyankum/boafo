"use client"

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

// Import the unified AccessibilityProvider
import { AccessibilityProvider } from "../../context/AccessibilityContext";
import MainCard from "./MainCard";
import ScreenReaderView from "../views/ScreenReaderView";
import HearingImpairmentView from "../views/HearingImpairmentView";
import EyeStrainView from "../views/EyeStrainView";
import HelpTutorialsView from "../views/HelpTutorialsView";
import SettingsView from "../views/SettingsView";
import { ViewType } from "../../types";

export default function MainPage() {
  const [activeView, setActiveView] = useState<ViewType>("main");

  const renderView = () => {
    switch (activeView) {
      case "screenReader":
        return <ScreenReaderView onBack={() => setActiveView("main")} />;
      case "hearing":
        return <HearingImpairmentView onBack={() => setActiveView("main")} />;
      case "eyeStrain":
        return <EyeStrainView onBack={() => setActiveView("main")} />;
      case "help":
        return <HelpTutorialsView onBack={() => setActiveView("main")} />;
      case "settings":
        return <SettingsView onBack={() => setActiveView("main")} />;
      default:
        return (
          <MainCard
            onScreenReaderClick={() => setActiveView("screenReader")}
            onHearingClick={() => setActiveView("hearing")}
            onEyeStrainClick={() => setActiveView("eyeStrain")}
            onHelpClick={() => setActiveView("help")}
            onSettingsClick={() => setActiveView("settings")}
          />
        );
    }
  };

  return (
    <AccessibilityProvider>
        <AnimatePresence mode="wait">{renderView()}</AnimatePresence>
    </AccessibilityProvider>
  );
}
