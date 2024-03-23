/* eslint-disable react/prop-types */
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const Overlay = DialogPrimitive.Root

const OverlayTrigger = DialogPrimitive.Trigger

const OverlayPortal = DialogPrimitive.Portal

const OverlayClose = DialogPrimitive.Close

const OverlayOverlay = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Overlay>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>>(({ className, ...props }, ref) => (
	<DialogPrimitive.Overlay ref={ref} className={cn("fixed inset-0 z-50 bg-black/30  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)} {...props} />
))
OverlayOverlay.displayName = DialogPrimitive.Overlay.displayName

const OverlayContent = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Content>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>>(({ className, children, ...props }, ref) => (
	<OverlayPortal>
		<OverlayOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={cn(
				"fixed left-[50%] top-[50%] z-50 grid h-screen w-screen translate-x-[-50%] translate-y-[-50%] gap-4 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:max-w-lg sm:rounded-lg",
				className,
			)}
			{...props}>
			{children}
		</DialogPrimitive.Content>
	</OverlayPortal>
))
OverlayContent.displayName = DialogPrimitive.Content.displayName

const OverlayHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
OverlayHeader.displayName = "DialogHeader"

const OverlayFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
OverlayFooter.displayName = "DialogFooter"

const OverlayTitle = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Title>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>>(({ className, ...props }, ref) => (
	<DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
))
OverlayTitle.displayName = DialogPrimitive.Title.displayName

const OverlayDescription = React.forwardRef<React.ElementRef<typeof DialogPrimitive.Description>, React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>>(({ className, ...props }, ref) => (
	<DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
))
OverlayDescription.displayName = DialogPrimitive.Description.displayName

export { Overlay, OverlayPortal, OverlayOverlay, OverlayClose, OverlayTrigger, OverlayContent, OverlayHeader, OverlayFooter, OverlayTitle, OverlayDescription }
