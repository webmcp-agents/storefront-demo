import { Card } from '@/components/ui/card'
import { Item } from '@/components/ui/item'
import { Sparkles } from 'lucide-react'

export function AssistantSection({ prompts }: { prompts: string[] }) {
  return (
    <section
      aria-labelledby="assistant"
      className="py-12"
    >
      <Card className="grid gap-8 rounded-[28px] bg-transparent p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-brand">
            <Sparkles className="size-4" /> Shop with the assistant
          </p>
          <h2
            id="assistant"
            className="mt-3 text-balance text-3xl font-semibold tracking-tight"
          >
            Ask for what you want. Watch it happen on the page.
          </h2>
          <p className="mt-3 max-w-md text-pretty text-muted-foreground">
            The assistant filters the catalog, opens products and reads your
            order history with real tools. A cursor shows every step, and it
            stops for your click before anything is bought.
          </p>
        </div>
        {/* Example prompts: quotes, not controls, so no border or shadow that would read as a button. */}
        <ul
          aria-label="Things to ask"
          className="grid gap-2.5"
        >
          {prompts.map((p) => (
            <Item
              key={p}
              asChild
              variant="muted"
              className="rounded-2xl px-4 py-3.5 text-body"
            >
              <li>“{p}”</li>
            </Item>
          ))}
        </ul>
      </Card>
    </section>
  )
}
