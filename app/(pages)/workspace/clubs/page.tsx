'use client';

import { Layout } from '@/app/components/layout/WorkSpaceLayout';
import Card from '@/app/components/ui/Card';
import { Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Loader from '@/app/components/Loader';
import { CreateClubModal } from '@/app/components/clubs/ClubModal';
import { useClubStore } from '@/app/store/club';
import { signOut } from 'next-auth/react';
export default function ClubsWorkspacePage() {
  const { clubs, isLoading, error, fetchClubs } = useClubStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const processedClubs = useMemo(() => {
    if(!isLoading && !error) {
      return clubs.map((club) => ({
        ...club,
        logo:
          club.logo instanceof Blob ? URL.createObjectURL(club.logo) : club.logo,
      }));
    }
  }, [clubs, isLoading, error]);

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
            <h2>We&apos;re having trouble loading the clubs</h2>
          </div>
          <div className='text-red-500 text-center'>
            {error}
          </div>
          <button onClick={() => fetchClubs()}>
            Try again
          </button>
          <button onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      );
    }
  }

  if (!clubs.length) {
    return (
      <Layout
        title='Select Workspace'
        description='Choose a club to manage or create a new one'
        buttonText='Create New Club'
        page='clubs'
        noItems={true}
        buttonAction={() => {
          setIsCreateModalOpen(true);
        }}
      />
    );
  }

  if (!clubs.length) {
    return (
      <>
        <Layout
          title='Select Workspace'
          description='Choose a club to manage or create a new one'
          buttonText='Create New Club'
          page='clubs'
          buttonAction={() => {
            setIsCreateModalOpen(true);
          }}
        />
        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </>
    );
  }

  return (
    <Layout
      title='Select Workspace'
      description='Choose a club to manage or create a new one'
      buttonText='Create New Club'
      noItems={false}
      buttonAction={() => {
        setIsCreateModalOpen(true);
      }}
    >
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
        {processedClubs?.map((club) => {
          if (!club) return null;
          const { id, name, logo, sport, playerCount, country } = club;
          return (
            <div key={id} className='h-full'>
              <Card
                key={id}
                className='hover:shadow-lg transition-shadow h-full'
              >
                <div className='p-6 h-full flex flex-col'>
                  <div className='flex items-center gap-4 mb-4'>
                    <Image
                      src={logo || '/logos/logo.png'}
                      alt={`${name} logo`}
                      width={64}
                      height={64}
                      className='h-16 w-16 rounded-full object-cover'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logos/logo.png';
                      }}
                    />
                    <div>
                      <h3 className='font-bold text-lg'>{name}</h3>
                      <p className='text-gray-600 capitalize'>{sport}</p>
                    </div>
                  </div>

                  <div className='flex items-center gap-4 mb-4'>
                    <div className='flex items-center gap-2'>
                      <Users size={16} className='text-gray-400' />
                      <span className='text-sm text-gray-600'>
                        {playerCount} Players
                      </span>
                    </div>
                    <div className='text-sm text-gray-600'>{country}</div>
                  </div>

                  <Link
                    href={`/dashboard/club/${id}`}
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
        <CreateClubModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </Layout>
  );
}
