"use client"

import * as React from "react"
import { Root, Indicator } from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: React.ComponentProps<typeof Root>) {
    return (
        <Root
            data-slot="checkbox"
            className={cn(
                "peer size-4 shrink-0 rounded-[4px] border border-white/20 shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white transition-all",
                className
            )}
            {...props}
        >
            <Indicator
                data-slot="checkbox-indicator"
                className="flex items-center justify-center text-current"
            >
                <Check className="size-3.5" />
            </Indicator>
        </Root>
    )
}

export { Checkbox }
