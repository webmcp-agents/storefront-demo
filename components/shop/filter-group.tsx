import type { ReactNode } from 'react'

/** One titled group of the filter panel. */
export function FilterGroup({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section
      aria-label={title}
      className="py-5 first:pt-0 last:pb-0"
    >
      <h3 className="mb-3 text-caption font-medium">{title}</h3>
      {children}
    </section>
  )
}
