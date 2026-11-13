/** The "Details" list: materials and care, then stock. */
export function ProductSpecs({
  details,
  stockLabel,
}: {
  details: string[]
  stockLabel: string
}) {
  return (
    <section
      aria-labelledby="details"
      className="-mt-2"
    >
      <h2
        id="details"
        className="mb-3 text-sm font-medium"
      >
        Details
      </h2>
      <ul className="list-disc space-y-1.5 ps-5 text-sm leading-relaxed text-muted-foreground marker:text-border-strong">
        {details.map((d) => (
          <li key={d}>{d}</li>
        ))}
        <li className="tnum">{stockLabel}</li>
      </ul>
    </section>
  )
}
