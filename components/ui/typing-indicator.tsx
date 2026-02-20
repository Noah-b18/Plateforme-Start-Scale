import * as React from 'react'
import { cn } from '@/lib/utils'

interface TypingIndicatorProps {
  className?: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'flex items-center space-x-1 px-4 py-2 rounded-lg bg-muted text-muted-foreground rounded-bl-none',
        className
      )}
      aria-label="Le chatbot est en train de taper"
    >
      <div className="flex space-x-1">
        <div
          className="w-2 h-2 bg-current rounded-full animate-bounce"
          style={{ animationDelay: '0ms' }}
        />
        <div
          className="w-2 h-2 bg-current rounded-full animate-bounce"
          style={{ animationDelay: '150ms' }}
        />
        <div
          className="w-2 h-2 bg-current rounded-full animate-bounce"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  )
}