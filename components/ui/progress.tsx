import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "default" | "success" | "warning" | "error"
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, showValue = false, size = "md", variant = "default", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    const sizeClasses = {
      sm: "h-2",
      md: "h-3",
      lg: "h-4"
    }

    const variantClasses = {
      default: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600"
    }

    return (
      <div
        ref={ref}
        className={cn("w-full bg-gray-200 rounded-full overflow-hidden", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-in-out",
            sizeClasses[size],
            variantClasses[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
        {showValue && (
          <div className="text-center mt-1 text-sm text-gray-600">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }