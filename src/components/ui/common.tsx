/**
 * Common UI components used throughout the application.
 * These components provide consistent UI elements with accessibility features.
 */
"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ZoomInIcon, ZoomOutIcon,} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Button } from "./button"
import { pulseAnimation } from "./animations"
import { useEffect, useState } from "react"

/**
 * BackButton component provides a consistent way to navigate back to the previous view
 */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-primary-foreground hover:bg-primary/20 mr-1"
      onClick={onClick}
      aria-label="Go back to main menu"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}

/**
 * StatusIndicator shows an active/inactive status with animation when active
 */
export function StatusIndicator({ active }: { active: boolean }) {
  return (
    <motion.div
      animate={active ? pulseAnimation.animate : {}}
      className={`w-2 h-2 rounded-full ${active ? "bg-green-500" : "bg-gray-300"}`}
      aria-hidden="true"
    />
  )
}

/**
 * SettingHeader provides a consistent header for settings sections
 */
export function SettingHeader({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <h3 className="text-lg  font-semibold flex items-center gap-2">
      <Icon className="h-5 w-5 text-blue-600 text-accent" />
      {title}
    </h3>
  )
}

/**
 * ScalingControl provides UI for adjusting scale values (zoom, font size, etc.)
 */
export interface ScalingControlProps {
  scale: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
  label?: string
}


export interface ScalingControlProps {
  scale: number
  onIncrease: () => void
  onDecrease: () => void
  min?: number
  max?: number
  label?: string
  unit?: string
}

export function ScalingControl({
  scale,
  onIncrease,
  onDecrease,
  min = 0.5,
  max = 2,
  label = "Interface Scale",
  unit = "%",
}: ScalingControlProps) {
  const [localScale, setLocalScale] = useState(scale)

  useEffect(() => {
    setLocalScale(scale)
  }, [scale])

  // Calculate the progress percentage based on the current scale
  const percentage = ((localScale - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div
        className="relative flex items-center dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm overflow-hidden"
        role="group"
        aria-labelledby={`${label.toLowerCase().replace(/\s+/g, "-")}-label`}
      >
        {/* Decrement Button */}
        <button
          onClick={onDecrease}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={localScale <= min}
        >
          <ZoomOutIcon className="h-6 w-6" />
        </button>

        {/* Progress Bar & Large Value Display */}
        <div className="flex-grow relative h-16">
          <div
            className="absolute inset-0 bg-green-50 dark:bg-green-700 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={localScale}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-4xl font-bold text-gray-700 dark:text-gray-300"
              id={`${label.toLowerCase().replace(/\s+/g, "-")}-label`}
            >
              {Math.round(localScale * 100)}{unit}
            </motion.span>
          </div>
        </div>

        {/* Increment Button */}
        <button
          onClick={onIncrease}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={localScale >= max}
        >
          <ZoomInIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}



/**
 * FeatureCard provides a consistent card layout for feature descriptions
 */
export function FeatureCard({
  title,
  description,
  icon: Icon,
}: {
  title: string
  description: string
  icon: LucideIcon
}) {
  return (
    <div className="bg-muted/30 p-3 rounded-md">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-accent" />
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

/**
 * StatusCard displays the current status of a feature
 */
export function StatusCard({
  title,
  statusText,
  isActive,
}: {
  title: string
  statusText: string
  isActive: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-green-50 rounded-lg p-4 space-y-2 m-3"
    >
      <div className="text-sm font-medium">{title}</div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <StatusIndicator active={isActive} />
        {statusText}
      </div>
    </motion.div>
  )
}

