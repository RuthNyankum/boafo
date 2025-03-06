/**
 * NumericControl component provides a user-friendly interface for adjusting numeric values
 * with increment/decrement buttons and visual feedback.
 */
"use client"

import { useState, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { motion } from "framer-motion"

interface NumericControlProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
  unit?: string
}

export function NumericControl({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit = "",
}: NumericControlProps) {
  // Local state to track the value
  const [localValue, setLocalValue] = useState(value)

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  // Increment the value
  const increment = () => {
    const newValue = Math.min(localValue + step, max)
    setLocalValue(newValue)
    onChange(newValue)
  }

  // Decrement the value
  const decrement = () => {
    const newValue = Math.max(localValue - step, min)
    setLocalValue(newValue)
    onChange(newValue)
  }

  // Calculate percentage for the progress bar
  const percentage = ((localValue - min) / (max - min)) * 100

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
      <div
        className="relative flex items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm overflow-hidden"
        role="group"
        aria-labelledby={`${label.toLowerCase().replace(/\s+/g, "-")}-label`}
      >
        {/* Decrement button */}
        <button
          onClick={decrement}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Decrease ${label.toLowerCase()}`}
        >
          <ChevronDown className="h-5 w-5" />
        </button>

        {/* Progress bar and value display */}
        <div className="flex-grow relative h-10">
          <div
            className="absolute inset-0 bg-primary/10 dark:bg-primary/20 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={localValue}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="text-lg font-semibold text-gray-700 dark:text-gray-300"
              id={`${label.toLowerCase().replace(/\s+/g, "-")}-label`}
            >
              {localValue}
              {unit}
            </motion.span>
          </div>
        </div>

        {/* Increment button */}
        <button
          onClick={increment}
          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Increase ${label.toLowerCase()}`}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

