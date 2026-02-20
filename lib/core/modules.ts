// lib/core/modules.ts
// Données des modules de formation (extrait de main.js)

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  xpReward: number;
  sPointsReward: number;
  requiredXP: number;
  content: string;
  quiz: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
}

export const modules: Record<string, Module> = {
  'module-1': {
    id: 'module-1',
    title: 'Idée de départ',
    description: 'Trouver et valider ton idée de startup',
    duration: '30 min',
    difficulty: 'Débutant',
    xpReward: 150,
    sPointsReward: 200,
    requiredXP: 0,
    content: 'Contenu du module sur la validation d\'idée...',
    quiz: [
      {
        question: 'Quelle est la première étape pour valider une idée ?',
        options: ['Créer un produit', 'Parler aux clients potentiels', 'Chercher des investisseurs', 'Développer un site web'],
        correct: 1
      },
      {
        question: 'Que faut-il tester en premier ?',
        options: ['Le design', 'Le prix', 'Le problème', 'La technologie'],
        correct: 2
      },
      {
        question: 'Combien de personnes faut-il interviewer minimum ?',
        options: ['5', '10', '20', '50'],
        correct: 1
      }
    ]
  },
  'module-2': {
    id: 'module-2',
    title: 'Business Model Canvas',
    description: 'Construire ton modèle économique',
    duration: '45 min',
    difficulty: 'Intermédiaire',
    xpReward: 250,
    sPointsReward: 350,
    requiredXP: 100,
    content: 'Contenu du module sur le Business Model Canvas...',
    quiz: [
      {
        question: 'Combien de blocs compose le Business Model Canvas ?',
        options: ['7', '8', '9', '10'],
        correct: 2
      },
      {
        question: 'Quel bloc représente les clients ?',
        options: ['Segments de clients', 'Relations clients', 'Canaux', 'Proposition de valeur'],
        correct: 0
      },
      {
        question: 'Le BMC permet de :',
        options: ['Présenter son équipe', 'Visualiser son business model', 'Calculer ses finances', 'Trouver des partenaires'],
        correct: 1
      }
    ]
  },
  'module-3': {
    id: 'module-3',
    title: 'Prototype rapide',
    description: 'Créer un MVP en 7 jours',
    duration: '60 min',
    difficulty: 'Avancé',
    xpReward: 400,
    sPointsReward: 500,
    requiredXP: 500,
    content: 'Contenu du module sur la création de prototype...',
    quiz: [
      {
        question: 'Qu\'est-ce qu\'un MVP ?',
        options: ['Meilleur produit possible', 'Produit minimum viable', 'Version finale', 'Prototype avancé'],
        correct: 1
      },
      {
        question: 'Le but d\'un MVP est de :',
        options: ['Gagner de l\'argent', 'Tester rapidement une hypothèse', 'Impressionner les investisseurs', 'Conquérir le marché'],
        correct: 1
      },
      {
        question: 'Quel outil pour créer un prototype ?',
        options: ['Figma', 'Photoshop', 'Word', 'Excel'],
        correct: 0
      }
    ]
  }
};