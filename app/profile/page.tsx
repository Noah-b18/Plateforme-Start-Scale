'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { Chatbot } from '@/components/ui/chatbot';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

interface Activity {
  type: 'module' | 'call' | 'level';
  title: string;
  description: string;
  icon: string;
  color: string;
  date: Date;
}

interface PointsHistory {
  type: string;
  amount: number;
  description: string;
  date: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [pointsHistory, setPointsHistory] = useState<PointsHistory[]>([]);

  // Mock badges data
  const allBadges: Badge[] = [
    {
      id: 'first-module',
      name: 'Premier pas',
      description: 'Termine ton premier module',
      icon: 'rocket',
      unlocked: false
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Réussis 5 quiz parfaits',
      icon: 'brain',
      unlocked: false
    },
    {
      id: 'mentor-call',
      name: 'Premier call',
      description: 'Réserve ton premier call mentor',
      icon: 'video',
      unlocked: false
    },
    {
      id: 'level-5',
      name: 'Ascension',
      description: 'Atteins le niveau 5',
      icon: 'trophy',
      unlocked: false
    }
  ];

  useEffect(() => {
    // Vérifier l'authentification
    const currentUserRaw = sessionStorage.getItem('currentUser');
    if (!currentUserRaw) {
      router.push('/');
      return;
    }

    const currentUser = JSON.parse(currentUserRaw);
    setUser(currentUser);

    // Charger les données du profil
    loadProfileData(currentUser);
  }, [router]);

  const loadProfileData = (currentUser: any) => {
    // Simuler le chargement des badges
    const userBadges = currentUser.badges || [];
    const badgesWithStatus = allBadges.map(badge => ({
      ...badge,
      unlocked: userBadges.includes(badge.id)
    }));
    setBadges(badgesWithStatus);

    // Générer l'activité récente simulée
    const activities: Activity[] = [];

    // Modules terminés
    const completedModules = currentUser.completedModules || [];
    completedModules.forEach((moduleId: string, index: number) => {
      activities.push({
        type: 'module',
        title: `Module terminé : Module ${moduleId}`,
        description: `+200 XP, +300 S-Points`,
        icon: 'fa-graduation-cap',
        color: 'text-green-600',
        date: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000)
      });
    });

    // Calls réservés
    const reservations = currentUser.reservations || [];
    reservations.forEach((reservation: any, index: number) => {
      activities.push({
        type: 'call',
        title: `Call réservé avec ${reservation.mentor?.name || 'Mentor'}`,
        description: reservation.display || 'Call simulé',
        icon: 'fa-video',
        color: 'text-blue-600',
        date: new Date(reservation.createdAt || Date.now())
      });
    });

    // Level up
    if (currentUser.level > 1) {
      activities.push({
        type: 'level',
        title: `Niveau ${currentUser.level} atteint !`,
        description: '+500 S-Points de récompense',
        icon: 'fa-trophy',
        color: 'text-yellow-600',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      });
    }

    activities.sort((a, b) => b.date.getTime() - a.date.getTime());
    setRecentActivity(activities.slice(0, 5));

