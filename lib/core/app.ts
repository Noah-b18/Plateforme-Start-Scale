// lib/core/app.ts
// Logique principale de l'application (refactorisée de main.js, sans DOM)

import { modules } from './modules';
import { badges, calculateLevel } from './gamification';
import { User, createUser } from './users';

export class StartScaleApp {
  currentUser: User | null = null;
  users: Record<string, User> = {};

  constructor() {
    // Initialisation sans DOM
  }

  // User management (adapté pour Next.js)
  loadUsers(): void {
    // Note: localStorage n'est pas disponible côté serveur
    // Cette méthode doit être appelée côté client uniquement
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('startscale_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }

    // Logique de chargement de l'utilisateur courant
    const sessionCurrentUserRaw = sessionStorage.getItem('currentUser');
    if (sessionCurrentUserRaw) {
      try {
        const sessionUser = JSON.parse(sessionCurrentUserRaw);
        if (sessionUser && sessionUser.email) {
          this.users[sessionUser.email] = this.users[sessionUser.email] || sessionUser;
          this.currentUser = this.users[sessionUser.email];
        }
      } catch (e) {
        console.warn('Invalid session currentUser', e);
      }
    } else {
      const currentUserEmail = localStorage.getItem('startscale_current_user');
      if (currentUserEmail && this.users[currentUserEmail]) {
        this.currentUser = this.users[currentUserEmail];
      }
    }
  }

  saveUsers(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('startscale_users', JSON.stringify(this.users));
    if (this.currentUser) {
      localStorage.setItem('startscale_current_user', this.currentUser.email);
    }
  }

  createUser(name: string, email: string): User {
    const newUser = createUser(name, email);
    this.users[email] = newUser;
    this.currentUser = newUser;
    this.saveUsers();
    return newUser;
  }

  // Gamification system
  addXP(amount: number): void {
    if (!this.currentUser) return;

    this.currentUser.xp += amount;
    const newLevel = calculateLevel(this.currentUser.xp);

    if (newLevel > this.currentUser.level) {
      this.currentUser.level = newLevel;
      this.currentUser.sPoints += 500; // Level up reward
      // Note: showLevelUpModal sera géré côté UI
    }

    this.saveUsers();
  }

  addSPoints(amount: number, reason = ''): void {
    if (!this.currentUser) return;

    this.currentUser.sPoints += amount;
    this.saveUsers();
    // Note: showPointsNotification sera géré côté UI
  }

  completeModule(moduleId: string): boolean {
    if (!this.currentUser || this.currentUser.completedModules.includes(moduleId)) return false;

    const module = modules[moduleId];
    if (!module) return false;

    if (this.currentUser.xp < module.requiredXP) {
      // Note: showModal sera géré côté UI
      return false;
    }

    this.currentUser.completedModules.push(moduleId);
    this.addXP(module.xpReward);
    this.addSPoints(module.sPointsReward, `Module ${module.title} terminé`);

    this.checkBadges();
    this.saveUsers();

    return true;
  }

  checkBadges(): void {
    if (!this.currentUser) return;

    if (this.currentUser.completedModules.length >= 1 && !this.currentUser.badges.includes('curieux')) {
      this.currentUser.badges.push('curieux');
      // Note: showBadgeModal sera géré côté UI
    }

    if (this.currentUser.completedModules.length >= 3 && !this.currentUser.badges.includes('validateur')) {
      this.currentUser.badges.push('validateur');
      // Note: showBadgeModal sera géré côté UI
    }
  }
}