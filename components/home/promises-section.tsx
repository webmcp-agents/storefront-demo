import { PROMISES } from '@/components/home/constants'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'

export function PromisesSection() {
  return (
    <section
      aria-label="Our promises"
      className="grid gap-4 py-6 sm:grid-cols-3"
    >
      {PROMISES.map(({ icon: Icon, title, body }) => (
        <Item
          key={title}
          className="flex-nowrap items-start gap-3"
        >
          <ItemMedia>
            <Icon className="mt-0.5 size-5 text-muted-foreground" />
          </ItemMedia>
          <ItemContent className="gap-0">
            <ItemTitle asChild>
              <h3>{title}</h3>
            </ItemTitle>
            <ItemDescription className="line-clamp-none text-pretty">
              {body}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </section>
  )
}
