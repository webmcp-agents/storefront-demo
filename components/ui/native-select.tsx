import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { fieldClasses } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/*
 * shadcn/ui NativeSelect: a real <select>, so phones get their own picker and it works inside any layer (a Radix
 * Select's popover would open under a sheet that sits above the agent UI). Full width, like the store's inputs.
 */
function NativeSelect({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<"select">, "size"> & { size?: "sm" | "default" }) {
  return (
    <div
      className="group/native-select relative w-full has-[select:disabled]:opacity-50"
      data-slot="native-select-wrapper"
    >
      <select
        data-slot="native-select"
        data-size={size}
        className={cn(fieldClasses, "appearance-none pe-9 data-[size=sm]:h-8", className)}
        {...props}
      />
      <ChevronDownIcon
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground select-none"
        aria-hidden="true"
        data-slot="native-select-icon"
      />
    </div>
  )
}

function NativeSelectOption({ className, ...props }: React.ComponentProps<"option">) {
  return <option data-slot="native-select-option" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
}

function NativeSelectOptGroup({ className, ...props }: React.ComponentProps<"optgroup">) {
  return (
    <optgroup data-slot="native-select-optgroup" className={cn("bg-[Canvas] text-[CanvasText]", className)} {...props} />
  )
}

export { NativeSelect, NativeSelectOptGroup, NativeSelectOption }
