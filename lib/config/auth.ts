// lib/config/auth.ts
// Configuration d'authentification (extrait de config.js)

export const authConfig = {
  // localStorage keys
  storageKeys: {
    currentUser: 'currentUser',
    userRole: 'userRole',
    authToken: 'authToken', // Pour future implémentation JWT
  },

  // Rôles disponibles
  roles: {
    MENTOR: 'mentor',
    MEMBER: 'member',
  },

  // Session timeout (ms)
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 heures
};