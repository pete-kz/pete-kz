import React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	icon: React.ReactNode
}

const InputIcon = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, icon, ...props }, ref) => {
	return (
		<div className={cn("flex items-center rounded-md border border-input bg-background pl-3 text-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className)}>
			{icon}
			<input {...props} type={type} ref={ref} className="flex h-10 w-full rounded-md bg-background py-2 pr-3 text-sm ring-offset-background  placeholder:text-muted-foreground focus-visible:outline-none " />
		</div>
	)
})

InputIcon.displayName = "InputIcon"

export { InputIcon }
