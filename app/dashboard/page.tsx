'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StartScaleApp, modules } from '../../lib/core';
import { User } from '../../lib/core/users';
import Header from '../../components/Header';
import Icon from '../../components/Icon';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [app] = useState(() => new StartScaleApp());
  const router = useRouter();

  useEffect(() => {
    // Vérifier l'authentification
    const currentUserRaw = sessionStorage.getItem('currentUser');
    const userRole = sessionStorage.getItem('userRole');

    if (!currentUserRaw || userRole !== 'member') {
      router.push('/');
      return;
    }

    const currentUser = JSON.parse(currentUserRaw);
    setUser(currentUser);

    // Charger les données utilisateur dans l'app
    app.loadUsers();
  }, [app, router]);

  const claimDailyReward = () => {
    if (!user) return;

    const today = new Date().toDateString();
    const lastClaim = localStorage.getItem('lastDailyClaim');

    if (lastClaim === today) {
      alert('Récompense déjà réclamée. Reviens demain !');
      return;
    }

    app.addSPoints(100, 'Récompense quotidienne');
    const updatedUser = { ...user, streak: user.streak + 1, sPoints: user.sPoints + 100 };
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    localStorage.setItem('lastDailyClaim', today);

    alert('Récompense réclamée ! Tu as gagné 100 S-Points.');
  };

  const shareProgress = () => {
    const level = user?.level || 1;
    const points = user?.sPoints || 0;

    if (navigator.share) {
      navigator.share({
        title: 'Start & Scale - Ma progression',
        text: `Je suis niveau ${level} avec ${points} S-Points sur Start & Scale ! 🚀`,
        url: window.location.origin
      });
    } else {
      const text = `Je suis niveau ${level} avec ${points} S-Points sur Start & Scale ! 🚀`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Le message a été copié dans ton presse-papier.');
      });
    }
  };

  const getModuleStatus = (moduleId: string) => {
    if (!user) return { isCompleted: false, isLocked: true };

    const isCompleted = user.completedModules?.includes(moduleId) || false;
    const module = modules[moduleId];
    const isLocked = user.xp < (module?.requiredXP || 0);

    return { isCompleted, isLocked };
  };

  const getLeaderboardData = () => {
    const mockData = [
      { name: 'Alexandre', level: 5, xp: 4500, sPoints: 3200 },
      { name: 'Sarah', level: 4, xp: 3800, sPoints: 2800 },
      { name: 'Thomas', level: 4, xp: 3200, sPoints: 2500 },
      { name: 'Emma', level: 3, xp: 2800, sPoints: 2100 },
      { name: 'Noah', level: 3, xp: 2500, sPoints: 1900 },
      { name: 'Léa', level: 3, xp: 2200, sPoints: 1700 },
      { name: 'Maël', level: 2, xp: 1800, sPoints: 1400 },
      { name: 'Chloé', level: 2, xp: 1500, sPoints: 1200 },
      { name: 'Gabriel', level: 2, xp: 1200, sPoints: 1000 },
    ];

    if (user) {
      mockData.push({
        name: user.name,
        level: user.level,
        xp: user.xp,
        sPoints: user.sPoints
      });
    }

    return mockData.sort((a, b) => b.xp - a.xp).slice(0, 10);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculs de progression
  const currentLevelXP = (user.level - 1) * 1000;
  const xpForNextLevel = user.level * 1000;
  const xpProgress = user.xp - currentLevelXP;
  const xpNeeded = xpForNextLevel - currentLevelXP;
  const progressPercent = Math.min(Math.max((xpProgress / xpNeeded) * 100, 0), 100);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user='membre' />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Bonjour {user.name} !</h1>
                <p className="text-blue-100 text-lg">Prêt à transformer tes idées en succès ?</p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Icon name="user" className="size-12 text-black" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Level & XP */}
          <div className="bg-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Niveau {user.level}</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Icon name="trophy" className="text-white text-xl" />
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>XP</span>
                <span>{xpProgress} / {xpNeeded}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Prochain niveau dans {xpNeeded - xpProgress} XP</p>
          </div>

          {/* S-Points */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">S-Points</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <Icon name="coins" className="text-white text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{user.sPoints}</div>
            <p className="text-sm text-gray-600">Points disponibles</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {user.badges && user.badges.length > 0 ? (
                user.badges.map((badgeId) => (
                  <div key={badgeId} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-yellow-200">
                    <Icon name="medal" />
                    <span>{badgeId}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500 italic">Aucun badge pour le moment</div>
              )}
            </div>
          </div>

          {/* Streak */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Streak</h3>
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Icon name="fire" className="text-white text-xl" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-500 mb-2">{user.streak}</div>
            <p className="text-sm text-gray-600">Jours consécutifs</p>
            <button
              onClick={claimDailyReward}
              className="mt-4 w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <Icon name="gift" className="mr-2" />
              Récompense quotidienne
            </button>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Modules Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes Modules</h2>
                <button onClick={() => router.push('/modules')} className="text-blue-600 hover:text-blue-700 font-medium">
                  Voir tout
                </button>
              </div>

              <div className="space-y-4">
                {Object.values(modules).map((module) => {
                  const { isCompleted, isLocked } = getModuleStatus(module.id);
                  return (
                    <div
                      key={module.id}
                      onClick={() => !isLocked && router.push(`/module?id=${module.id}`)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                        isCompleted ? 'border-green-200 bg-green-50' :
                        isLocked ? 'border-gray-100 bg-gray-50 opacity-75' : 'border-blue-100 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCompleted ? 'bg-green-500' :
                            isLocked ? 'bg-gray-400' : 'bg-blue-500'
                          }`}>
                            <i className={`fas text-white ${
                              isCompleted ? 'fa-check' :
                              isLocked ? 'fa-lock' : 'fa-play'
                            }`}></i>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-1">{module.description}</p>
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500"><i className="far fa-clock mr-1"></i>{module.duration}</span>
                              <span className="text-xs text-gray-500"><i className="fas fa-signal mr-1"></i>{module.difficulty}</span>
                              <span className={`text-xs font-bold ${
                                isCompleted ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                +{module.xpReward} XP
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          {isLocked ? (
                            <span className="text-xs font-medium text-gray-400 bg-gray-200 px-2 py-1 rounded">Débloque à {module.requiredXP} XP</span>
                          ) : isCompleted ? (
                            <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Terminé</span>
                          ) : (
                            <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">Disponible</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Daily Missions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Missions Quotidiennes</h2>
                <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full font-bold">+200 S-Points</span>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon name="play" className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Regarder 1 module</h4>
                      <p className="text-sm text-gray-600">Complète n'importe quel module</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/modules')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Commencer
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <Icon name="trophy" className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Quiz parfait</h4>
                      <p className="text-sm text-gray-600">Obtenir 100% à un quiz</p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push('/modules')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Essayer
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Icon name="users" className="text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Partager progression</h4>
                      <p className="text-sm text-gray-600">Partager ton niveau</p>
                    </div>
                  </div>
                  <button
                    onClick={shareProgress}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Partager
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Chart Placeholder */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Statistiques de progression</h2>
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-200">
                <div className="text-center">
                  <i className="fas fa-chart-line text-4xl text-gray-300 mb-2"></i>
                  <p className="text-gray-500 font-medium">Graphique d'activité bientôt disponible</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Top Testeurs</h2>
                <Icon name="trophy" className="text-yellow-500 text-xl" />
              </div>

              <div className="space-y-3">
                {getLeaderboardData().map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                      item.name === user.name ? 'bg-blue-50 border-2 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0 ? 'bg-yellow-400 text-white' : 
                        index === 1 ? 'bg-gray-300 text-white' : 
                        index === 2 ? 'bg-orange-400 text-white' : 'text-gray-500 bg-gray-100'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className={`font-bold text-sm ${item.name === user.name ? 'text-blue-700' : 'text-gray-900'}`}>
                          {item.name}
                        </div>
                        <div className="text-xs text-gray-500">Niv. {item.level} • {item.xp} XP</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-600 text-sm">{item.sPoints}</div>
                      <div className="text-[10px] uppercase font-bold text-gray-400">Points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h2>

              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules')}
                  className="w-full flex items-center space-x-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <i className="fas fa-play-circle text-lg"></i>
                  </div>
                  <span className="font-semibold text-gray-800">Continuer un module</span>
                </button>

                <button
                  onClick={() => router.push('/calls')}
                  className="w-full flex items-center space-x-4 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <i className="fas fa-calendar-alt text-lg"></i>
                  </div>
                  <span className="font-semibold text-gray-800">Réserver un call</span>
                </button>

                <button
                  onClick={() => router.push('/profile')}
                  className="w-full flex items-center space-x-4 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <i className="fas fa-user-circle text-lg"></i>
                  </div>
                  <span className="font-semibold text-gray-800">Mon profil</span>
                </button>
              </div>
            </div>

            {/* Beta Info */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-flask text-xl"></i>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Mode Bêta</h3>
                  <p className="text-sm text-purple-100 mb-4 leading-relaxed">
                    Tu testes la version bêta. Tes S-Points et ta progression seront conservés pour la version finale !
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white bg-opacity-20 text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold border border-white border-opacity-30">
                      Accès Gratuit
                    </span>
                    <span className="bg-green-400 text-green-900 text-[10px] uppercase tracking-wider px-2 py-1 rounded-md font-bold">
                      Data Sauvegardée
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-2xl flex items-center justify-center cursor-pointer transition-all transform hover:scale-110 active:scale-95 group">
          <Icon name="comments" className="text-white text-xl" />
          <span className="absolute right-full mr-4 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Besoin d'aide ?
          </span>
        </button>
      </div>
    </div>
  );
}