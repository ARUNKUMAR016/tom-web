import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-brand-gold text-brand-ink shadow-lg shadow-brand-gold/20 hover:bg-brand-gold/90 hover:shadow-xl hover:shadow-brand-gold/30 hover:-translate-y-0.5",
        destructive:
          "bg-brand-temple text-white shadow-sm hover:bg-brand-temple/90",
        outline:
          "border border-brand-muted/30 bg-transparent shadow-sm hover:bg-brand-muted/10 hover:text-brand-ink",
        secondary:
          "bg-brand-muted text-white shadow-sm hover:bg-brand-muted/90",
        ghost:
          "hover:bg-brand-accent/20 hover:text-brand-ink",
        link: "text-brand-gold underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : motion.button
  
  // Add motion props only if it's not a Slot (Slot doesn't accept motion props directly usually, but here we assume standard button usage mostly)
  // Actually, to be safe with Slot, we'll wrap or just use standard button if asChild is true, 
  // but for the "pressable" effect on standard buttons we use motion.button.
  
  if (asChild) {
    return (
      <Slot
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }

  return (
    <motion.button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      whileTap={{ scale: 0.97 }}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
