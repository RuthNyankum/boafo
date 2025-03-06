/**
 * Utility functions for the Boafo accessibility extension
 */

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class names into a single string using clsx and tailwind-merge.
 * This allows for conditional and dynamic class names while avoiding conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date into a localized string based on user preferences.
 */
export function formatDate(date: Date, locale = "en"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

/**
 * Debounces a function to limit how often it can be called.
 * Useful for performance optimization with frequently triggered events.
 */
export function debounce<T extends (...args: unknown[]) => unknown>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Safely accesses nested object properties without throwing errors.
 */
export function safeGet<T, K extends keyof T>(obj: T, key: K): T[K] | undefined {
  try {
    return obj[key]
  } catch {
    return undefined
  }
}

/**
 * Generates a unique ID for accessibility attributes.
 */
export function generateId(prefix = "boafo"): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`
}