    // Historique S-Points
    const history: PointsHistory[] = [
      {
        type: 'inscription',
        amount: 1500,
        description: 'Inscription + cadeau de bienvenue',
        date: new Date(currentUser.joinDate || Date.now())
      },
      {
        type: 'module',
        amount: 200,
        description: 'Module "Idée de départ" terminé',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'quiz',
        amount: 300,
        description: 'Quiz parfait - bonus',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        type: 'daily',
        amount: 100,
        description: 'Récompense quotidienne',
        date: new Date(Date.now() - 12 * 60 * 60 * 1000)
      }
    ];
    setPointsHistory(history);
  };

  const openSettings = () => {
    setShowSettings(true);
  };

  const hideSettings = () => {
    setShowSettings(false);
  };

  const logout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      sessionStorage.removeItem('currentUser');
      sessionStorage.removeItem('userRole');
      router.push('/');
    }
  };

  const clearAllData = () => {
    if (confirm('⚠️ Attention : Cette action supprimera définitivement toutes tes données de test. Es-tu sûr ?')) {
      if (confirm('Cette action est irréversible. Continuer ?')) {
        sessionStorage.clear();
        router.push('/');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const totalModules = 12; // Simulé
  const completedModules = user.completedModules?.length || 0;
  const progressPercent = Math.round((completedModules / totalModules) * 100);
  const unlockedBadges = badges.filter(badge => badge.unlocked).length;

  return (
    <div className="bg-gray-50 min-h-screen">
        <Header />


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Icon name="user" className="text-white text-3xl" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Icon name="trophy" className="text-blue-600 text-sm" />
                  <span className="text-sm font-medium text-blue-600">Niveau {user.level || 1}</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <Icon name="fire" className="text-green-600 text-sm" />
                  <span className="text-sm font-medium text-green-600">{user.streak || 0} jours</span>
                </div>
                <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1 rounded-full">
                  <Icon name="calendar" className="text-purple-600 text-sm" />
                  <span className="text-sm font-medium text-purple-600">
                    Rejoint {new Date(user.joinDate || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button onClick={openSettings} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
                <Icon name="cog" className="mr-2" />
                Paramètres
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progression globale</span>
              <span className="text-sm text-gray-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="coins" className="text-blue-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user.points || 1500}</div>
            <div className="text-sm text-gray-600">S-Points</div>
          </div>

          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="trophy" className="text-green-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{completedModules}</div>
            <div className="text-sm text-gray-600">Modules terminés</div>
          </div>

          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="medal" className="text-purple-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{unlockedBadges}</div>
            <div className="text-sm text-gray-600">Badges obtenus</div>
          </div>

          <div className="stat-card bg-white rounded-2xl p-6 shadow-lg text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name="calendar" className="text-orange-600 text-xl" />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{user.reservations?.length || 0}</div>
            <div className="text-sm text-gray-600">Calls réservés</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes Badges</h2>
                <span className="text-sm text-gray-600">{unlockedBadges}/{badges.length} badges</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {badges.map(badge => (
                  <div
                    key={badge.id}
                    className={`achievement-card text-center p-4 rounded-lg transition-all hover:scale-105 ${
                      badge.unlocked
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200'
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`w-16 h-16 ${badge.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-300'} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon name={badge.icon as any} className="text-white text-xl" />
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600">{badge.description}</p>
                    <div className="mt-2">
                      {badge.unlocked ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Obtenu</span>
                      ) : (
                        <span className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">Verrouillé</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité récente</h2>
              <div className="h-64 flex items-end justify-between space-x-2">
                {/* Simple bar chart simulation */}
                {[65, 45, 80, 35, 90, 55, 75].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-700"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2">
                      {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'][index]}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">Activité en XP (derniers 7 jours)</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Historique récent</h2>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="clock" className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune activité récente</h3>
                    <p className="text-gray-600">Commence par compléter un module !</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <i className={`fas ${activity.icon} ${activity.color}`}></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <span className="text-xs text-gray-500">{activity.date.toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/modules')}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="graduation-cap" className="text-blue-600" />
                    <span className="font-medium text-gray-900">Continuer mes modules</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/calls')}
                  className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="video" className="text-green-600" />
                    <span className="font-medium text-gray-900">Réserver un call</span>
                  </div>
                </button>

                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon name="chart-line" className="text-purple-600" />
                    <span className="font-medium text-gray-900">Voir mon dashboard</span>
                  </div>
                </button>
              </div>
            </div>

            {/* S-Points History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique S-Points</h3>
              <div className="space-y-3">
                {pointsHistory.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{item.description}</div>
                      <div className="text-xs text-gray-600">{item.date.toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">+{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Beta Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="flask" className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Mode Bêta</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Tu testes la version bêta de Start & Scale. Tes données sont sauvegardées localement.
                  </p>
                  <button onClick={clearAllData} className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors">
                    <Icon name="trash" className="mr-1" />
                    Effacer mes données
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Paramètres</h3>
              <button onClick={hideSettings} className="text-gray-600 hover:text-gray-900 transition-colors">
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Compte</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Email</span>
                    <span className="font-medium text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Membre depuis</span>
                    <span className="font-medium text-gray-900">
                      {new Date(user.joinDate || Date.now()).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Préférences</h4>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                    <span className="text-gray-700">Notifications par email</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
                    <span className="text-gray-700">Rappels quotidiens</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" disabled />
                    <span className="text-gray-700">Mode sombre (bientôt)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button onClick={logout} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold transition-colors">
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}