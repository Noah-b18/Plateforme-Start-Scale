'use client';

import Header from '../components/Header';

import { RoleCard } from '../components/homepage/role-card';
import { FeatureCard } from '../components/homepage/feature-card';
import { GraduationCap, Users, Trophy } from 'lucide-react';
import { Chatbot } from '../components/ui/chatbot';

// Fonction pour définir le rôle sélectionné (migré du script inline)
function setRole(role: string) {
  sessionStorage.setItem('selectedRole', role);
}

export default function Home() {
  const memberFeatures = [
    "Modules complets et progressifs",
    "Système de gamification avec récompenses",
    "Accès aux sessions mentoring",
    "Communauté d'entrepreneurs actifs"
  ];

  const mentorFeatures = [
    "Tableau de bord mentor complet",
    "Catalogue de modules sans paywall",
    "Système de sessions mentoring",
    "Profil mentor avec certifications"
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Modules Interactifs",
      description: "Des cours structurés de l'idée à la validation, avec des quiz et des études de cas réels."
    },
    {
      icon: Users,
      title: "Mentorat Personnalisé",
      description: "Connecte-toi avec des mentors expérimentés qui ont réussi leurs propres projets."
    },
    {
      icon: Trophy,
      title: "Gamification",
      description: "Gagne des points, débloque des badges et progresse dans un système de récompenses engageant."
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <main className="pt-32 ">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="text-center hero-animation mb-16">
            <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-6">
              <span dangerouslySetInnerHTML={{ __html: 'Transforme tes idées en<br /><span class="gradient-text">entreprises gagnantes</span>' }} />
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Rejoins une plateforme complète où tu peux apprendre, te former avec des mentors, et progresser aux côtés d'une communauté d'entrepreneurs.
            </p>
          </div>
        </section>

        {/* Role Selection Cards */}
        <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8 mt-16">
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
            <RoleCard
              title="Tu es jeunes entrepreneur"
              description="Apprends à lancer et développer ton projet avec nos modules interactifs"
              icon="rocket"
              features={memberFeatures}
              buttonText="Rejoindre en tant que Jeune Entrepreneur"
              variant="member"
              onClick={() => {
                setRole('member');
                window.location.href = '/login';
              }}
            />

            <RoleCard
              title="Tu es Mentor"
              description="Partage ton expertise et guide la prochaine génération d'entrepreneurs"
              icon="users"
              features={mentorFeatures}
              buttonText="Rejoindre en tant que Mentor"
              variant="mentor"
              onClick={() => {
                setRole('mentor');
                window.location.href = '/login';
              }}
            />
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Pourquoi Start & Scale ?</h2>
              <p className="text-xl text-gray-600">Une plateforme complète pour réussir ton projet d'entrepreneuriat</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 items-stretch">
              {features.map((feature, index) => {
                const variant = index === 0 ? 'blue' : index === 1 ? 'purple' : 'green'
                return <FeatureCard key={index} {...feature} variant={variant} />
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 Start & Scale. Tous droits réservés. | Version Bêta</p>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
