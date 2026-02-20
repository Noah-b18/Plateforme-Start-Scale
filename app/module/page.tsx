'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { StartScaleApp, modules, Module } from '../../lib/core';
import { Chatbot } from '../../components/ui/chatbot';
import Header from '../../components/Header';

function ModulePageContent() {
  const [user, setUser] = useState<any>(null);
  const [app] = useState(() => new StartScaleApp());
  const [currentModule, setCurrentModule] = useState<Module | null>(null);
  const [moduleContent, setModuleContent] = useState<string>('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState(0);
  const [quizBonus, setQuizBonus] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('id');

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

    // Charger le module
    loadModule();
  }, [app, router, moduleId]);

  const loadModule = () => {
    if (!moduleId) {
      router.push('/modules');
      return;
    }

    const module = modules[moduleId];
    if (!module) {
      router.push('/modules');
      return;
    }

    // Vérifier si le module est verrouillé
    if (user && user.xp < module.requiredXP) {
      alert(`Tu as besoin de ${module.requiredXP} XP pour accéder à ce module.`);
      setTimeout(() => {
        router.push('/modules');
      }, 2000);
      return;
    }

    setCurrentModule(module);

    // Simuler le chargement du contenu
    setTimeout(() => {
      const content = `
        <div class="mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <i class="fas fa-play text-white text-xl"></i>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">${module.title}</h2>
              <p class="text-gray-600">${module.description}</p>
            </div>
          </div>
        </div>

        <div class="prose max-w-none">
          <h3>Introduction</h3>
          <p>Bienvenue dans ce module sur ${module.title.toLowerCase()}. Dans ce module, tu vas apprendre les concepts fondamentaux pour réussir dans cette étape de ton parcours entrepreneurial.</p>

          <h3>Objectifs d'apprentissage</h3>
          <ul>
            <li>Comprendre les principes de base de ${module.title.toLowerCase()}</li>
            <li>Appliquer les concepts dans des situations réelles</li>
            <li>Développer des compétences pratiques mesurables</li>
            <li>Préparer le terrain pour les modules suivants</li>
          </ul>

          <h3>Contenu du module</h3>
          <p>Ce module contient des vidéos, des exercices pratiques et des études de cas pour t'aider à maîtriser les concepts clés. Tu peux avancer à ton rythme et revenir sur les sections précédentes si nécessaire.</p>

          <div class="bg-blue-50 p-6 rounded-lg my-6">
            <h4 class="font-semibold text-blue-900 mb-2">
              <i class="fas fa-lightbulb mr-2"></i>
              Astuce de pro
            </h4>
            <p class="text-blue-800">Prends des notes pendant que tu progresses dans le module. Cela t'aidera à retenir les informations importantes et à réussir le quiz à la fin.</p>
          </div>

          <h3>Exercices pratiques</h3>
          <p>À la fin de ce module, tu auras l'opportunité de mettre en pratique ce que tu as appris à travers des exercices concrets et un quiz de validation.</p>
        </div>
      `;
      setModuleContent(content);
      setProgress(100);
    }, 1000);
  };

  const completeModule = () => {
    if (!currentModule || !user) return;

    const success = app.completeModule(currentModule.id);
    if (!success) return;

    // Mettre à jour l'utilisateur local
    const updatedUser = { ...user, completedModules: [...user.completedModules, currentModule.id] };
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Montrer le quiz
    setShowQuiz(true);
  };

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = optionIndex;
    setQuizAnswers(newAnswers);
  };

  const submitQuiz = () => {
    if (!currentModule || quizAnswers.length < currentModule.quiz.length) {
      alert('Veuillez répondre à toutes les questions avant de valider.');
      return;
    }

    // Calculer le score
    let correct = 0;
    currentModule.quiz.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        correct++;
      }
    });

    setQuizScore(correct);
    const perfectScore = correct === currentModule.quiz.length;
    const bonus = perfectScore ? 300 : 0;
    setQuizBonus(bonus);

    if (bonus > 0) {
      app.addSPoints(bonus, 'Quiz parfait !');
      const updatedUser = { ...user, sPoints: user.sPoints + bonus };
      setUser(updatedUser);
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }

    // Montrer la completion
    setShowQuiz(false);
    setShowCompletion(true);
  };

  const skipQuiz = () => {
    if (!currentModule) return;
    setQuizScore(0);
    setQuizBonus(0);
    setShowQuiz(false);
    setShowCompletion(true);
  };

  const nextModule = () => {
    if (!currentModule) return;

    const moduleIds = Object.keys(modules);
    const currentIndex = moduleIds.indexOf(currentModule.id);

    if (currentIndex < moduleIds.length - 1) {
      const nextModuleId = moduleIds[currentIndex + 1];
      const nextModule = modules[nextModuleId];

      if (user && user.xp >= nextModule.requiredXP) {
        router.push(`/module?id=${nextModuleId}`);
      } else {
        alert(`Tu as besoin de ${nextModule.requiredXP} XP pour accéder au module suivant.`);
        setTimeout(() => {
          router.push('/modules');
        }, 2000);
      }
    } else {
      alert('Félicitations ! Tu as terminé tous les modules disponibles ! Reviens bientôt pour de nouveaux contenus.');
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  const getProgressPercent = () => {
    if (!user) return 0;
    const totalModules = Object.keys(modules).length;
    const completedModules = user.completedModules?.length || 0;
    return Math.round((completedModules / totalModules) * 100);
  };

  if (!user || !currentModule) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du module...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user='membre' />


      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{currentModule.title}</h2>
            <span className="text-sm text-gray-600">{progress}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Content Area */}
          <div className="lg:col-span-2">
            {/* Module Content */}
            <div className="bg-white rounded-2xl p-8 shadow-lg content-section">
              {moduleContent ? (
                <div dangerouslySetInnerHTML={{ __html: moduleContent }} />
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-play text-blue-600 text-2xl"></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Chargement du module...</h3>
                  <p className="text-gray-600">Préparation de ton contenu personnalisé</p>
                </div>
              )}

              {moduleContent && !showQuiz && !showCompletion && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={completeModule}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold text-lg transition-colors"
                  >
                    <i className="fas fa-check-circle mr-2"></i>
                    J'ai terminé le module
                  </button>
                </div>
              )}
            </div>

            {/* Quiz Section */}
            {showQuiz && (
              <div className="mt-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Quiz de validation</h3>
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                      <i className="fas fa-trophy text-blue-600"></i>
                      <span className="text-sm font-medium text-blue-600">+300 S-Points bonus</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {currentModule.quiz.map((question, index) => (
                      <div key={index} className="p-6 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Question {index + 1} sur {currentModule.quiz.length}
                        </h4>
                        <p className="text-gray-700 mb-4">{question.question}</p>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              onClick={() => selectAnswer(index, optionIndex)}
                              className={`quiz-option p-3 border border-gray-200 rounded-lg cursor-pointer ${
                                quizAnswers[index] === optionIndex ? 'selected' : ''
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <div className={`w-4 h-4 border-2 border-gray-300 rounded-full ${
                                  quizAnswers[index] === optionIndex ? 'bg-blue-500 border-blue-500' : ''
                                }`}></div>
                                <span>{option}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={submitQuiz}
                      disabled={quizAnswers.length < currentModule.quiz.length}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i className="fas fa-check-circle mr-2"></i>
                      Valider mes réponses
                    </button>
                    <button
                      onClick={skipQuiz}
                      className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                    >
                      Passer le quiz
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Section */}
            {showCompletion && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <i className="fas fa-check text-white text-3xl"></i>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Félicitations !</h3>
                    <p className="text-xl text-gray-700 mb-6">
                      Tu as terminé le module <span className="font-bold text-green-600">{currentModule.title}</span>
                    </p>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600">{currentModule.xpReward}</div>
                        <div className="text-sm text-gray-600">XP gagnés</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-600">{currentModule.sPointsReward}</div>
                        <div className="text-sm text-gray-600">S-Points gagnés</div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-2xl font-bold text-purple-600">{quizBonus}</div>
                        <div className="text-sm text-gray-600">Bonus quiz</div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={nextModule}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <i className="fas fa-arrow-right mr-2"></i>
                        Module suivant
                      </button>
                      <button
                        onClick={() => router.push('/modules')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
                      >
                        <i className="fas fa-list mr-2"></i>
                        Voir tous les modules
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Info */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Durée</span>
                  <span className="font-medium text-gray-900">{currentModule.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Difficulté</span>
                  <span className="font-medium text-gray-900">{currentModule.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">XP</span>
                  <span className="font-medium text-blue-600">+{currentModule.xpReward} XP</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">S-Points</span>
                  <span className="font-medium text-yellow-600">+{currentModule.sPointsReward}</span>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ta progression</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modules terminés</span>
                  <span className="font-medium text-gray-900">{user.completedModules?.length || 0}/{Object.keys(modules).length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${getProgressPercent()}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">Continue comme ça !</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-home text-blue-600"></i>
                    <span className="font-medium text-gray-900">Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/modules')}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-list text-gray-600"></i>
                    <span className="font-medium text-gray-900">Tous les modules</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default function ModulePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Chargement du module...</p>
        </div>
      </div>
    }>
      <ModulePageContent />
    </Suspense>
  );
}