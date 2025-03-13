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
  Shield,
  UserRoundPlus,
  PlusCircle
} from 'lucide-react';
import Image from 'next/image';

import { UserDropdown } from '@/app/components/UserDropdown';
import { SeasonSelector } from '@/app/components/clubs/ClubSeasonSelector';
import { Column, DataTable } from '@/app/components/ui/Table';
import { Player, Team } from '@/app/types';
import Loader from '@/app/components/Loader';
import { useParams, useRouter } from 'next/navigation';
import { useTournamentStore } from '@/app/store/tournament';
import { useSession } from 'next-auth/react';
import { useClubStore } from '@/app/store/club';
import { DateTime } from 'luxon';
import { timeElapsed } from '@/app/utils/timePassed';
import { capitalize } from '@/app/utils/capitalize';
import { AssignPlayerModal } from '@/app/components/players/AssignPlayerModal';
import { usePlayerStore } from '@/app/store/player';

// Define types for the tournament
// interface Category {
//   id: number;
//   name: string;
// }

// interface TeamRegistration {
//   id: number;
//   club_id: number;
//   club_name: string;
//   club_logo: string;
//   categories: {
//     [categoryId: number]: {
//       team_count: number;
//       teams: Team[];
//     }
//   };
//   total_teams: number;
// }

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

// interface TeamsRegisrationTableProps {
//   registrations: TeamRegistration[]
//   categories: Category[]
// }

// Component for the teams registration table
// const TeamsRegistrationTable = ({ registrations, categories }: TeamsRegisrationTableProps) => {
//   const router = useRouter();
  
//   // Create dynamic columns based on available categories
//   const generateColumns = (): Column<TeamRegistration>[] => {
//     const baseColumns: Column<TeamRegistration>[] = [
//       {
//         key: 'club_logo',
//         title: 'Club',
//         render: () => (
//           <div className="flex items-center gap-3">
//             <Image
//               src={'/logos/logo.png'}
//               alt={''}
//               width={40}
//               height={40}
//               className='h-10 w-10 rounded-full object-cover'
//               onError={(e) => {
//                 const target = e.target as HTMLImageElement;
//                 target.src = '/logos/logo.png';
//               }}
//             />
//             <span className="font-medium">{row.club_name}</span>
//           </div>
//         ),
//         width: '220px',
//       }
//     ];
    
//     // Add a column for each category
//     categories.forEach(category => {
//       baseColumns.push({
//         key: `categories.${category.id}.team_count`,
//         title: category.name,
//         render: (row: TeamRegistration) => 
//           row.categories[category.id]?.team_count || 0,
//         width: '100px',
//         align: 'center'
//       });
//     });
    
//     // Add total teams column
//     baseColumns.push({
//       key: 'total_teams',
//       title: 'Total Teams',
//       width: '100px',
//       //align: 'center',
//       sortable: true,
//     });
    
//     return baseColumns;
//   };

//   const columns = generateColumns();

//   const actions = [
//     {
//       label: 'View Teams',
//       onClick: (registration: TeamRegistration) => {
//         router.push(`/dashboard/tournament/club/${registration.club_id}`);
//       },
//     },
//     {
//       label: 'Edit Registration',
//       onClick: (registration: TeamRegistration) => 
//         console.log('Edit Registration', registration.club_id),
//     }
//   ];

//   if (!registrations || !registrations.length)
//     return (
//       <div className='mt-8'>
//         <h2 className='text-lg font-bold'>No clubs registered yet</h2>
//       </div>
//     );

//   return (
//     <DataTable
//       data={registrations}
//       columns={columns}
//       actions={actions}
//       title='Registered Clubs'
//       loading={false}
//       searchPlaceholder='Search clubs...'
//       onSearch={(term) => console.log('Search:', term)}
//       className='mt-8'
//     />
//   );
// };

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

