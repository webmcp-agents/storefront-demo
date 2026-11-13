import { KeyRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

/** The header's key button; a green dot shows once a provider is connected. */
export function AiSettingsTrigger({ configured, activeLabel }: { configured: boolean; activeLabel?: string }) {
  return (
    <Tooltip>
      <SheetTrigger asChild>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label={activeLabel ? `AI settings, using ${activeLabel}` : 'AI settings'}
          >
            <KeyRound />
            {configured && (
              <Badge variant="success" aria-hidden className="absolute end-2 top-2 size-2 bg-success p-0 ring-2 ring-background" />
            )}
          </Button>
        </TooltipTrigger>
      </SheetTrigger>
      <TooltipContent>{activeLabel ? `AI settings: ${activeLabel}` : 'AI settings'}</TooltipContent>
    </Tooltip>
  )
}
