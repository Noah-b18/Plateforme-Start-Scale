'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, Trophy, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Arrow } from '@radix-ui/react-dropdown-menu';

export default function Login() {
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState('');
  const router = useRouter();

  // Appliquer le rôle pré-sélectionné depuis sessionStorage
  useEffect(() => {
    const preselectedRole = sessionStorage.getItem('selectedRole');
    if (preselectedRole) {
      selectRole(preselectedRole);
      sessionStorage.removeItem('selectedRole');
    }
  }, []);

  const selectRole = (role: string) => {
    setCurrentRole(role);
    setShowLogin(true);
    setShowSignup(false);
  };

  const backToRole = () => {
    setCurrentRole(null);
    setShowLogin(false);
    setShowSignup(false);
  };

  const switchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const backToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Créer un utilisateur de démonstration
    const user = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      role: currentRole,
      sPoints: currentRole === 'mentor' ? 5000 : 1500,
      xp: currentRole === 'mentor' ? 10000 : 0,
      level: currentRole === 'mentor' ? 15 : 1,
      loginTime: new Date().toISOString()
    };

    // Demo mode: sessionStorage only
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    if (currentRole) {
      sessionStorage.setItem('userRole', currentRole);
    }

    // Rediriger selon le rôle
    router.push(currentRole === 'mentor' ? '/mentor-zone' : '/dashboard');
  };

  // const demoLogin = () => {
  //   const demoUsers = {
  //     mentor: {
  //       id: 'demo_mentor_001',
  //       email: 'mentor@startscale.com',
  //       name: 'Sarah Mentor',
  //       role: 'mentor',
  //       sPoints: 5000,
  //       xp: 10000,
  //       level: 15,
  //       loginTime: new Date().toISOString()
  //     },
  //     member: {
  //       id: 'demo_member_001',
  //       email: 'entrepreneur@startscale.com',
  //       name: 'Alex Entrepreneur',
  //       role: 'member',
  //       sPoints: 1500,
  //       xp: 2500,
  //       level: 5,
  //       loginTime: new Date().toISOString()
  //     }
  //   };

  //   const user = demoUsers[currentRole as keyof typeof demoUsers];
  //   sessionStorage.setItem('currentUser', JSON.stringify(user));
  //   if (currentRole) {
  //     sessionStorage.setItem('userRole', currentRole);
  //   }

  //   router.push(currentRole === 'mentor' ? '/mentor-zone' : '/dashboard');
  // };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupPasswordConfirm) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    // Créer le nouvel utilisateur
    const user = {
      id: 'user_' + Date.now(),
      email: signupEmail,
      name: signupName,
      role: currentRole,
      sPoints: currentRole === 'mentor' ? 5000 : 1500,
      xp: 0,
      level: 1,
      createdAt: new Date().toISOString(),
      loginTime: new Date().toISOString()
    };

    // Demo: sessionStorage only
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    if (currentRole) {
      sessionStorage.setItem('userRole', currentRole);
    }

    // Rediriger vers onboarding pour les nouveaux membres
    if (currentRole === 'member') {
      router.push('/onboarding');
    } else {
      router.push('/mentor-zone');
    }
  };

  const getRoleTitles = () => ({
    mentor: 'Connexion Mentor',
    member: 'Connexion Jeune Entrepreneur'
  });

  const getRoleSubtitles = () => ({
    mentor: 'Accédez à votre tableau de bord mentor',
    member: 'Accédez à votre espace entrepreneur'
  });

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo & Title */}
        <div className="text-center mb-5">
          <Image src="/assets/images/logoss.png" alt="Start & Scale Logo" className="h-auto mx-auto mb-3 mt-3" width={75} height={75} />
          <h1 className="text-4xl font-black gradient-text mb-2">Start & Scale</h1>
          <p className="text-gray-600">Plateforme d'entrepreneuriat</p>
        </div>

        {/* Role Selection */}
        {/* {!showLogin && !showSignup && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Je suis...</h2>

            <div className="space-y-3">
              <button
                onClick={() => selectRole('mentor')}
                className="role-button w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-500 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-chalkboard-user text-white text-lg"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Un Mentor</p>
                    <p className="text-sm text-gray-500">Partager mon expertise</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => selectRole('member')}
                className="role-button w-full p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                    <i className="fas fa-rocket text-white text-lg"></i>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Un Membre</p>
                    <p className="text-sm text-gray-500">Lancer mon projet</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}   */}

        {/* Login Form */}
        {showLogin && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <a href="../" className="text-blue-600 hover:text-blue-700 mb-4 flex items-center space-x-2">
              <ArrowLeft size={16} color="#3b82f6" />
              <span>Retour</span>
            </a>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {currentRole && getRoleTitles()[currentRole as keyof ReturnType<typeof getRoleTitles>]}
            </h2>
            <p className="text-gray-600 mb-6">
              {currentRole && getRoleSubtitles()[currentRole as keyof ReturnType<typeof getRoleSubtitles>]}
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 mt-6"
              >
                Se connecter
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-gray-600 mt-6">
              Pas encore inscrit ?
              <button onClick={switchToSignup} className="text-blue-600 hover:text-blue-700 font-semibold ml-1">
                S'inscrire
              </button>
            </p>
          </div>
        )}

        {/* Signup Form */}
        {showSignup && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <a href="../" className="text-blue-600 hover:text-blue-700 mb-4 flex items-center space-x-2">
              <ArrowLeft size={16} color="#3b82f6" />
              <span>Retour</span>
            </a>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
            <p className="text-gray-600 mb-6">
              {currentRole && getRoleSubtitles()[currentRole as keyof ReturnType<typeof getRoleSubtitles>]}
            </p>

            <form onSubmit={handleSignup} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={signupPasswordConfirm}
                  onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                  required
                  className="form-input w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Terms */}
              <div className="flex items-center">
                <input type="checkbox" required className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <label className="ml-2 block text-sm text-gray-700">
                  J'accepte les <button type="button" className="text-blue-600 hover:text-blue-700 font-semibold">conditions d'utilisation</button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all transform hover:scale-105 mt-6"
              >
                Créer un compte
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}