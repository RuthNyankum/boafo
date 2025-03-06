/**
 * EyeStrainView component provides controls for adjusting display settings to reduce eye strain.
 * It allows users to adjust font size, brightness, toggle dark mode, and now sends
 * a Chrome message to actually zoom the page using `useZoom`.
 */
"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { ZoomIn, Sun, Moon, LucideZoomIn } from "lucide-react"
import { ViewProps } from "../../types"
import { fadeInVariants } from "../ui/animations"
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { BackButton, ScalingControl, SettingHeader } from "../ui/common"
import { NumericControl } from "../ui/NumericControl"
import { Label } from "../ui/label"
import { Slider } from "../ui/slider"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"

// 1) Import your main accessibility context for brightness, dark mode, etc.
import { useAccessibility } from "../../context/AccessibilityContext"

// 2) Import your new zoom logic
import { useZoom } from "../../hooks/useZoom"

export default function EyeStrainView({ onBack }: ViewProps) {
  // Access brightness, darkMode, etc. from the unified accessibility context
  const {
    fontSize,
    setFontSize,
    brightness,
    setBrightness,
    darkMode,
    toggleDarkMode,
    resetAllSettings,
  } = useAccessibility()

  // 3) Access the new Zoom feature from your custom hook
  const { zoomLevel, adjustZoom } = useZoom()

  // For brightness or other local styling
  useEffect(() => {
    // Example: apply local scale if you still want to scale your extension UI itself
    // (but typically you'd rely on the real page zoom)
    // document.documentElement.style.setProperty("--content-scale", (zoomLevel / 100).toString())

    // Clean up on unmount
    return () => {
      document.documentElement.style.removeProperty("--content-scale")
    }
  }, [zoomLevel])

  // Increase or decrease zoom by 10% each time, capping at 200% or min 50%
  const increaseZoom = () => adjustZoom(Math.min(zoomLevel + 10, 200))
  const decreaseZoom = () => adjustZoom(Math.max(zoomLevel - 10, 50))

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
      // Optionally style your extension's own container
      className="w-[20rem]"
    >
      <Card className={`shadow-lg border-0 overflow-hidden relative ${darkMode ? "dark" : ""}`}>
        {/* Header */}
        <CardHeader className="bg-green-600 text-white p-4 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <BackButton onClick={onBack} />
            <span className="font-bold text-primary-foreground text-lg">Eye Strain & Interface</span>
          </div>
        </CardHeader>

        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            className="absolute top-40 -right-8 w-32 h-32"
          >
            <LucideZoomIn className="w-full h-full text-primary" strokeWidth={0.5} />
          </motion.div>
        </div>

        <CardContent className="p-4 space-y-6">
          {/* Interface Zoom Feature */}
          <div className="space-y-2">
            <SettingHeader icon={ZoomIn} title="Interface Scale" />
            <ScalingControl
              // We pass zoomLevel as a fraction for the UI, e.g. 120 => 1.2
              scale={zoomLevel / 100}
              onIncrease={increaseZoom}
              onDecrease={decreaseZoom}
              label="Interface scale"
            />
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <NumericControl
              value={fontSize}
              min={12}
              max={32}
              step={1}
              label="Font Size"
              onChange={setFontSize}
              unit="px"
            />
          </div>

          {/* Brightness Control */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm flex items-center gap-1">
                <Sun className="text-blue-600 h-3 w-3 text-accent" />
                Brightness
              </Label>
              <span className="bg-primary/10 px-2 py-1 rounded text-xs font-medium">
                {brightness}%
              </span>
            </div>
            <Slider
              min={20}
              max={100}
              step={5}
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              className="focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Adjust brightness"
            />
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-2 bg-muted/20 rounded-md">
            <Label className="text-sm flex items-center gap-1">
              <Moon className="text-blue-600 h-3 w-3 text-accent" />
              Dark Mode
            </Label>
            <Switch
              className="bg-gray-200"
              checked={darkMode}
              onCheckedChange={toggleDarkMode}
              aria-label="Toggle dark mode"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between p-2 bg-muted/50">
          <Button
            variant="default"
            size="sm"
            className="bg-green-600 text-white w-full text-xs"
            onClick={resetAllSettings}
          >
            Reset to Default
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
