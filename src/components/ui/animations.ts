/**
 * Animation variants for use with Framer Motion throughout the application.
 * These provide consistent animations for components entering, exiting, and transitioning.
 */

// Standard fade in/out animation with slight vertical movement
export const fadeInVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

// Spring transition for more dynamic animations
export const springTransition = {
  type: "spring",
  duration: 0.5,
  stiffness: 300,
  damping: 30,
}

// Slide in from right animation for panel transitions
export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
}

// Slide in from left animation for panel transitions
export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
}

// Scale animation for buttons and interactive elements
export const scaleAnimation = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
}

// Pulse animation for indicators and attention-grabbing elements
export const pulseAnimation = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },
}

// Staggered children animation for lists
export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Item animation for use with staggerContainer
export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

