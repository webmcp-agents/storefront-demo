/** The visitor's theme choice; `system` follows the OS setting. */
export type Theme = 'light' | 'dark' | 'system'
/** localStorage key for a stored choice; no entry means `system`. */
const KEY = 'shop:theme'

/**
 * The stored theme choice, or `system` when none is stored or storage is unavailable.
 *
 * @returns The stored {@link Theme}.
 * @remarks Client only: reads `localStorage`.
 */
export function getTheme(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {}
  return 'system'
}

/**
 * Swap the theme with every transition off, so colors change in one frame instead of each control fading on its own
 * schedule: disable transitions, force a style flush, restore them after the next frame.
 *
 * @param apply - Makes the change; runs synchronously.
 * @remarks Client only: touches `document`.
 */
function withoutTransitions(apply: () => void) {
  const style = document.createElement('style')
  style.textContent = '*,*::before,*::after{transition:none!important}'
  document.head.appendChild(style)
  apply()
  void window.getComputedStyle(document.body).opacity
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()))
}

/**
 * Apply a theme now, remember it (`system` clears the stored choice) and fire `themechange` on `window`.
 *
 * @param theme - The choice to apply and store.
 * @remarks Client only: uses `document`, `window` and `localStorage`. Storage errors are ignored.
 */
export function setTheme(theme: Theme) {
  withoutTransitions(() => applyTheme(theme))
  try {
    if (theme === 'system') localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, theme)
  } catch {}
  window.dispatchEvent(new Event('themechange'))
}

/**
 * Set `data-theme` on `<html>`, or remove it for `system` so the CSS media query decides.
 *
 * @param theme - The theme to show.
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

/**
 * The theme actually showing: the stored choice, or the OS preference when it is `system`.
 *
 * @returns `light` or `dark`.
 * @remarks Client only: reads `localStorage` and `matchMedia`.
 */
export function resolvedTheme(): 'light' | 'dark' {
  const t = getTheme()
  if (t !== 'system') return t
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/**
 * Runs before paint so a stored choice never flashes the wrong theme.
 *
 * @remarks Inlined in a `<script>` in the root layout's `<head>`; does what {@link getTheme} and {@link applyTheme} do,
 * without the module.
 */
export const themeInitScript = `try{var t=localStorage.getItem('${KEY}');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`
