/**
 * The first tab stop: jumps past the header to the page's main content.
 * A plain <a> on purpose: a native fragment jump moves the keyboard focus starting point to #main. next/link
 * intercepts the click and only scrolls, so the next Tab would land back in the header.
 */
export function SkipLink({ href = '#main' }: { href?: string }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4 focus:z-60 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
    >
      Skip to content
    </a>
  )
}
