import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"
import Icon from "../Icon"

interface ModuleCardProps {
  id: string
  title: string
  description: string
  duration: string
  difficulty: string
  xpReward: number
  isCompleted?: boolean
  isLocked?: boolean
  requiredXP?: number
  onClick?: () => void
  className?: string
}

const ModuleCard: React.FC<ModuleCardProps> = ({
  title,
  description,
  duration,
  difficulty,
  xpReward,
  isCompleted = false,
  isLocked = false,
  requiredXP,
  onClick,
  className
}) => {
  const getStatusColor = () => {
    if (isCompleted) return "border-green-200 bg-green-50"
    if (isLocked) return "border-gray-100 bg-gray-50"
    return "border-blue-100 bg-white"
  }

  const getStatusIcon = () => {
    if (isCompleted) return "check"
    if (isLocked) return "lock"
    return "play"
  }

  const getStatusIconColor = () => {
    if (isCompleted) return "bg-green-500"
    if (isLocked) return "bg-gray-400"
    return "bg-blue-500"
  }

  return (
    <Card
      className={cn(
        "p-4 border-2 cursor-pointer transition-all hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        getStatusColor(),
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Accéder au module ${title}`}
    >
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
              getStatusIconColor()
            )}>
              <Icon name={getStatusIcon() as any} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-gray-900 truncate">{title}</h4>
              <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
              <div className="flex items-center space-x-3 mt-2">
                <span className="text-xs text-gray-500 flex items-center">
                  <Icon name="clock" className="mr-1" />
                  {duration}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  <Icon name="signal" className="mr-1" />
                  {difficulty}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  +{xpReward} XP
                </span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            {isLocked ? (
              <Badge variant="outline" className="text-gray-400">
                Débloque à {requiredXP} XP
              </Badge>
            ) : isCompleted ? (
              <Badge variant="success">Terminé</Badge>
            ) : (
              <Badge variant="info">Disponible</Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { ModuleCard }