const PlayersTable = ( { tournamentId, clubId }: { tournamentId: number, clubId: number } ) => {
  const { tournamentTeamPlayers, viewTournamentTeamPlayers } = usePlayerStore();

  useEffect(() => {
    viewTournamentTeamPlayers(tournamentId, clubId);
  }, [clubId, viewTournamentTeamPlayers, tournamentId]);

  const router = useRouter();
  const players = tournamentTeamPlayers;

  console.log('the players tournament team', players);

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
      key: 'name',
      title: 'Category',
      sortable: true,
    },
    // {
    //   key: 'team_name',
    //   title: 'Team',
    //   sortable: true,
    // }
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

const TeamsTable = ( { teams }: { teams: Team[] }) => {

  const teamsWithCategoryName = teams.map((team) => {
    if (typeof team.category === 'string') {
      return team;
    }
    return {
      ...team,
      category_name: team.category.name
    };
  });

  const columns: Column<Team>[] = [
    {
      key: 'name',
      title: 'Team Name',
      sortable: true,
    },
    {
      key: 'category_name',
      title: 'Category',
      sortable: true,
    },
    {
      key: 'gender',
      title: 'Gender',
      sortable: true,
    },
    // {
    //   key: 'contact_person',
    //   title: 'Contact Person',
    //   sortable: true,
    // },
    // {
    //   key: 'contact_person_email',
    //   title: 'Contact Person Email',
    //   sortable: true,
    // }
  ];

  const actions = [
    {
      label: 'Delete',
      onClick: (team: Team) => console.log('Delete', team.id),
      danger: true,
    },
  ];

  if (teams && !teams.length)
    return (
      <div className='mt-8'>
        <h2 className='text-lg font-bold'>No teams found</h2>
      </div>
    );

  return (
    <DataTable
      data={teamsWithCategoryName} // Your player data here
      columns={columns}
      actions={actions}
      title='Teams'
      loading={false}
      className='mt-8'
    />
  );
};

