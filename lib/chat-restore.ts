/**
 * Restores a docked, open chat before the first paint.
 *
 * `<AgentChat>` keeps whether it is open in sessionStorage and reads it after hydration, so a reload with the chat
 * open painted the page full-width and closed, then docked it and slid the panel in. {@link chatRestoreScript} runs
 * in `<head>` instead: when the chat was open on a wide screen it docks the page at the saved width straight away and
 * marks `<html>` with `data-wa-chat-restoring`, which paints a placeholder where the panel goes (see globals.css) and
 * turns off the panel's entrance animation. {@link endChatRestore} removes the mark once the real panel is on screen.
 *
 * The keys, default width and clamping mirror `@webmcp-agents/chat` (AgentChat's `useOpen`, dock.tsx's `useDock`).
 */

/** AgentChat's open-state key, for the default `storageKey` ("web-agents:chat"). */
const OPEN_KEY = 'web-agents:chat:open'
/** dock.tsx's width key. */
const WIDTH_KEY = 'web-agents:chat:width'
/** dock.tsx's DOCK_QUERY: narrower than this the chat is a bottom sheet and never docks. */
const DOCK_QUERY = '(min-width: 640px)'
/** The side ShopperChat docks on (`position="bottom-left"`). */
const SIDE = 'left'
/** The attribute that shows the placeholder and turns off the panel's entrance animation. */
const RESTORING_ATTR = 'data-wa-chat-restoring'

/** Inline `<head>` script: dock the page at the saved width when the chat was left open. Never throws. */
export const chatRestoreScript = `try{if(sessionStorage.getItem('${OPEN_KEY}')==='1'&&matchMedia('${DOCK_QUERY}').matches){var d=document.documentElement,w=Number(localStorage.getItem('${WIDTH_KEY}')),m=Math.max(320,Math.min(720,innerWidth-360));w=Math.round(Math.min(m,Math.max(320,isFinite(w)&&w>0?w:380)));d.dataset.waChatDock='${SIDE}';d.style.setProperty('--wa-chat-inset-${SIDE}',w+'px');d.setAttribute('${RESTORING_ATTR}','')}}catch(e){}`

/**
 * Remove the restoring mark once the chat panel is in the page, so later opens and closes animate as usual.
 *
 * @returns A cleanup that stops waiting (for an effect that unmounts first).
 * @remarks Client only. Gives up after ~2 s, so a chat that never mounts can't leave the placeholder up.
 */
export function endChatRestore(): () => void {
  const root = document.documentElement
  if (!root.hasAttribute(RESTORING_ATTR)) return () => {}
  let frame = 0
  const started = performance.now()
  const check = () => {
    // one more frame after the panel appears, so it is painted before the placeholder goes
    if (document.querySelector('.wa-chat__panel') || performance.now() - started > 2000) {
      frame = requestAnimationFrame(() => root.removeAttribute(RESTORING_ATTR))
    } else {
      frame = requestAnimationFrame(check)
    }
  }
  frame = requestAnimationFrame(check)
  return () => cancelAnimationFrame(frame)
}
