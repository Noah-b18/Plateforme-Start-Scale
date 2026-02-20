// lib/core/gamification.ts
// Système de gamification (extrait de main.js)

export interface Badge {
  name: string;
  description: string;
  icon: string;
}

export const badges: Record<string, Badge> = {
  'curieux': { name: 'Curieux', description: '1er module terminé', icon: 'fas fa-lightbulb' },
  'perseverant': { name: 'Persévérant', description: 'Streak de 7 jours', icon: 'fas fa-fire' },
  'pitcher': { name: 'Pitcher', description: 'Inscription à un concours', icon: 'fas fa-microphone' },
  'validateur': { name: 'Validateur', description: '3 modules terminés', icon: 'fas fa-check-circle' }
};

// Fonctions de calcul
export function calculateLevel(xp: number): number {
  return Math.floor(xp / 1000) + 1;
}

export function calculateXpForNextLevel(level: number): number {
  return level * 1000;
}