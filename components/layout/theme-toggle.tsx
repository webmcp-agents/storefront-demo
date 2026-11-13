'use client'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useThemeToggle } from '@/hooks/use-theme-toggle'
import { Moon, Sun } from 'lucide-react'

/**
 * A switch: its name stays "Dark theme" and aria-checked carries the state. The agent's set_theme tool finds it by a
 * name matching /theme/ and role switch.
 */
export function ThemeToggle() {
  const theme = useThemeToggle()
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          role="switch"
          aria-label="Dark theme"
          aria-checked={theme.isDark}
          onClick={theme.toggle}
        >
          {theme.isDark ? <Sun /> : <Moon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {theme.isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </TooltipContent>
    </Tooltip>
  )
}
