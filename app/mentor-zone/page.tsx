'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chatbot } from '../../components/ui/chatbot';

export default function MentorZonePage() {
  const router = useRouter();

  useEffect(() => {
    // Allow access only for authenticated mentors; otherwise redirect home
    const currentUserRaw = sessionStorage.getItem('currentUser');
    if (!currentUserRaw) {
      router.push('/');
      return;
    }

    try {
      const currentUser = JSON.parse(currentUserRaw);
      if (!currentUser || currentUser.role !== 'mentor') {
        router.push('/');
      }
    } catch (e) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src="/assets/images/logoss.png" alt="Start & Scale Logo" className="h-12" />
              <span className="font-semibold text-lg">Start & Scale - Espace Mentor</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Espace Mentor</h1>
        <p className="text-gray-600 mb-6">Bienvenue sur votre tableau de bord mentor. Cette section sera développée prochainement.</p>

        {/* Chatbot */}
        <Chatbot />
      </main>
    </div>
  );
}