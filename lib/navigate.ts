/** The App Router's `push`, once {@link setNavigate} has run. */
let push: ((to: string) => void) | undefined

/**
 * Called once by <Providers> (useRouterNavigate) with the App Router's `push`.
 *
 * @param navigate - The router's `push`.
 */
export function setNavigate(navigate: (to: string) => void) {
  push = navigate
}

/**
 * Open a page the way a visitor would: click the site's own link when it is on screen (the agent cursor has something
 * to point at), else the App Router's push; a full page load only before <Providers> has handed it over.
 *
 * Resolves once the address is `href` (Next.js changes it when the route's payload arrives, a moment after the
 * click), or false after `timeout` ms: a tool that answers only then lets the new page's tools register before the
 * agent's next step. A full page load resolves false at once (this document is going away).
 *
 * @param href - Path and query to open, e.g. `/shop?category=bags`. Arrival is checked on pathname and search only.
 * @param timeout - How long to wait for the address to change, in ms.
 * @returns True once the address matches `href`; false on timeout or a full page load.
 * @remarks Client only: uses `document` and `window`.
 */
export function navigate(href: string, timeout = 3000): Promise<boolean> {
  const link = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]')).find(
    (a) => a.getAttribute('href') === href && a.getClientRects().length > 0,
  )
  if (link) link.click()
  else if (push) push(href)
  else {
    window.location.assign(href)
    return Promise.resolve(false)
  }
  const target = new URL(href, window.location.href)
  const until = Date.now() + timeout
  return new Promise((resolve) => {
    const check = () => {
      if (window.location.pathname === target.pathname && window.location.search === target.search) resolve(true)
      else if (Date.now() >= until) resolve(false)
      else setTimeout(check, 25)
    }
    check()
  })
}
