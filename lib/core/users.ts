// lib/core/users.ts
// Gestion des utilisateurs (extrait de main.js)

export interface User {
  name: string;
  email: string;
  sPoints: number;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  completedModules: string[];
  reservations: any[];
  lastActivity: string;
  joinDate: string;
}

// Fonctions utilitaires pour la gestion des utilisateurs
export function createUser(name: string, email: string): User {
  return {
    name,
    email,
    sPoints: 1500,
    xp: 0,
    level: 1,
    badges: [],
    streak: 0,
    completedModules: [],
    reservations: [],
    lastActivity: new Date().toISOString(),
    joinDate: new Date().toISOString()
  };
}

// Note: Les fonctions load/save sont à adapter pour Next.js (pas de localStorage côté serveur)
// Elles seront utilisées côté client uniquement