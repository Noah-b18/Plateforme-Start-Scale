'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StartScaleApp } from '@/lib/core/app';
import Header from '@/components/Header';
import Icon from '@/components/Icon';
import { Chatbot } from '@/components/ui/chatbot';

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [language, setLanguage] = useState('fr');

  useEffect(() => {
    // Load user data
    const app = new StartScaleApp();
    const currentUser = app.currentUser;
    if (!currentUser) {
      router.push('/onboarding');
      return;
    }
    setUser(currentUser);

    // Load preferences from localStorage
    setNotifications(localStorage.getItem('notifications') !== 'false');
    setReminders(localStorage.getItem('reminders') !== 'false');
    setLanguage(localStorage.getItem('language') || 'fr');
  }, [router]);



  const toggleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications.toString());
  };

  const toggleReminders = () => {
    const newReminders = !reminders;
    setReminders(newReminders);
    localStorage.setItem('reminders', newReminders.toString());
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  const editProfile = () => {
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email);
      setIsProfileModalOpen(true);
    }
  };

  const saveProfile = () => {
    if (user && editName.trim()) {
      user.name = editName.trim();
      const app = new StartScaleApp();
      app.saveUsers();
      setUser({ ...user });
      setIsProfileModalOpen(false);
      alert('Profil mis à jour avec succès !');
    }
  };

  const exportData = () => {
    if (!user) return;

    const userData = {
      user,
      exportDate: new Date().toISOString(),
      version: 'beta'
    };

    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startscale-data-${user.name}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('⚠️ Attention : Cette action supprimera définitivement toutes tes données de test. Es-tu sûr ?')) {
      if (confirm('Cette action est irréversible. Continuer ?')) {
        localStorage.clear();
        router.push('/');
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="settings-card bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profil</h2>
            <button
              onClick={editProfile}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
            >
              <Icon name="edit" className="mr-2" />
              Modifier
            </button>
          </div>

          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <Icon name="user" className="text-white text-3xl" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                  <Icon name="trophy" className="text-blue-600 dark:text-blue-400 text-sm" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Niveau {user.level}</span>
                </div>
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                  <Icon name="fire" className="text-green-600 dark:text-green-400 text-sm" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{user.streak} jours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Statistiques</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Modules terminés</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.completedModules?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">S-Points</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.sPoints}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Badges</span>
                  <span className="font-medium text-gray-900 dark:text-white">{user.badges?.length || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Informations</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Membre depuis</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {user.joinDate ? new Date(user.joinDate).toLocaleDateString('fr-FR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Dernière connexion</span>
                  <span className="font-medium text-gray-900 dark:text-white">Aujourd'hui</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Statut</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Actif</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="settings-card bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Préférences</h2>

          <div className="space-y-6">


            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="bell" className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reçois des alertes pour les missions quotidiennes</p>
                </div>
              </div>
              <button
                onClick={toggleNotifications}
                className={`toggle-switch w-12 h-6 rounded-full relative transition-colors ${
                  notifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`toggle-circle w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Daily Reminders */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="calendar-check" className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Rappels quotidiens</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ne manque jamais ta récompense quotidienne</p>
                </div>
              </div>
              <button
                onClick={toggleReminders}
                className={`toggle-switch w-12 h-6 rounded-full relative transition-colors ${
                  reminders ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`toggle-circle w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                  reminders ? 'translate-x-6' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>

            {/* Language Selection */}
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                  <Icon name="globe" className="text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Langue</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Choisis ta langue préférée</p>
                </div>
              </div>
              <select
                value={language}
                onChange={handleLanguageChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="settings-card bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8 transition-all duration-300 hover:shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Sécurité</h2>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Mot de passe</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Modifie ton mot de passe</p>
                </div>
                <button

                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Modifier
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Authentification à deux facteurs</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajoute une couche de sécurité supplémentaire</p>
                </div>
                <button

                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Activer
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Historique des connexions</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Consulte les connexions récentes à ton compte</p>
                </div>
                <button

                  className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Voir
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Beta Section */}
        <div className="settings-card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="flask" className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Mode Bêta</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Tu utilises actuellement la version bêta de Start & Scale. Tes données sont stockées localement
                sur ton appareil. La version complète inclura une sauvegarde cloud et plus de fonctionnalités.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Données locales</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Progression sauvegardée</p>
                    <p>• S-Points conservés</p>
                    <p>• Historique préservé</p>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Version complète</h4>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    <p>• Sauvegarde cloud</p>
                    <p>• Multi-appareils</p>
                    <p>• Plus de fonctionnalités</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={exportData}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Icon name="download" className="mr-2" />
                  Exporter mes données
                </button>
                <button
                  onClick={clearAllData}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  <Icon name="trash" className="mr-2" />
                  Effacer mes données
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />

      {/* Profile Edit Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Modifier le profil</h3>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <Icon name="times" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Nom</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">L'email ne peut pas être modifié en mode bêta</p>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 py-3 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={saveProfile}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}