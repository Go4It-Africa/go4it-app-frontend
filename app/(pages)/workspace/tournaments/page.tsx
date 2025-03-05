'use client';

import { Layout } from '@/app/components/layout/WorkSpaceLayout';
import Card from '@/app/components/ui/Card';
import { ShieldHalf, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Loader from '@/app/components/Loader';
import { CreateTournamentModal } from '@/app/components/tournaments/TournamentModal';
import { signOut } from 'next-auth/react';
import { useTournamentStore } from '@/app/store/tournament';
export default function TournamentsWorkspacePage() {
  const { tournaments, isLoading, error, fetchTournaments } = useTournamentStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const processedTournaments = useMemo(() => {
    if(!isLoading && !error) {
      return tournaments.map((tournament) => ({
        ...tournament,
        logo:
          tournament.logo instanceof Blob ? URL.createObjectURL(tournament.logo) : tournament.logo,
      }));
    }
  }, [tournaments, isLoading, error]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    if(error === 'Request failed with status code 401') {
      signOut();
    } else {
      return (
        <div className='flex flex-col items-center justify-center h-screen'>
          <div>
            <h2>We&apos;re having trouble loading the tournaments</h2>
          </div>
          <div className='text-red-500 text-center'>
            {error}
          </div>
          <button onClick={() => fetchTournaments()}>
            Try again
          </button>
          <button onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      );
    }
  }

  if (!tournaments.length) {
    return (
      <Layout
        title='Select Workspace'
        description='Choose a tournament to manage or create a new one'
        buttonText='Create New Tournament'
        page='tournaments'
        noItems={true}
        buttonAction={() => {
          setIsCreateModalOpen(true);
        }}
      />
    );
  }

  if (!tournaments.length) {
    return (
      <>
        <Layout
          title='Select Workspace'
          description='Choose a tournament to manage or create a new one'
          buttonText='Create New Tournament'
          page='tournaments'
          buttonAction={() => {
            setIsCreateModalOpen(true);
          }}
        />
        <CreateTournamentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Layout
      title='Select Workspace'
      description='Choose a tournament to manage or create a new one'
      buttonText='Create New Tournament'
      noItems={false}
      buttonAction={() => {
        setIsCreateModalOpen(true);
      }}
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {processedTournaments?.map((tournament) => {
          if (!tournament) return null;
          //const { id, tournament_name, status, sport, participantCount, participatingTeams } = tournament;
          const { id, tournament_name, status, type_of_sport, max_teams_per_club, total_teams_count } = tournament;
          return (
            <div key={id} className='h-full'>
              <Card
                key={id}
                className='hover:shadow-lg transition-shadow h-full'
              >
                <div className='p-6 h-full flex flex-col'>
                  <div className='flex items-center gap-4 mb-4'>
                    <Image
                      // src={logo ?? '/logos/logo.png'}
                      src='/logos/logo.png'
                      alt={`${tournament_name} logo`}
                      width={64}
                      height={64}
                      className='h-16 w-16 rounded-full object-cover'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logos/logo.png';
                      }}
                    />
                    <div>
                      <h3 className='font-bold text-lg'>{ tournament_name}</h3>
                      <p className='text-gray-600 capitalize'>{type_of_sport}</p>
                      <p className='text-gray-600 capitalize'>{status}</p>
                    </div>
                  </div>
                  
                  <div className='flex flex-row gap-4'>
                    <div className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center gap-2'>
                        <ShieldHalf size={16} className='text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {total_teams_count} Teams
                        </span>
                      </div>
                    </div>

                    <div className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center gap-2'>
                        <ShieldHalf size={16} className='text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          {max_teams_per_club} Teams / Club
                        </span>
                      </div>
                    </div>
                  </div>
                  

                  <Link
                    href={`/dashboard/tournament/${id}`}
                    //onClick={() => setClub(club)}
                  >
                    <button className='mt-auto w-full bg-primary/10 text-primary font-medium py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/20 transition-colors'>
                      Open Dashboard
                      <ArrowRight size={16} />
                    </button>
                  </Link>
                </div>
              </Card>
            </div>
          );
        })}
        <CreateTournamentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </Layout>
  );
}