// Main Tournament Dashboard Component
const TournamentPage = () => {
  const { currentTournament, viewTournament, isLoading, getRegisteredTournamentsByClubId, registeredTournaments } = useTournamentStore();

  const router = useRouter();
  const { currentClub } = useClubStore();
  
  
  //const [isAddCoordinatorModalOpen, setIsAddCoordinatorModalOpen] = useState<boolean>(false);
  //const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] = useState<boolean>(false);
  const [isAssignPlayerModalOpen, setIsAssignPlayerModalOpen] = useState<boolean>(false);

  const { data: session } = useSession();

  const sessionRole = session?.user?.role;
  
  useEffect(() => {
    if(sessionRole === 'club_admin') {
      if(!currentClub?.id) {
        router.push('/workspace/clubs');
      }
    }
  }, [currentClub, router, sessionRole]);

  const params = useParams();
  const id = params.id;

  console.log('the id in params', currentClub?.id);

  useEffect(() => {
    if (sessionRole === 'tournament_organizer') {
      viewTournament(Number(id));
    }
    if (sessionRole === 'club_admin') {
      getRegisteredTournamentsByClubId(Number(currentClub?.id));
    }
  }, [id, viewTournament, sessionRole, getRegisteredTournamentsByClubId, currentClub]);

  const tournament = session?.user?.role === 'tournament_organizer' ? currentTournament : registeredTournaments[0];

  console.log('the current tournament', registeredTournaments);

  // Mock data for demonstration
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
  const totalClubs = sessionRole === 'tournament_organizer' ? registrations.length : null;
  const totalTeams = sessionRole === 'tournament_organizer' ? registrations.reduce((sum, reg) => sum + reg.total_teams, 0) : tournament?.teams.length;
  //const totalMatches = sessionRole === 'tournament_organizer' ? Math.floor(totalTeams * 1.5) : null; // Just a mock calculation
  const totalVenues = sessionRole === 'tournament_organizer' ? 3 : null; // Mock data
  const totalPlayers = 0


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
                <h1 className='text-xl font-bold'>{tournament?.tournament_name}</h1>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <span>{`${tournament?.city}, ${tournament?.country}`}</span>
                  <span>•</span>
                  <span>{`${DateTime.fromISO(tournament?.start_date).toLocaleString(DateTime.DATE_MED)} - ${DateTime.fromISO(tournament?.end_date).toLocaleString(DateTime.DATE_MED)}`}</span>
                </div>
              </div>
            </div>

            {sessionRole === 'tournament_organizer' && <SeasonSelector />}

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
                <div className='text-sm text-gray-600'>Registered {sessionRole === 'tournament_organizer' ? 'Clubs' : 'Teams'}</div>
                <div className='text-2xl font-bold'>{sessionRole === 'tournament_organizer' ? totalClubs : totalTeams}</div>
              </div>
            </div>
          </Card>

          <Card className='p-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 bg-green-50 rounded-full flex items-center justify-center'>
                <Users className='w-6 h-6 text-green-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Registered {sessionRole === 'tournament_organizer' ? 'Teams' : 'Players'}</div>
                <div className='text-2xl font-bold'>{sessionRole === 'tournament_organizer' ? totalTeams : totalPlayers}</div>
              </div>
            </div>
          </Card>

          {sessionRole === 'tournament_organizer' && (
            <Card className='p-6'>
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center'>
                  <Calendar className='w-6 h-6 text-blue-600' />
              </div>
              <div>
                <div className='text-sm text-gray-600'>Matches Scheduled</div>
                {/* <div className='text-2xl font-bold'>{totalMatches}</div> */}
              </div>
              </div>
            </Card>
          )}

          {sessionRole === 'tournament_organizer' && (
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
          )}
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
                      Registration closes on {timeElapsed(tournament?.registration_deadline)}
                    </div>
                  </div>
                  <div className='text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full'>
                    {capitalize(tournament?.status || '')}
                  </div>
                </div>

                {sessionRole === 'tournament_organizer' && (
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
                )}

                {sessionRole === 'tournament_organizer' && (
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
                )}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card>
            <div className='p-6'>
              <h2 className='text-lg font-bold mb-6'>Quick Actions</h2>
              <div className='space-y-3'>
                {sessionRole === 'tournament_organizer' && (
                  <button
                    //onClick={() => setIsCreateScheduleModalOpen(true)}
                    className='w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2'
                  >
                  <Calendar size={20} />
                  Create Tournament Schedule
                </button>
                )}
                {sessionRole === 'tournament_organizer' && (
                <button 
                  //onClick={() => setIsAddCoordinatorModalOpen(true)}
                  className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'
                >
                  <UserRoundPlus size={20} />
                  Add Field Coordinator
                </button>
                )}
                {sessionRole=== 'tournament_organizer' && (<button className='w-full bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50'>
                  <FileText size={20} />
                  Generate Tournament Report
                </button>
                )}
                {sessionRole === 'club_admin' && (
                <button 
                  onClick={() => setIsAssignPlayerModalOpen(true)}
                  className='w-full bg-primary border border-gray-200 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2'
                >
                  <UserRoundPlus size={20} />
                  Assign Player to Team
                </button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Field Coordinators */}
        {sessionRole === 'tournament_organizer' && (
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
        )}

        {/* Registered Teams Table */}
        {/* {session?.user?.role === 'tournament_organizer' && (
          <TeamsRegistrationTable 
            registrations={registrations} 
            categories={categories} 
          />
        )} */}

        {session?.user?.role === 'club_admin' && (
          <>
            <PlayersTable tournamentId={Number(id)} clubId={Number(currentClub?.id)} />
            <TeamsTable teams={tournament?.teams} />

            <AssignPlayerModal
              isOpen={isAssignPlayerModalOpen}
              onClose={() => setIsAssignPlayerModalOpen(false)}
              tournamentId={Number(id)}
              teams={tournament?.teams}
              clubId={Number(currentClub?.id)}
            />
          </>
        )}
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