import { FooterNav } from '@/components/layout/footer-nav'
import { GithubIcon } from '@/components/shared/github-icon'
import { Separator } from '@/components/ui/separator'
import { ACCOUNT_LINKS, REPO_URL, SHOP_LINKS } from '@/lib/navigation'

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto grid max-w-330 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="sm:col-span-2 md:col-span-1">
          <p className="text-lg font-semibold tracking-tight">Northline</p>
          <p className="mt-2 max-w-xs text-pretty text-sm text-muted-foreground">
            Everyday clothing and carry, made to last. Free shipping over $150.
          </p>
        </div>
        <FooterNav
          id="footer-shop"
          title="Shop"
          links={SHOP_LINKS}
        />
        <FooterNav
          id="footer-account"
          title="Account"
          links={ACCOUNT_LINKS}
        />
      </div>
      <Separator />
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-5 text-caption text-muted-foreground">
        <p>Demo store with static data. Photos from Unsplash.</p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 rounded-sm transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <GithubIcon className="size-4" />
          Source on GitHub
        </a>
      </div>
    </footer>
  )
}
