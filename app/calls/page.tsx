'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Chatbot } from '../../components/ui/chatbot';
import Header from '../../components/Header';


interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  expertise: string[];
  experience: string;
  rating: number;
  sessions: number;
  image: string;
  bio: string;
  specialties: string[];
  languages: string[];
  availability: string;
}

interface TimeSlot {
  date: string;
  time: string;
  display: string;
  available: boolean;
}

interface Reservation {
  id: string;
  mentor: Mentor;
  date: string;
  time: string;
  display: string;
  status: string;
  createdAt: string;
}

export default function CallsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);

  // Mock mentors data
  const mentors: Mentor[] = [
    {
      id: 'mentor-1',
      name: 'Marc Bagur',
      role: 'Serial entrepreneur de la FrenchTech',
      company: 'Consultant indépendant',
      expertise: ['Intelligence artificielle', 'Robotique humanoïde', 'Innovations technologiques'],
      experience: '20 ans',
      rating: 5.0,
      sessions: 127,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoe39oUjT9lME52-4oA33WDNyiyqbtpg9VTw&s',
      bio: 'Serial entrepreneur en IA souveraine et Industrie 4.0. Expert en innovation et transformation digitale. Enseignant MBA, il a accompagné 200+ entreprises et organisations.',
      specialties: ['Validation produit', 'Go-to-market', 'Team building'],
      languages: ['Français', 'Anglais'],
      availability: 'Lun-Ven 9h-18h'
    },
    {
      id: 'mentor-2',
      name: 'Julien Durandet',
      role: 'Co-fondatrice',
      company: 'GreenTech Solutions',
      expertise: ['Web', 'IA', 'Marketing digital', 'Stratégie digitale'],
      experience: '14 ans',
      rating: 4.8,
      sessions: 89,
      image: 'https://media.licdn.com/dms/image/v2/D4E03AQG_b4Bs730GIw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727184545606?e=2147483647&v=beta&t=EgWBnStdz7y1AILoqK7PKk1G0xejlHwkcQVl9nDoIds',
      bio: 'Passionné de nouvelles technologies.<br> Directeur de projet digital. <br>Chef de projet depuis 2011, j\'accompagne les entreprises dans leurs transformation digitale et dans la réalisation de leurs projets web.',
      specialties: ['Growth hacking', 'SEO/SEM', 'Brand strategy'],
      languages: ['Français'],
      availability: 'Lun-Sam 8h-18h'
    },
    {
      id: 'mentor-3',
      name: 'Anthony Destenave',
      role: 'COO',
      company: 'FinanceLab',
      expertise: ['Management', 'Business Model', 'Teaming'],
      experience: '7 ans',
      rating: 4.7,
      sessions: 73,
      image: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.rsCcPdGkQXLBIjAxP7KlPgAAAA%3Fpid%3DApi&f=1&ipt=da822f1de49cf3a3822a0920095b9e7c49b5f799a80c77176551b5e31af9d53b&ipo=images',
      bio: 'Experte en modélisation financière et stratégie de pricing pour startups. J\'ai aidé des centaines de startups à construire des modèles économiques solides et à optimiser leur pricing.',
      specialties: ['Financial modeling', 'Unit economics', 'Fundraising'],
      languages: ['Français', 'Anglais'],
      availability: 'Mar-Sam 9h-17h'
    },
    {
      id: 'mentor-4',
      name: 'Marianne',
      role: 'Serial entrepreneuse',
      company: 'FinanceLab',
      expertise: ['E-commerce', 'Pitch commercial', 'Gestion de projet'],
      experience: '7 ans',
      rating: 4.7,
      sessions: 73,
      image: './plateforme/assets/images/mariane.jpeg',
      bio: `"Serial entrepreneuse", c'est ainsi que m'a surnommée la fondatrice d'une grande marque cosmétiques. Jamais à court d'idées, créative et animée par l'envie d'aider sont des mots qui me définissent plutôt bien ! `,
      specialties: ['Financial modeling', 'Unit economics', 'Fundraising'],
      languages: ['Français', 'Anglais'],
      availability: 'Mar-Sam 9h-17h'
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

    // Charger les réservations simulées
    const userReservations = currentUser.reservations || [];
    setReservations(userReservations.filter((r: Reservation) => r.status === 'simulated'));
  }, [router]);

  const selectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowTimeSlots(true);
    setSelectedTimeSlot(null);
  };

  const selectTimeSlot = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedTimeSlot(slot);
  };

  const hideTimeSlots = () => {
    setShowTimeSlots(false);
    setSelectedTimeSlot(null);
  };

  const confirmDemoBooking = () => {
    if (!selectedMentor || !selectedTimeSlot || !user) return;

    // Créer une réservation simulée
    const reservation: Reservation = {
      id: Date.now().toString(),
      mentor: selectedMentor,
      date: selectedTimeSlot.date,
      time: selectedTimeSlot.time,
      display: selectedTimeSlot.display,
      status: 'simulated',
      createdAt: new Date().toISOString()
    };

    // Sauvegarder la réservation
    const updatedUser = { ...user, reservations: [...user.reservations, reservation] };
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setReservations([...reservations, reservation]);

    // Montrer le modal de confirmation
    setShowDemoModal(true);

    // Reset selection
    hideTimeSlots();
    setSelectedMentor(null);
  };

  const closeDemoModal = () => {
    setShowDemoModal(false);
  };

  const removeDemoReservation = (reservationId: string) => {
    if (!user) return;

    const updatedReservations = user.reservations.filter((r: Reservation) => r.id !== reservationId);
    const updatedUser = { ...user, reservations: updatedReservations };
    setUser(updatedUser);
    sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setReservations(updatedReservations.filter((r: Reservation) => r.status === 'simulated'));
  };

  // Générer les créneaux horaires
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const times = ['09:00', '10:30', '14:00', '15:30', '17:00'];
      times.forEach(time => {
        const isAvailable = Math.random() > 0.3; // 70% chance of availability
        slots.push({
          date: date.toISOString().split('T')[0],
          time: time,
          display: `${date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' })} ${time}`,
          available: isAvailable
        });
      });
    }

    return slots.slice(0, 20); // Limit to 20 slots
  };

  const timeSlots = generateTimeSlots();

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
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Calls avec des Mentors</h1>
              <p className="text-gray-600">Reçois des conseils personnalisés de la part d'entrepreneurs expérimentés</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg">
              <i className="fas fa-video text-green-600"></i>
              <span className="text-sm font-medium text-green-600">Disponible en Bêta</span>
            </div>
          </div>
        </div>

        {/* Beta Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 demo-badge">
              <i className="fas fa-info text-white"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Mode DÉMO - Réservations Simulées</h3>
              <p className="text-gray-700 mb-3">
                Les réservations sont simulées pour te permettre d'explorer la plateforme.
                Les calls réels avec les mentors seront disponibles dans la version complète de Start & Scale.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">Gratuit en DÉMO</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">Sans S-Points</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">Explorer la plateforme</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Available Mentors */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mentors Disponibles</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <i className="fas fa-users"></i>
                  <span>{mentors.length} mentors</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {mentors.map(mentor => (
                  <div
                    key={mentor.id}
                    className={`mentor-card bg-gray-50 rounded-xl p-6 cursor-pointer transition-all ${
                      selectedMentor?.id === mentor.id ? 'selected' : ''
                    }`}
                    onClick={() => selectMentor(mentor)}
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <img src={mentor.image} alt={mentor.name} className="w-16 h-16 rounded-full object-cover" />
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{mentor.name}</h3>
                        <p className="text-sm text-gray-600">{mentor.role}</p>
                        <p className="text-sm text-blue-600 font-medium">{mentor.company}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <i className="fas fa-star text-yellow-500 text-sm"></i>
                          <span className="font-semibold text-gray-900">{mentor.rating}</span>
                        </div>
                        <div className="text-xs text-gray-600">{mentor.sessions} sessions</div>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-4 line-clamp-5" dangerouslySetInnerHTML={{ __html: mentor.bio }} />

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map(skill => (
                          <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-gray-600">Expérience:</span>
                        <span className="font-medium text-gray-900 ml-1">{mentor.experience}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Langues:</span>
                        <span className="font-medium text-gray-900 ml-1">{mentor.languages.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Disponibilité:</span><br />
                        <span className="font-medium text-gray-900">{mentor.availability}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Session:</span>
                        <span className="font-medium text-gray-900 ml-1">30 min</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <i className="fas fa-comment text-gray-400 text-sm"></i>
                        <span className="text-xs text-gray-600">{mentor.languages.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900">30 min</span>
                        <i className="fas fa-arrow-right text-blue-600"></i>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            {showTimeSlots && (
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Créneaux Disponibles</h3>
                  <button onClick={hideTimeSlots} className="text-gray-600 hover:text-gray-900 transition-colors">
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot p-3 border border-gray-200 rounded-lg text-center text-sm cursor-pointer transition-all ${
                        !slot.available ? 'unavailable' : selectedTimeSlot === slot ? 'selected' : ''
                      }`}
                      onClick={() => selectTimeSlot(slot)}
                    >
                      <div className="font-medium text-gray-900">{slot.time}</div>
                      <div className="text-xs text-gray-600">{slot.display.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={confirmDemoBooking}
                    disabled={!selectedTimeSlot}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="fas fa-calendar-check mr-2"></i>
                    Simuler la réservation
                  </button>
                </div>
              </div>
            )}

            {/* My Reservations */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Mes Réservations Simulées</h2>
                <span className="text-sm text-gray-600">
                  {reservations.length} réservation{reservations.length !== 1 ? 's' : ''} simulée{reservations.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div>
                {reservations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-calendar text-gray-400 text-2xl"></i>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune réservation simulée</h3>
                    <p className="text-gray-600">Sélectionne un mentor pour explorer les créneaux disponibles</p>
                  </div>
                ) : (
                  reservations.map(reservation => (
                    <div key={reservation.id} className="bg-blue-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start space-x-4">
                        <img src={reservation.mentor.image} alt={reservation.mentor.name} className="w-12 h-12 rounded-full object-cover" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{reservation.mentor.name}</h4>
                          <p className="text-sm text-gray-600">{reservation.mentor.role}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1">
                              <i className="fas fa-calendar text-blue-600 text-sm"></i>
                              <span className="text-sm font-medium text-gray-900">{reservation.display}</span>
                            </div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Simulation
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-600">Durée</div>
                          <div className="font-medium text-gray-900">30 min</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-600">Mode DÉMO - Call simulé</span>
                          <button
                            onClick={() => removeDemoReservation(reservation.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                          >
                            <i className="fas fa-times mr-1"></i>
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* How it Works */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comment ça marche ?</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Choisis ton mentor</h4>
                    <p className="text-sm text-gray-600">Sélectionne un mentor selon son expertise</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Explore les créneaux</h4>
                    <p className="text-sm text-gray-600">Découvre les horaires disponibles</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Simule la réservation</h4>
                    <p className="text-sm text-gray-600">Teste le processus de réservation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avantages futurs</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-green-600"></i>
                  <span className="text-sm text-gray-700">Conseils personnalisés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-green-600"></i>
                  <span className="text-sm text-gray-700">Networking qualifié</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-green-600"></i>
                  <span className="text-sm text-gray-700">Feedback sur ton projet</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check text-green-600"></i>
                  <span className="text-sm text-gray-700">Accès à des ressources exclusives</span>
                </div>
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
                    <i className="fas fa-graduation-cap text-gray-600"></i>
                    <span className="font-medium text-gray-900">Continuer mes modules</span>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/assistant')}
                  className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-robot text-purple-600"></i>
                    <span className="font-medium text-gray-900">Assistant IA</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Demo Booking Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 modal-backdrop flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-check text-green-600 text-2xl"></i>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Réservation simulée !</h3>
              <p className="text-gray-600">Tu viens de tester le processus de réservation. La fonctionnalité complète arrive en V1.</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="text-center">
                <div className="font-semibold text-blue-900 mb-1">
                  {selectedTimeSlot && selectedMentor ? `${selectedTimeSlot.display} avec ${selectedMentor.name}` : 'Détails de la réservation simulée'}
                </div>
                <div className="text-sm text-blue-700">Mode DÉMO - Call simulé</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-info-circle text-blue-500"></i>
                <span>Les calls réels seront disponibles dans la version complète</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-video text-green-500"></i>
                <span>Des mentors expérimentés te guideront en vidéo</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <i className="fas fa-clock text-purple-500"></i>
                <span>Sessions de 30 minutes avec préparation personnalisée</span>
              </div>
            </div>

            <button onClick={closeDemoModal} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
              Compris !
            </button>
          </div>
        </div>
      )}

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}