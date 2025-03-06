'use client';

import React, { useEffect } from 'react';
import Card from '@/app/components/ui/Card';
import {
  Users,
  Trophy,
  Calendar,
  Clock,
  MoreHorizontal,
  FileText,
  Shield,
  UserRoundPlus,
  PlusCircle
} from 'lucide-react';
import Image from 'next/image';

import { UserDropdown } from '@/app/components/UserDropdown';
import { SeasonSelector } from '@/app/components/clubs/ClubSeasonSelector';
import { Column, DataTable } from '@/app/components/ui/Table';
import { Team } from '@/app/types';
import Loader from '@/app/components/Loader';
import { useParams, useRouter } from 'next/navigation';
import { useTournamentStore } from '@/app/store/tournament';
//import { timeElapsed } from '@/app/utils/timePassed';

// Define types for the tournament
interface Category {
  id: number;
  name: string;
}

interface TeamRegistration {
  id: number;
  club_id: number;
  club_name: string;
  club_logo: string;
  categories: {
    [categoryId: number]: {
      team_count: number;
      teams: Team[];
    }
  };
  total_teams: number;
}

interface FieldCoordinator {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo?: string;
}

interface FieldCoordinators {
  coordinators: FieldCoordinator[]
}

interface TeamsRegisrationTableProps {
  registrations: TeamRegistration[]
  categories: Category[]
}

// Component for the teams registration table
const TeamsRegistrationTable = ({ registrations, categories }: TeamsRegisrationTableProps) => {
  const router = useRouter();
  
  // Create dynamic columns based on available categories
  const generateColumns = (): Column<TeamRegistration>[] => {
    const baseColumns: Column<TeamRegistration>[] = [
      {
        key: 'club_logo',
        title: 'Club',
        render: () => (
          <div className="flex items-center gap-3">
            <Image
              src={'/logos/logo.png'}
              alt={''}
              width={40}
              height={40}
              className='h-10 w-10 rounded-full object-cover'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/logos/logo.png';
              }}
            />
            <span className="font-medium">{row.club_name}</span>
          </div>
        ),
        width: '220px',
      }
    ];
    
    // Add a column for each category
    categories.forEach(category => {
      baseColumns.push({
        key: `categories.${category.id}.team_count`,
        title: category.name,
        render: (row: TeamRegistration) => 
          row.categories[category.id]?.team_count || 0,
        width: '100px',
        align: 'center'
      });
    });
    
    // Add total teams column
    baseColumns.push({
      key: 'total_teams',
      title: 'Total Teams',
      width: '100px',
      //align: 'center',
      sortable: true,
    });
    
    return baseColumns;
  };

  const columns = generateColumns();

  const actions = [
    {
      label: 'View Teams',
      onClick: (registration: TeamRegistration) => {
        router.push(`/dashboard/tournament/club/${registration.club_id}`);
      },
    },
    {
      label: 'Edit Registration',
      onClick: (registration: TeamRegistration) => 
        console.log('Edit Registration', registration.club_id),
    }
  ];

  if (!registrations || !registrations.length)
    return (
      <div className='mt-8'>
        <h2 className='text-lg font-bold'>No clubs registered yet</h2>
      </div>
    );

  return (
    <DataTable
      data={registrations}
      columns={columns}
      actions={actions}
      title='Registered Clubs'
      loading={false}
      searchPlaceholder='Search clubs...'
      onSearch={(term) => console.log('Search:', term)}
      className='mt-8'
    />
  );
};

