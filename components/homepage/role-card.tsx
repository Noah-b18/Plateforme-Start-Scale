import * as React from "react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import Icon from "../Icon"

interface RoleCardProps {
  title: string
  description: string
  icon?: string
  features: string[]
  buttonText: string
  onClick: () => void
  variant?: "member" | "mentor"
  className?: string
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon = "rocket",
  features,
  buttonText,
  onClick,
  variant = "member",
  className
}) => {
  const gradientClass = variant === "member"
    ? "from-blue-500 to-cyan-600"
    : "from-purple-500 to-indigo-600"

  const hoverBorderClass = variant === "member"
    ? "hover:border-blue-500"
    : "hover:border-purple-500"

  const checkColorClass = variant === "member"
    ? "text-blue-600"
    : "text-purple-600"

  return (
    <Card
      className={cn(
        "role-card bg-white rounded-2xl p-10 shadow-lg border-2 border-transparent h-full flex flex-col focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        hoverBorderClass,
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Sélectionner le rôle ${title}`}
    >
      <CardHeader className="pb-6">
        <div className="mb-6">
          <div className={`w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-xl flex items-center justify-center mb-6`}>
            <Icon name={icon as any} className="text-white text-3xl" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col justify-between flex-grow">
        <ul className="space-y-3 mb-8 text-gray-700">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center space-x-3">
              <Icon name="check" className={cn("font-bold", checkColorClass)} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={cn(
            "w-full font-semibold py-3 rounded-lg transition-all",
            variant === "member"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          )}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  )
}

export { RoleCard }