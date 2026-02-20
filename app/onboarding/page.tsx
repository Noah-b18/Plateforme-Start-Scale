'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Chatbot } from '../../components/ui/chatbot';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = sessionStorage.getItem('currentUser');
    const userRole = sessionStorage.getItem('userRole');

    if (currentUser && userRole === 'member') {
      router.push('/dashboard');
      return;
    }

    if (currentUser && userRole === 'mentor') {
      router.push('/mentor-zone');
      return;
    }
  }, [router]);

  const nextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    }
  };

  const prevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simuler un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier si l'utilisateur existe déjà (simulation)
      const existingUsers = JSON.parse(sessionStorage.getItem('users') || '{}');
      if (existingUsers[formData.email]) {
        alert('Un compte avec cet email existe déjà. Connecte-toi ou utilise un autre email.');
        setIsSubmitting(false);
        return;
      }

      // Créer l'utilisateur via StartScaleApp
      const StartScaleApp = (window as any).StartScaleApp;
      if (!StartScaleApp) {
        alert('Erreur: Application non chargée. Veuillez rafraîchir la page.');
        setIsSubmitting(false);
        return;
      }

      StartScaleApp.createUser(formData.name, formData.email);

      // Passer à l'étape finale
      setCurrentStep(3);
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completeOnboarding = () => {
    router.push('/dashboard');
  };

  const getStepTitle = (step: number) => {
    const titles = {
      1: { title: 'Bienvenue dans l\'aventure', desc: 'Commence ton parcours entrepreneurial' },
      2: { title: 'Crée ton compte', desc: 'Rejoins la communauté Start & Scale' },
      3: { title: 'Prêt à démarrer', desc: 'Commence avec 1500 S-Points offerts' }
    };
    return titles[step as keyof typeof titles];
  };

  const stepInfo = getStepTitle(currentStep);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <i className="fas fa-rocket text-white text-xl"></i>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Start & Scale</h1>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">BETA</span>
            </div>
            <div className="text-sm text-gray-600">
              Étape {currentStep} sur 3
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                currentStep >= 1 ? 'bg-gradient-to-r from-blue-600 to-blue-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 1 ? <i className="fas fa-check text-sm"></i> : 1}
              </div>
              <div className={`w-16 h-1 rounded transition-all ${
                currentStep >= 2 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                currentStep >= 2 ? (currentStep > 2 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-blue-600 to-blue-700') : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 2 ? <i className="fas fa-check text-sm"></i> : 2}
              </div>
              <div className={`w-16 h-1 rounded transition-all ${
                currentStep >= 3 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-200'
              }`}></div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold transition-all ${
                currentStep >= 3 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gray-200 text-gray-600'
              }`}>
                {currentStep > 3 ? <i className="fas fa-check text-sm"></i> : 3}
              </div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">{stepInfo.title}</h2>
            <p className="text-sm text-gray-600">{stepInfo.desc}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <div className="form-slide slide-center">
            <div className="flex flex-col items-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <i className="fas fa-rocket text-white text-2xl"></i>
              </div>

              <h1 className="text-4xl font-black text-gray-900 mb-4">
                Bienvenue sur <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Start & Scale</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                La plateforme qui transforme les idées des jeunes en startups à succès.
                Rejoins notre communauté et commence ton aventure entrepreneuriale.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg card-hover">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-graduation-cap text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Apprends</h3>
                  <p className="text-sm text-gray-600">Modules conçus pour les jeunes entrepreneurs</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg card-hover">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-trophy text-green-600 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Progresse</h3>
                  <p className="text-sm text-gray-600">Gagne des points et débloque des badges</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg card-hover">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-users text-purple-600 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connecte</h3>
                  <p className="text-sm text-gray-600">Rejoins une communauté de créateurs</p>
                </div>
              </div>

              <button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Commencer l'inscription
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Registration Form */}
        {currentStep === 2 && (
          <div className="form-slide slide-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-user text-white text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Crée ton compte</h2>
                <p className="text-gray-600">Rejoins la communauté Start & Scale</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-user mr-2"></i>Prénom
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Quel est ton prénom ?"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-envelope mr-2"></i>Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="ton.email@exemple.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-lock mr-2"></i>Mot de passe
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Au moins 6 caractères"
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <i className="fas fa-info-circle text-blue-600 mt-1"></i>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Version Bêta</h4>
                      <p className="text-sm text-blue-700">
                        Tes données sont stockées localement sur ton appareil.
                        La version complète inclura une sauvegarde cloud.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Retour
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Inscription...
                      </>
                    ) : (
                      <>
                        Continuer
                        <i className="fas fa-arrow-right ml-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Welcome Gift */}
        {currentStep === 3 && (
          <div className="form-slide slide-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-gift text-white text-4xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Bienvenue dans la communauté !</h2>
              <p className="text-xl text-gray-600 mb-8">
                Pour fêter ton inscription, voici <span className="font-bold text-yellow-600">1500 S-Points</span> offerts !
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-8 border border-blue-200">
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">1500</div>
                    <div className="text-sm text-gray-600">S-Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">3</div>
                    <div className="text-sm text-gray-600">Modules gratuits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600">∞</div>
                    <div className="text-sm text-gray-600">Possibilités</div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-4">Ce que tu peux faire avec tes S-Points :</h3>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-gray-700">Accéder à tous les modules</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-gray-700">Réserver des calls mentors</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-gray-700">Participer aux concours</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-green-600"></i>
                    <span className="text-gray-700">Débloquer des badges exclusifs</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={completeOnboarding}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105"
                >
                  <i className="fas fa-rocket mr-2"></i>
                  Démarrer l'aventure
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  <i className="fas fa-info-circle mr-1"></i>
                  Tes S-Points et ta progression seront conservés pour la version finale
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © 2024 Start & Scale - Version Bêta. Construit pour les jeunes entrepreneurs.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}