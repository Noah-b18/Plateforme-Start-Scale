'use client';

import Header from '../../components/Header';
import { Chatbot } from '../../components/ui/chatbot';

export default function TestPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Page de Test</h1>
          
          {/* Testez vos composants ici */}
          <div className="space-y-6">
            {/* Tests de composants vont ici */}
            <Chatbot />
          </div>
        </div>
      </main>
    </div>
  );
}