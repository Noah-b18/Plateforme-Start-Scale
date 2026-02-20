import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../../lib/utils"
import Icon from "../Icon"

interface StatCardProps {
  title: string
  value: string | number
  icon?: string
  description?: string
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  description,
  className
}) => {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        {icon && (
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name={icon as any} className="text-blue-600" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}

export { StatCard }