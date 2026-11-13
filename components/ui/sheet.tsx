"use client"

import * as React from "react"
import { XIcon } from "lucide-react"
import { Dialog as SheetPrimitive } from "radix-ui"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/*
 * shadcn/ui Sheet. Motion comes from globals.css ([data-overlay] / [data-sheet=<side>] by data-state), which slides
 * only under no-preference and fades under reduced motion.
 */

/**
 * Above the agent's UI: its cursor (--agent-z), the chat launcher and panel (just under it) and the dev-only devtools
 * launcher (--agent-z + 100), all fixed in a corner, where they would cover a sheet's footer. The highest z-index as
 * a plain integer: browsers round calc() this large, so "--agent-z + 200" could tie with the devtools' "+ 100".
 */
const ABOVE_AGENT_UI = "z-[2147483647]"

type SheetLayer = "page" | "top"

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  layer = "page",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay> & { layer?: SheetLayer }) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      data-overlay
      className={cn(
        "fixed inset-0 bg-black/40 backdrop-blur-[2px]",
        layer === "top" ? ABOVE_AGENT_UI : "z-50",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  layer = "page",
  showCloseButton = true,
  closeLabel = "Close",
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: "top" | "right" | "bottom" | "left"
  /**
   * "page" (default): under the agent's cursor and chat, for sheets the agent works in (filters). "top": above them,
   * for sheets only the person uses (AI settings), so the chat or devtools launcher never covers its controls.
   */
  layer?: SheetLayer
  showCloseButton?: boolean
  /** The close button's accessible name, e.g. "Close filters". */
  closeLabel?: string
}) {
  return (
    <SheetPortal>
      <SheetOverlay layer={layer} />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        data-sheet={side}
        className={cn(
          "fixed flex flex-col overscroll-contain bg-card text-card-foreground shadow-pop outline-none",
          layer === "top" ? ABOVE_AGENT_UI : "z-50",
          side === "right" && "inset-y-0 end-0 h-full w-full max-w-md border-s border-border",
          side === "left" && "inset-y-0 start-0 h-full w-full max-w-md border-e border-border",
          side === "top" && "inset-x-0 top-0 h-auto max-h-[88dvh] rounded-b-3xl border-b border-border",
          side === "bottom" &&
            "inset-x-0 bottom-0 h-auto max-h-[88dvh] rounded-t-3xl border-t border-border pb-[env(safe-area-inset-bottom)]",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close asChild>
            <Button variant="ghost" size="icon-sm" className="absolute end-4 top-3.5" aria-label={closeLabel}>
              <XIcon />
            </Button>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-0.5 border-b border-border px-5 py-4 pe-14", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex items-center gap-2 border-t border-border px-5 py-4", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-base font-semibold tracking-tight text-foreground", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-caption text-muted-foreground", className)}
      {...props}
    />
  )
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription }
