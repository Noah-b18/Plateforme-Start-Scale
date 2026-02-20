import * as React from "react"
import { Card, CardContent } from "../ui/card"
import { Button } from "../ui/button"
import { cn } from "../../lib/utils"
import Icon from "../Icon"

interface MissionCardProps {
  title: string
  description: string
  icon?: string
  reward?: string
  actionLabel: string
  onAction: () => void
  completed?: boolean
  className?: string
}

const MissionCard: React.FC<MissionCardProps> = ({
  title,
  description,
  icon = "gift",
  reward,
  actionLabel,
  onAction,
  completed = false,
  className
}) => {
  return (
    <Card className={cn("p-4 bg-gray-50 border border-gray-100", className)}>
      <CardContent className="p-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name={icon as any} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{title}</h4>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <Button
            onClick={onAction}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors"
            disabled={completed}
          >
            {completed ? "Terminé" : actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export { MissionCard }