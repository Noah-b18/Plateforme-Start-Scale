'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { StartScaleApp, modules, Module } from '../../lib/core';
import { Chatbot } from '../../components/ui/chatbot';
import Header from '../../components/Header';


export default function Modules() {
  const [user, setUser] = useState<any>(null);
  const [app] = useState(() => new StartScaleApp());
  const [currentFilter, setCurrentFilter] = useState<string>('all');
  const [currentSort, setCurrentSort] = useState<string>('difficulty');
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification
    const currentUserRaw = sessionStorage.getItem('currentUser');
    if (!currentUserRaw) {
      router.push('/');
      return;
    }

    const currentUser = JSON.parse(currentUserRaw);
    setUser(currentUser);

    // Charger les données utilisateur dans l'app
    app.loadUsers();
  }, [app, router]);

  const filteredAndSortedModules = useMemo(() => {
    if (!user) return [];

    let filteredModules = Object.values(modules) as Module[];

    // Apply filter
    if (currentFilter !== 'all') {
      filteredModules = filteredModules.filter(module =>
        module.difficulty.toLowerCase() === currentFilter
      );
    }

    // Apply sort
    filteredModules.sort((a, b) => {
      switch (currentSort) {
        case 'duration':
          return parseInt(a.duration) - parseInt(b.duration);
        case 'reward':
          return b.sPointsReward - a.sPointsReward;
        case 'difficulty':
        default:
          const difficultyOrder = { 'Débutant': 1, 'Intermédiaire': 2, 'Avancé': 3 };
          return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
    });

    return filteredModules;
  }, [user, currentFilter, currentSort]);

  const getModuleStatus = (module: Module) => {
    if (!user) return { isCompleted: false, isLocked: true };

    const completedModules = Array.isArray(user.completedModules) ? user.completedModules : [];
    const userXP = typeof user.xp === 'number' ? user.xp : 0;

    const isCompleted = completedModules.includes(module.id);
    const isLocked = userXP < (module.requiredXP || 0);

    return { isCompleted, isLocked };
  };

  const getProgressPercent = () => {
    if (!user) return 0;

    const totalModules = Object.keys(modules).length;
    const completedModules = user.completedModules?.length || 0;
    return Math.round((completedModules / totalModules) * 100);
  };

  const handleModuleClick = (module: Module) => {
    const { isLocked } = getModuleStatus(module);
    if (!isLocked) {
      router.push(`/module?id=${module.id}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement des modules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user='membre' />


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Modules de Formation</h1>
              <p className="text-gray-600">Développe tes compétences entrepreneuriales étape par étape</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <i className="fas fa-trophy text-blue-600"></i>
              <span className="text-sm font-medium text-blue-600">Progression : {getProgressPercent()}%</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <i className="fas fa-filter text-gray-600"></i>
              <span className="font-medium text-gray-900">Filtrer par :</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCurrentFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFilter === 'all'
                    ? 'filter-active'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setCurrentFilter('debutant')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFilter === 'debutant'
                    ? 'filter-active'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Débutant
              </button>
              <button
                onClick={() => setCurrentFilter('intermediaire')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFilter === 'intermediaire'
                    ? 'filter-active'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Intermédiaire
              </button>
              <button
                onClick={() => setCurrentFilter('avance')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentFilter === 'avance'
                    ? 'filter-active'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Avancé
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-sm text-gray-600">Triés par :</span>
              <select
                value={currentSort}
                onChange={(e) => setCurrentSort(e.target.value)}
                className="bg-gray-100 border-0 rounded-lg px-3 py-2 text-sm font-medium"
              >
                <option value="difficulty">Difficulté</option>
                <option value="duration">Durée</option>
                <option value="reward">Récompense</option>
              </select>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        {filteredAndSortedModules.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-search text-gray-400 text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun module trouvé</h3>
            <p className="text-gray-600">Essaye de modifier tes filtres de recherche</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedModules.map((module) => {
              const { isCompleted, isLocked } = getModuleStatus(module);
              return (
                <div
                  key={module.id}
                  onClick={() => handleModuleClick(module)}
                  className={`bg-white rounded-2xl p-6 shadow-lg card-hover ${
                    isLocked ? 'module-locked' : ''
                  } ${isCompleted ? 'module-completed' : ''} ${
                    !isLocked ? 'cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isCompleted ? 'bg-green-500' :
                      isLocked ? 'bg-gray-400' : 'bg-blue-500'
                    }`}>
                      <i className={`fas text-white text-xl ${
                        isCompleted ? 'fa-check' :
                        isLocked ? 'fa-lock' : 'fa-play'
                      }`}></i>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <span className={`difficulty-badge px-2 py-1 rounded-full font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                      <span className="text-xs text-gray-500">{module.duration}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{module.description}</p>

                  {isLocked && (
                    <div className="bg-gray-100 p-3 rounded-lg mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <i className="fas fa-lock"></i>
                        <span>Débloque à {module.requiredXP} XP</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-star text-yellow-500 text-sm"></i>
                        <span className="text-sm font-medium text-gray-700">+{module.xpReward} XP</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="fas fa-coins text-blue-500 text-sm"></i>
                        <span className="text-sm font-medium text-gray-700">+{module.sPointsReward}</span>
                      </div>
                    </div>

                    <span className={`text-sm font-medium ${
                      isCompleted ? 'text-green-600' :
                      isLocked ? 'text-gray-500' : 'text-blue-600'
                    }`}>
                      {isCompleted ? 'Terminé' :
                       isLocked ? 'Verrouillé' : 'Commencer'}
                    </span>
                  </div>

                  {isCompleted && (
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center space-x-2 text-green-600">
                        <i className="fas fa-trophy"></i>
                        <span className="text-sm font-medium">Module terminé avec succès !</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Chatbot */}
      <Chatbot />

    </div>
  );
}