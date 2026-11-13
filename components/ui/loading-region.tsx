import type { ReactNode } from 'react'

/** A loading placeholder that announces itself once to screen readers; the skeleton shapes inside stay hidden. */
export function LoadingRegion({ label, className, children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <div role="status" aria-busy className={className}>
      <span className="sr-only">{label}</span>
      <div aria-hidden className="contents">
        {children}
      </div>
    </div>
  )
}
