// lib/core/index.ts
// Export centralisé du core

export { StartScaleApp } from './app';
export { modules, type Module, type QuizQuestion } from './modules';
export { badges, calculateLevel, calculateXpForNextLevel, type Badge } from './gamification';
export { createUser, type User } from './users';