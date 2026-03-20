"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
<AccordionPrimitive.Trigger
  ref={ref}
  className={cn(
    "group flex flex-1 items-center justify-between py-4 text-left font-medium transition-all hover:no-underline",
    className
  )}
  {...props}
>
  {children}

  <div className="relative ml-4 flex h-8 w-8 items-center justify-center">
    {/* PLUS */}
    <span className="absolute text-3xl font-light text-[#1E1E1E] transition-opacity duration-200 group-data-[state=open]:opacity-0">
      <ChevronDown />
    </span>

    {/* MINUS */}
    <span className="absolute text-3xl font-light text-[#1E1E1E] opacity-0 transition-opacity duration-200 group-data-[state=open]:opacity-100">
      <ChevronUp />
    </span>
  </div>
</AccordionPrimitive.Trigger>

  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
