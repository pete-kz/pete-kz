import React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
}

const InputIcon = React.forwardRef<HTMLInputElement, InputProps>(({ className, type,  icon, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex items-center text-sm pl-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border border-input bg-background rounded-md',
          className,
        )}
      >
         {icon}
        <input
          {...props}
          type={type}
          ref={ref}
          className="flex h-10 w-full rounded-md bg-background pr-3 py-2 text-sm ring-offset-background  placeholder:text-muted-foreground focus-visible:outline-none "
        />
      </div>
    )
  },
)

InputIcon.displayName = 'InputIcon'

export { InputIcon }