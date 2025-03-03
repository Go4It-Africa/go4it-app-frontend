'use client';

import React, { useEffect, useState } from 'react';
import Card from '@/app/components/ui/Card';
import {
  Users,
  Trophy,
  Calendar,
  Clock,
  MoreHorizontal,
  FileText,
} from 'lucide-react';
import Image from 'next/image';

import { UserDropdown } from '@/app/components/UserDropdown';
import { SeasonSelector } from '@/app/components/clubs/ClubSeasonSelector';
import { Column, DataTable } from '@/app/components/ui/Table';
import { Player } from '@/app/types';
import Loader from '@/app/components/Loader';
import { useParams, useRouter } from 'next/navigation';
import { CreatePlayerModal } from '@/app/components/players/PlayerModal';
import { useClubStore } from '@/app/store/club';
import { usePlayerStore } from '@/app/store/player';
import { timeElapsed } from '@/app/utils/timePassed';

const PlayersTable = () => {
  const { currentClub } = useClubStore();
  const { players, fetchPlayers } = usePlayerStore();

  useEffect(() => {
    fetchPlayers(currentClub?.id);
  }, [currentClub?.id, fetchPlayers]);

  const router = useRouter();

  const columns: Column<Player>[] = [
    {
      key: 'photo',
      title: 'Photo',
      render: (value: string | unknown) => (
        <Image
          src={(value as string) || '/images/user.png'}
          alt='Player'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full object-cover'
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/user.png';
          }}
        />
      ),
      width: '60px',
    },
    {
      key: 'first_name',
      title: 'First Name',
      sortable: true,
    },
    {
      key: 'last_name',
      title: 'Last Name',
      sortable: true,
    },
    {
      key: 'date_of_birth',
      title: 'Date of Birth',
      sortable: true,
      render: (value: string | unknown) =>
        new Date((value as string) || '').toLocaleDateString(),
    },
    {
      key: 'birth_certificate_no',
      title: 'Birth Certificate No',
      render: (value: string | unknown) => (value as string) || 'Pending',
      sortable: false,
    },
    // {
    //   key: 'birth_certificate_file',
    //   title: 'Birth Certificate File',
    //   sortable: false,
    //   render: (value: string | unknown) => (value as string) || 'Pending',
    // },
    {
      key: 'name',
      title: 'Category',
      sortable: true,
    },
    // {
    //   key: 'is_active',
    //   title: 'Status',
    //   sortable: true,
    // },
  ];

  const actions = [
    {
      label: 'View Details',
      onClick: (player: Player) => {
        router.push(`/dashboard/player/${player.id}`);
      },
    },
    {
      label: 'Edit',
      onClick: (player: Player) => console.log('Edit', player.id),
    },
    {
      label: 'Delete',
      onClick: (player: Player) => console.log('Delete', player.id),
      danger: true,
    },
  ];

  if (players && !players.length)
    return (
      <div className='mt-8'>
        <h2 className='text-lg font-bold'>No players found</h2>
      </div>
    );

  return (
    <DataTable
      data={players} // Your player data here
      columns={columns}
      actions={actions}
      title='Players'
      loading={false}
      searchPlaceholder='Search players...'
      onSearch={(term) => console.log('Search:', term)}
      className='mt-8'
    />
  );
};

const ClubDashboard = () => {
  const { currentClub, viewClub, isLoading } = useClubStore();

  const params = useParams(); 
  const id = params.id;

  useEffect(() => {
    viewClub(Number(id));
  }, [id, viewClub]);

  const club = currentClub;

  const { players } = usePlayerStore();

  console.log('The players', players);

  const lastPlayer = players[players.length - 1];

  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] =
    useState<boolean>(false);

  if (!club || isLoading) return <Loader />;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Header */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <Image
                src={club?.logo as string}
                alt={club?.name}
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

            <SeasonSelector />

            {/* { add a user profile icon with a dropdown menu to logout and user settings} */}
            <UserDropdown />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-8'>
        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                <Users className='w-6 h-6 text-primary' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Total Players</div>
                <div className='text-2xl font-bold'>{players?.length}</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-50 rounded-full flex items-center justify-center'>
                <Trophy className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Active Tournaments</div>
                <div className='text-2xl font-bold'>3</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Upcoming Matches</div>
                <div className='text-2xl font-bold'>5</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-yellow-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Training Hours</div>
                <div className='text-2xl font-bold'>24.5</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          {/* Recent Activity */}
          <Card className='lg:col-span-2'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-bold'>Recent Activity</h2>
                <button className='text-gray-400 hover:text-gray-600'>
                  <MoreHorizontal className='w-5 h-5' />
                </button>
              </div>

              <div className='space-y-4'>
                {/* Activity Items */}
                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                    <Trophy className='w-5 h-5 text-primary' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>Tournament Registration</div>
                    <div className='text-sm text-gray-600'>
                      Registered for East Africa Youth Cup 2024
                    </div>
                  </div>
                  <div className='text-sm text-gray-500'>2h ago</div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 bg-green-50 rounded-full flex items-center justify-center'>
                    <Users className='w-5 h-5 text-green-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>New Player Added</div>
                    <div className='text-sm text-gray-600'>
                      {lastPlayer?.first_name} {lastPlayer?.last_name} joined the {lastPlayer?.name} team
                    </div>
                  </div>
                  {lastPlayer?.created_at && <div className='text-sm text-gray-500'>{timeElapsed(lastPlayer?.created_at)}</div>}
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className='p-6'>
              <h2 className='text-lg font-bold mb-6'>Quick Actions</h2>
              <div className='space-y-3'>
                <button
                  onClick={() => setIsCreatePlayerModalOpen(true)}
                  className='w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2'
                >
                  <Users size={20} />
                  Add New Player
                </button>
                <button className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'>
                  <Trophy size={20} />
                  View Tournaments
                </button>
                <button className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'>
                  <FileText size={20} />
                  Generate Report
                </button>
              </div>
            </div>
          </Card>
        </div>

        {club && <PlayersTable />}
      </div>
      <CreatePlayerModal
        isOpen={isCreatePlayerModalOpen}
        onClose={() => setIsCreatePlayerModalOpen(false)}
      />
    </div>
  );
};

export default ClubDashboard;
