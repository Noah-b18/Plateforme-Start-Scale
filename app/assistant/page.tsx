'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string | any[];
  timestamp: Date;
}

interface QuickSuggestion {
  icon: string;
  color: string;
  text: string;
}

export default function Assistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userId, setUserId] = useState<string>('Non connecté');
  const [userRole, setUserRole] = useState<string>('N/A');
  const [userPoints, setUserPoints] = useState<string>('0');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Access sessionStorage only on client side
    setUserId(sessionStorage.getItem('userId') || 'Non connecté');
    setUserRole(sessionStorage.getItem('userRole') || 'N/A');
    setUserPoints(sessionStorage.getItem('userPoints') || '0');
  }, []);

  const quickSuggestions: QuickSuggestion[] = [
    { icon: 'fa-compass', color: 'blue', text: "Guide-moi vers les modules adaptés" },
    { icon: 'fa-calendar-plus', color: 'green', text: "Réserve un call avec un mentor" },
    { icon: 'fa-lightbulb', color: 'yellow', text: "Comment gagner plus de S-Points ?" },
    { icon: 'fa-info-circle', color: 'purple', text: "Questions sur l'entrepreneuriat" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateProcessing = async () => {
    const delay = Math.random() * 1000 + 500;
    await new Promise(resolve => setTimeout(resolve, delay));
  };

  const generateResponse = (userMessage: string): any[] => {
    const message = userMessage.toLowerCase();

    // Mentor responses
    if (message.includes('mentor') || message.includes('call') || message.includes('appel')) {
      return [
        `Parfait ! Les mentors sont là pour t'accompagner dans ton aventure entrepreneuriale. 🚀`,
        `Voici comment ça fonctionne :`,
        {
          type: 'list',
          items: [
            { icon: 'fa-user-tie', color: 'blue', text: "Chaque mentor est un entrepreneur expérimenté dans son domaine" },
            { icon: 'fa-clock', color: 'green', text: "Sessions de 30 minutes pour des conseils personnalisés" },
            { icon: 'fa-calendar-check', color: 'purple', text: "Réservation facile via la plateforme" },
            { icon: 'fa-star', color: 'yellow', text: "Évaluation et feedback après chaque session" }
          ]
        },
        "Veux-tu que je t'aide à trouver le mentor idéal pour ton projet ? Dis-moi simplement dans quel domaine tu as besoin d'aide ! 💪"
      ];
    }

    // Module responses
    if (message.includes('module') || message.includes('formation') || message.includes('apprendre')) {
      return [
        `Excellent choix ! Nos modules sont conçus pour te donner les compétences essentielles. 📚`,
        `Tu peux explorer :`,
        {
          type: 'list',
          items: [
            { icon: 'fa-rocket', color: 'blue', text: "Business Model - Valide ton idée" },
            { icon: 'fa-chart-line', color: 'green', text: "Growth Hacking - Fais grandir ton business" },
            { icon: 'fa-users', color: 'purple', text: "Team Building - Constitue ton équipe" },
            { icon: 'fa-dollar-sign', color: 'yellow', text: "Financing - Trouve tes financements" }
          ]
        },
        "Chaque module se termine par un quiz pour valider tes acquis. Prêt à commencer ? 🎯"
      ];
    }

    // S-Points responses
    if (message.includes('s-point') || message.includes('point') || message.includes('gagner')) {
      return [
        `Les S-Points sont la monnaie de Start & Scale ! 💰`,
        `Voici comment les gagner :`,
        {
          type: 'list',
          items: [
            { icon: 'fa-graduation-cap', color: 'blue', text: "Complète un module : +50 S-Points" },
            { icon: 'fa-calendar-plus', color: 'green', text: "Réserve un call mentor : +25 S-Points" },
            { icon: 'fa-share-alt', color: 'purple', text: "Invite un ami : +100 S-Points" },
            { icon: 'fa-trophy', color: 'yellow', text: "Atteins le top 10 du leaderboard : +200 S-Points" }
          ]
        },
        "Plus tu progresses, plus tu gagnes ! Et tes S-Points te donnent accès à des avantages exclusifs. 🏆"
      ];
    }

    // Beta responses
    if (message.includes('beta') || message.includes('bêta') || message.includes('test')) {
      return [
        `Bienvenue dans la phase bêta de Start & Scale ! 🎉`,
        `Quelques infos importantes :`,
        {
          type: 'list',
          items: [
            { icon: 'fa-tools', color: 'blue', text: "Nous améliorons constamment la plateforme" },
            { icon: 'fa-bug', color: 'red', text: "Signale les bugs via le bouton feedback" },
            { icon: 'fa-lightbulb', color: 'yellow', text: "Tes suggestions sont précieuses !" },
            { icon: 'fa-gift', color: 'green', text: "Bonus bêta : +500 S-Points de bienvenue" }
          ]
        },
        "Merci de participer à cette aventure ! Ensemble, on construit la meilleure plateforme entrepreneuriale. 🤝"
      ];
    }

    // Settings responses
    if (message.includes('paramètre') || message.includes('setting') || message.includes('profil')) {
      return [
        `Ton profil et tes paramètres sont accessibles depuis le menu principal. ⚙️`,
        `Tu peux configurer :`,
        {
          type: 'list',
          items: [
            { icon: 'fa-bell', color: 'blue', text: "Notifications - Reste informé des mises à jour" },
            { icon: 'fa-moon', color: 'purple', text: "Mode sombre - Pour travailler la nuit" },
            { icon: 'fa-globe', color: 'green', text: "Langue - Interface en français ou anglais" },
            { icon: 'fa-shield-alt', color: 'red', text: "Confidentialité - Contrôle tes données" }
          ]
        },
        "Veux-tu que je t'accompagne vers tes paramètres ? 🔧"
      ];
    }

    // Default response
    return [
      `Super question ! Je suis impressionné par ta curiosité ! 🤩`,
      `Voici comment je peux t'aider immédiatement :`,
      {
        type: 'list',
        items: [
          { icon: 'fa-compass', color: 'blue', text: "Je peux te guider vers les modules les plus adaptés à ton niveau" },
          { icon: 'fa-calendar-plus', color: 'green', text: "T'aider à réserver un call avec le mentor parfait pour ton projet" },
          { icon: 'fa-lightbulb', color: 'yellow', text: "T'expliquer comment maximiser tes gains de S-Points" },
          { icon: 'fa-info-circle', color: 'purple', text: "Répondre à toutes tes questions sur l'entrepreneuriat" }
        ]
      },
      "N'hésite pas à être précis dans ta question, j'adore les défis ! Et si tu ne sais pas par où commencer, demande-moi simplement 'par où commencer ?' et je te créerai un plan personnalisé ! 🎯"
    ];
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsThinking(true);

    await simulateProcessing();

    const response = generateResponse(inputValue);
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsThinking(false);
  };

  const sendQuickSuggestion = async (message: string) => {
    setInputValue(message);
    // Auto-send after a brief delay
    setTimeout(() => sendMessage(), 100);
  };

  const clearChat = () => {
    if (confirm('Voulez-vous vraiment vider le chat ?')) {
      setMessages([]);
    }
  };

  const exportChat = () => {
    if (messages.length > 0) {
      const chatData = JSON.stringify(messages, null, 2);
      const blob = new Blob([chatData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat-export-${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const autoResizeInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    autoResizeInput();
  }, [inputValue]);

  const renderMessageContent = (content: string | any[]) => {
    if (typeof content === 'string') {
      return <p className="text-gray-800">{content}</p>;
    }

    return content.map((item, index) => {
      if (typeof item === 'string') {
        return <p key={index} className="text-gray-800 mb-3">{item}</p>;
      }

      if (item.type === 'list') {
        return (
          <ul key={index} className="space-y-2 mb-3">
            {item.items.map((listItem: any, listIndex: number) => (
              <li key={listIndex} className="flex items-center space-x-3">
                <i className={`fas ${listItem.icon} text-${listItem.color}-500 w-5`}></i>
                <span className="text-gray-700">{listItem.text}</span>
              </li>
            ))}
          </ul>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-bars text-gray-600"></i>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Assistant IA</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={clearChat}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Vider le chat"
              >
                <i className="fas fa-trash text-gray-600"></i>
              </button>
              <button
                onClick={exportChat}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Exporter le chat"
              >
                <i className="fas fa-download text-gray-600"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className={`w-80 bg-white border-r border-gray-200 transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:relative lg:translate-x-0 z-30 h-full`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contexte Debug</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Session Utilisateur</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>ID:</strong> {userId}</p>
                  <p><strong>Rôle:</strong> {userRole}</p>
                  <p><strong>S-Points:</strong> {userPoints}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Navigation Récente</h3>
                <div className="text-sm text-gray-600">
                  <p>Page actuelle: /assistant</p>
                  <p>Dernière visite: {new Date().toLocaleString('fr-FR')}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">Suggestions Rapides</h3>
                <div className="space-y-2">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickSuggestion(suggestion.text)}
                      className="w-full text-left p-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center space-x-2"
                    >
                      <i className={`fas ${suggestion.icon} text-${suggestion.color}-500 w-4`}></i>
                      <span className="text-sm text-gray-700">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6" id="chatMessages">
            {messages.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-robot text-white text-2xl"></i>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Salut ! Je suis ton assistant IA 🤖</h2>
                <p className="text-gray-600 mb-6">Comment puis-je t'aider dans ton aventure entrepreneuriale ?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {quickSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => sendQuickSuggestion(suggestion.text)}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all flex items-center space-x-3"
                    >
                      <i className={`fas ${suggestion.icon} text-${suggestion.color}-500 text-xl`}></i>
                      <span className="text-gray-800 font-medium">{suggestion.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}-message mb-6`}>
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.type === 'bot'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    <i className={`fas ${message.type === 'bot' ? 'fa-robot' : 'fa-user'} text-white`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
                      {renderMessageContent(message.content)}
                      <div className="text-xs text-gray-500 mt-2">
                        {message.timestamp.toLocaleTimeString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="message bot-message mb-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-robot text-white animate-pulse"></i>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-2xl p-4 border border-gray-200">
                      <p className="text-gray-500 italic">L'assistant réfléchit...</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Pose-moi une question sur Start & Scale..."
                    className="w-full p-4 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
                    rows={1}
                    maxLength={1000}
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-400" id="charCount">
                    {inputValue.length}/1000
                  </div>
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isThinking}
                  className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}