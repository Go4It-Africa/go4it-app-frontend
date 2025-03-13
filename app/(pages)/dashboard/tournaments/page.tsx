'use client'

import { useClubStore } from "@/app/store/club";
import { useTournamentStore } from "@/app/store/tournament";
import Image from "next/image";
import Card from "@/app/components/ui/Card";
import { UserDropdown } from "@/app/components/UserDropdown";
import { RegisterTournamentModal } from "@/app/components/tournaments/RegisterTournamentModal";
import { useEffect, useState } from "react";
import { Tournament } from "@/app/types";

const TournamentsPage = () => {
  const { tournaments, fetchTournaments } = useTournamentStore();
  const { currentClub } = useClubStore();
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [isRegisterTournamentModalOpen, setIsRegisterTournamentModalOpen] = useState(false);

  useEffect(() => {
    if(tournaments.length === 0) {
        fetchTournaments();
    }
  }, [tournaments, fetchTournaments]);

  const club = currentClub;

  const handleRegisterClick = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setIsRegisterTournamentModalOpen(true);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Header */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src={club?.logo as string || '/logos/logo.png'}
                alt={club?.name || 'Club Logo'}
                width={48}
                height={48}
                className='w-12 h-12 rounded-full'
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/logos/logo.png';
                }}
              />
              <div>
                <h1 className='text-xl font-bold'>{club?.name}</h1>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span>{club?.sport}</span>
                  <span>•</span>
                  <span>{club?.country}</span>
                </div>
              </div>
            </div>

            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
            {tournaments.length > 0 && tournaments?.map((tournament) => (
                <Card key={tournament.id} className='p-6'>
                    <div className='flex flex-col items-center gap-4'>
                        <div className='w-full h-48 relative overflow-hidden rounded-lg'>
                            <Image
                                src={typeof tournament.logo === 'string' ? tournament.logo : '/logos/logo.png'}
                                alt={tournament.tournament_name || 'Tournament Logo'}
                                fill
                                className='object-cover'
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/logos/logo.png';
                                }}
                            />
                        </div>
                        <div className='flex items-center justify-start gap-2'>
                            <div>
                                <h3 className='text-lg font-bold'>{tournament.tournament_name}</h3>
                                <p className='text-sm text-gray-600'>{tournament.city}, {tournament.country}</p>
                            </div>
                        </div>
                        <div className='flex items-center justify-start gap-2'>
                            <button 
                              onClick={() => handleRegisterClick(tournament)} 
                              className='bg-primary text-white px-4 py-2 rounded-lg'
                            >
                              Register
                            </button>
                        </div>
                    </div>
                </Card>
            ))}

            {tournaments.length === 0 && (
                <div className='flex items-center justify-center h-full'>
                    <p className='text-sm text-gray-600'>No Active tournaments found</p>
                </div>
            )}
        </div>
      </div>

      <RegisterTournamentModal
        isOpen={isRegisterTournamentModalOpen}
        onClose={() => {
          setIsRegisterTournamentModalOpen(false);
          setSelectedTournament(null);
        }}
        currentTournament={selectedTournament!}
      />
    </div>
  )
};

export default TournamentsPage;