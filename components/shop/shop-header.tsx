export function ShopHeader({
  heading,
  intro,
}: {
  heading: string
  intro: string
}) {
  return (
    <header className="mb-8 flex flex-col gap-1.5">
      <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
        {heading}
      </h1>
      <p className="max-w-prose text-pretty text-sm text-muted-foreground">
        {intro}
      </p>
    </header>
  )
}
