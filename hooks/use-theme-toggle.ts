'use client'

import { resolvedTheme, setTheme } from '@/lib/theme'
import { useSyncExternalStore } from 'react'

/**
 * Watch for theme changes: an explicit choice (the `themechange` event) or the system's light/dark setting.
 *
 * @param onChange - Called on every change.
 * @returns The function that stops watching.
 */
const subscribe = (onChange: () => void) => {
  const media = window.matchMedia('(prefers-color-scheme: dark)')
  window.addEventListener('themechange', onChange)
  media.addEventListener('change', onChange)
  return () => {
    window.removeEventListener('themechange', onChange)
    media.removeEventListener('change', onChange)
  }
}

/**
 * The light/dark switch: whether dark is on (null before hydration) and the action that flips it.
 *
 * @returns The switch's model: `known` (false until the theme can be read on the client), `isDark`, and `toggle`,
 * which sets the opposite theme explicitly.
 */
export function useThemeToggle() {
  const theme = useSyncExternalStore(subscribe, resolvedTheme, () => null)
  const isDark = theme === 'dark'
  return {
    known: theme !== null,
    isDark,
    toggle: () => setTheme(isDark ? 'light' : 'dark'),
  }
}
