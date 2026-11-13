import { GithubIcon } from '@/components/shared/github-icon'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { REPO_URL } from '@/lib/navigation'

/** The header's link to this demo's source on GitHub. Hidden on phones, where the header is full; the footer has it. */
export function GithubLink() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="max-sm:hidden"
        >
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Source code on GitHub"
          >
            <GithubIcon className="size-4.5" />
          </a>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Source code on GitHub</TooltipContent>
    </Tooltip>
  )
}
