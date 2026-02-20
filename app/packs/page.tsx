'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Chatbot } from '../../components/ui/chatbot';
import Header from '../../components/Header';


interface Pack {
  id: string;
  name: string;
  points: number;
  price: number;
  discount: number;
  icon: string;
  color: string;
  popular?: boolean;
  features: string[];
}

export default function PacksPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);


  const packs: Pack[] = [
    {
      id: 'starter',
      name: 'Starter',
      points: 5000,
      price: 5,
      discount: 0,
      icon: 'fas fa-rocket',
      color: 'from-green-400 to-green-500',
      features: [
        'Accès à 2 modules premium',
        '1 call mentor inclus',
        'Support prioritaire',
        'Badge "Starter" exclusif'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      points: 10000,
      price: 9,
      discount: 10,
      icon: 'fas fa-chart-line',
      color: 'from-blue-500 to-blue-600',
      popular: true,
      features: [
        'Accès à 5 modules premium',
        '3 calls mentors inclus',
        'Accès aux concours mensuels',
        'Badge "Growth" exclusif',
        'Accès anticipé aux nouveautés'
      ]
    },
    {
      id: 'scale',
      name: 'Scale',
      points: 25000,
      price: 20,
      discount: 20,
      icon: 'fas fa-crown',
      color: 'from-purple-500 to-purple-600',
      features: [
        'Accès à tous les modules',
        'Calls mentors illimités',
        'Concours premium',
        'Badge "Scale" exclusif',
        'Support VIP 24/7',
        'Accès au réseau privé'
      ]
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
  }, [router]);

  const handlePurchase = (pack: Pack) => {
    // TODO: Implement purchase logic
    console.log('Purchase pack:', pack);
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header user='membre' />


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Packs de <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">S-Points</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Recharge ton compte en S-Points pour débloquer des fonctionnalités exclusives et accélérer ta progression
          </p>

          {/* Beta Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
                <i className="fas fa-flask text-white"></i>
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-800">Mode Bêta - Achats Désactivés</h3>
                <p className="text-yellow-700">Tous les packs sont gratuits pendant la phase bêta</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">1500 S-Points offerts</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">Modules gratuits</span>
              <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">Calls inclus</span>
            </div>
          </div>
        </div>

        {/* Packs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packs.map(pack => (
            <div
              key={pack.id}
              className={`pack-card bg-white rounded-2xl p-8 shadow-lg relative transition-all hover:transform hover:-translate-y-2 hover:shadow-xl ${
                pack.popular ? 'border-2 border-blue-200' : ''
              }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                    POPULAIRE
                  </div>
                </div>
              )}

              {/* Disabled Overlay */}
              <div className="absolute inset-0 rounded-2xl bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-lock text-gray-500 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-bold text-gray-600 mb-2">Disponible en V1</h3>
                  <p className="text-sm text-gray-500">Achats désactivés en Bêta</p>
                </div>
              </div>

              <div className="relative">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${pack.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <i className={`${pack.icon} text-white text-2xl`}></i>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{pack.name}</h3>
                  <p className="text-gray-600">
                    {pack.id === 'starter' && 'Parfait pour commencer'}
                    {pack.id === 'growth' && 'Pour accélérer ta progression'}
                    {pack.id === 'scale' && 'Pour les plus ambitieux'}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-black text-gray-900 mb-2">{pack.points.toLocaleString()}</div>
                  <div className="text-lg text-gray-600">S-Points</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Soit {pack.price}€{pack.discount > 0 && ` (-${pack.discount}%)`}
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  {pack.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <i className="fas fa-check text-green-600"></i>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handlePurchase(pack)}
                  className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  disabled
                >
                  <i className="fas fa-lock mr-2"></i>
                  Disponible en V1
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Questions Fréquentes</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Que puis-je faire avec les S-Points ?</h3>
                <p className="text-gray-600 text-sm">Les S-Points permettent d'accéder à des modules premium, réserver des calls avec des mentors, participer à des concours et débloquer des fonctionnalités exclusives.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Les S-Points expirent-ils ?</h3>
                <p className="text-gray-600 text-sm">Non, les S-Points n'ont pas de date d'expiration. Tu peux les utiliser quand tu veux sur la plateforme.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je obtenir des S-Points gratuitement ?</h3>
                <p className="text-gray-600 text-sm">Oui ! Tu gagnes des S-Points en complétant des modules, réussissant des quiz, participant aux missions quotidiennes et en montant en niveau.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je échanger mes S-Points contre de l'argent ?</h3>
                <p className="text-gray-600 text-sm">Non, les S-Points sont une monnaie virtuelle utilisée uniquement sur la plateforme Start & Scale pour débloquer du contenu et des fonctionnalités.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Y a-t-il des remises pour les gros packs ?</h3>
                <p className="text-gray-600 text-sm">Oui ! Plus le pack est volumineux, plus la remise est importante. Jusqu'à 20% de réduction sur le pack Scale.</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Puis-je annuler un achat ?</h3>
                <p className="text-gray-600 text-sm">Les achats de S-Points sont définitifs. Cependant, si tu rencontres un problème technique, tu peux contacter notre support.</p>
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