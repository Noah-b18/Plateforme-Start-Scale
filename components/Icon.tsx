import { FC } from 'react';
import {
  Rocket, Coins, User, Trophy, Flame, Gift, Play, Users,
  MessageCircle, TestTube, Check, Lock, Signal, Award, BarChart3,
  PlayCircle, Calendar, ArrowLeft, Edit, Settings,
  Download, Trash2, X, Moon, Bell, CalendarCheck, Globe,
  Clock, Brain, Video, GraduationCap
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

type IconName =
  | 'rocket' | 'coins' | 'user' | 'trophy' | 'fire' | 'gift' | 'play' | 'users'
  | 'comments' | 'flask' | 'check' | 'lock' | 'signal' | 'medal' | 'chart-line'
  | 'play-circle' | 'calendar-alt' | 'user-circle' | 'arrow-left' | 'edit' | 'cog'
  | 'download' | 'trash' | 'times' | 'moon' | 'bell' | 'calendar-check' | 'globe'
  | 'clock' | 'brain' | 'video' | 'graduation-cap' | 'calendar';

interface IconProps {
  name: IconName;
  className?: string;
}

const iconMap: Record<IconName, LucideIcon> = {
  'rocket': Rocket,
  'coins': Coins,
  'user': User,
  'trophy': Trophy,
  'fire': Flame,
  'gift': Gift,
  'play': Play,
  'users': Users,
  'comments': MessageCircle,
  'flask': TestTube,
  'check': Check,
  'lock': Lock,
  'signal': Signal,
  'medal': Award,
  'chart-line': BarChart3,
  'play-circle': PlayCircle,
  'calendar-alt': Calendar,
  'user-circle': User,
  'arrow-left': ArrowLeft,
  'edit': Edit,
  'cog': Settings,
  'download': Download,
  'trash': Trash2,
  'times': X,
  'moon': Moon,
  'bell': Bell,
  'calendar-check': CalendarCheck,
  'globe': Globe,
  'clock': Clock,
  'brain': Brain,
  'video': Video,
  'graduation-cap': GraduationCap,
  'calendar': Calendar,
};

/**
 * Composant Icon réutilisable
 * Utilise maintenant Lucide React au lieu de FontAwesome
 *
 * Utilisation:
 * <Icon name="rocket" className="text-4xl text-blue-600" />
 */
export const Icon: FC<IconProps> = ({ name, className = '' }) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default Icon;