import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { cn } from "../../lib/utils"
import { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon?: LucideIcon
  title: string
  description: string
  variant?: 'blue' | 'purple' | 'green'
  className?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: IconComponent,
  title,
  description,
  variant = 'blue',
  className
}) => {
  const bgClass = {
    blue: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    purple: 'bg-gradient-to-br from-purple-50 to-indigo-50',
    green: 'bg-gradient-to-br from-green-50 to-emerald-50'
  }[variant]

  const iconBgClass = {
    blue: 'bg-blue-300',
    purple: 'bg-purple-300',
    green: 'bg-green-300'
  }[variant]

  return (
    <Card className={cn(`${bgClass} rounded-2xl p-10 shadow-lg border-2 border-transparent h-full`, className)}>
      <CardHeader className="pb-6">
        {IconComponent && (
          <div className={`w-16 h-16 ${iconBgClass} rounded-xl flex items-center justify-center mb-6`}>
            <IconComponent className="text-white text-3xl" aria-hidden="true" />
          </div>
        )}
        <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}

export { FeatureCard }