/**
 * Resolves with the first element matching `selector` once it is on the page and laid out (a dialog that just opened
 * renders on React's next commit), or null after `timeout` ms.
 *
 * @typeParam E - The element type expected.
 * @param selector - CSS selector to wait for.
 * @param timeout - How long to wait, in ms.
 * @returns The element, or null when none is laid out in time.
 * @remarks Client only: watches `document.body` with a MutationObserver.
 */
export function whenElement<E extends Element = HTMLElement>(selector: string, timeout = 2000): Promise<E | null> {
  const find = () => {
    const el = document.querySelector<E>(selector)
    return el && el.getClientRects().length > 0 ? el : null
  }
  const now = find()
  if (now) return Promise.resolve(now)
  return new Promise((resolve) => {
    const done = (el: E | null) => {
      observer.disconnect()
      clearTimeout(timer)
      resolve(el)
    }
    const observer = new MutationObserver(() => {
      const el = find()
      if (el) done(el)
    })
    observer.observe(document.body, { childList: true, subtree: true, attributes: true })
    const timer = setTimeout(() => done(find()), timeout)
  })
}