// Field Coordinator List Component
const FieldCoordinatorsList = ({ coordinators }: FieldCoordinators) => {
  return (
    <div className="space-y-4 mt-4">
      {coordinators && coordinators.length > 0 ? (
        coordinators.map(coordinator => (
          <div key={coordinator.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 overflow-hidden rounded-full">
              <Image
                src={coordinator.photo || '/images/user.png'}
                alt={coordinator.name}
                width={40}
                height={40}
                className="h-10 w-10 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/user.png';
                }}
              />
            </div>
            <div className="flex-1">
              <div className="font-medium">{coordinator.name}</div>
              <div className="text-sm text-gray-600">{coordinator.email} • {coordinator.phone}</div>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">
          No field coordinators assigned yet
        </div>
      )}
    </div>
  );
};

// Main Tournament Dashboard Component
const TournamentPage = () => {
  const { currentTournament, viewTournament, isLoading } = useTournamentStore();
  //const [isAddCoordinatorModalOpen, setIsAddCoordinatorModalOpen] = useState<boolean>(false);
  //const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState<boolean>(false);

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    viewTournament(Number(id));
  }, [id, viewTournament]);

  const tournament = currentTournament;

  console.log('the current tournament', tournament);

  // Mock data for demonstration
  const categories = [
    { id: 1, name: 'U10' },
    { id: 2, name: 'U12' },
    { id: 3, name: 'U14' },
    { id: 4, name: 'U16' },
  ];

  const registrations = [
    {
      id: 1,
      club_id: 101,
      club_name: 'Nairobi Lions FC',
      club_logo: '/logos/logo.png',
      categories: {
        1: { team_count: 2, teams: [] },
        2: { team_count: 1, teams: [] },
        3: { team_count: 1, teams: [] },
        4: { team_count: 0, teams: [] },
      },
      total_teams: 4
    },
    {
      id: 2,
      club_id: 102,
      club_name: 'Mombasa Sharks',
      club_logo: '/logos/logo.png',
      categories: {
        1: { team_count: 1, teams: [] },
        2: { team_count: 2, teams: [] },
        3: { team_count: 1, teams: [] },
        4: { team_count: 1, teams: [] },
      },
      total_teams: 5
    },
    {
      id: 3,
      club_id: 103,
      club_name: 'Kisumu Lakers',
      club_logo: '/logos/logo.png',
      categories: {
        1: { team_count: 0, teams: [] },
        2: { team_count: 1, teams: [] },
        3: { team_count: 2, teams: [] },
        4: { team_count: 1, teams: [] },
      },
      total_teams: 4
    }
  ];

  const coordinators = [
    {
      id: 1,
      name: 'John Kamau',
      email: 'john.kamau@example.com',
      phone: '+254 712 345 678',
      photo: '/images/user.png'
    },
    {
      id: 2,
      name: 'Mary Wanjiku',
      email: 'mary.wanjiku@example.com',
      phone: '+254 723 456 789',
      photo: '/images/user.png'
    }
  ];

  // Calculate tournament statistics
  const totalClubs = registrations.length;
  const totalTeams = registrations.reduce((sum, reg) => sum + reg.total_teams, 0);
  const totalMatches = Math.floor(totalTeams * 1.5); // Just a mock calculation
  const totalVenues = 3; // Mock data

  if (!tournament || isLoading) return <Loader />;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Top Header */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center'>
                <Trophy className='w-6 h-6 text-primary' />
              </div>
              <div>
                <h1 className='text-xl font-bold'>{'East Africa Youth Cup 2024'}</h1>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span>{tournament?.city || 'Nairobi, Kenya'}</span>
                  <span>•</span>
                  <span>{'Aug 10 - Aug 17, 2024'}</span>
                </div>
              </div>
            </div>

            <SeasonSelector />

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
                <Shield className='w-6 h-6 text-primary' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Registered Clubs</div>
                <div className='text-2xl font-bold'>{totalClubs}</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-50 rounded-full flex items-center justify-center'>
                <Users className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Total Teams</div>
                <div className='text-2xl font-bold'>{totalTeams}</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center'>
                <Calendar className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Matches Scheduled</div>
                <div className='text-2xl font-bold'>{totalMatches}</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center'>
                <Clock className='w-6 h-6 text-yellow-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Venues</div>
                <div className='text-2xl font-bold'>{totalVenues}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8'>
          {/* Tournament Status */}
          <Card className='lg:col-span-2'>
            <div className='p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-lg font-bold'>Tournament Status</h2>
                <button className='text-gray-400 hover:text-gray-600'>
                  <MoreHorizontal className='w-5 h-5' />
                </button>
              </div>

              <div className='space-y-4'>
                {/* Status Items */}
                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center'>
                    <Calendar className='w-5 h-5 text-primary' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>Registration Phase</div>
                    <div className='text-sm text-gray-600'>
                      Registration closes in 5 days
                    </div>
                  </div>
                  <div className='text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full'>
                    Active
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center'>
                    <FileText className='w-5 h-5 text-yellow-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>Schedule Creation</div>
                    <div className='text-sm text-gray-600'>
                      Create match schedule for all age categories
                    </div>
                  </div>
                  <div className='text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full'>
                    Pending
                  </div>
                </div>

                <div className='flex items-center gap-4 p-4 bg-gray-50 rounded-lg'>
                  <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                    <Trophy className='w-5 h-5 text-gray-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='font-medium'>Tournament Start</div>
                    <div className='text-sm text-gray-600'>
                      Starts on {tournament?.start_date || 'Aug 10, 2024'}
                    </div>
                  </div>
                  <div className='text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-full'>
                    Upcoming
                  </div>
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
                  //onClick={() => setIsCreateScheduleModalOpen(true)}
                  className='w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2'
                >
                  <Calendar size={20} />
                  Create Tournament Schedule
                </button>
                <button 
                  //onClick={() => setIsAddCoordinatorModalOpen(true)}
                  className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'
                >
                  <UserRoundPlus size={20} />
                  Add Field Coordinator
                </button>
                <button className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'>
                  <FileText size={20} />
                  Generate Tournament Report
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Field Coordinators */}
        <Card className="mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Field Coordinators</h2>
              <button 
                //onClick={() => setIsAddCoordinatorModalOpen(true)}
                className="flex items-center gap-1 text-primary hover:text-primary/80"
              >
                <PlusCircle size={18} />
                <span>Add Coordinator</span>
              </button>
            </div>
            <FieldCoordinatorsList coordinators={coordinators} />
          </div>
        </Card>

        {/* Registered Teams Table */}
        <TeamsRegistrationTable 
          registrations={registrations} 
          categories={categories} 
        />
      </div>
      
      {/* Modals would be imported and included here */}
      {/* Modal for adding field coordinator */}
      {/* <AddCoordinatorModal
        isOpen={isAddCoordinatorModalOpen}
        onClose={() => setIsAddCoordinatorModalOpen(false)}
      /> */}
      
      {/* Modal for creating schedule */}
      {/* <CreateScheduleModal
        isOpen={isCreateScheduleModalOpen}
        onClose={() => setIsCreateScheduleModalOpen(false)}
        tournamentId={Number(id)}
        categories={categories}
      /> */}
    </div>
  );
};

export default TournamentPage;