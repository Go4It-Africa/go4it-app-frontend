import React, { useEffect, useMemo, useState } from 'react';
import { Search, Check } from 'lucide-react';
import { Modal } from '@/app/components/ui/Modal';
import { Dropdown } from '@/app/components/ui/Dropdown';
import { DataTable, Column } from '@/app/components/ui/Table';
import { Team, Player } from '@/app/types';
import { usePlayerStore } from '@/app/store/player';
import { useTournamentStore } from '@/app/store/tournament';

interface AssignPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentId: number;
  teams: Team[];
  clubId: number;
}

interface PlayerTableItem extends Pick<Player, 'id' | 'first_name' | 'last_name' | 'category' | 'gender'> {
  id: number;
}

export const AssignPlayerModal = ({
  isOpen,
  onClose,
  tournamentId,
  teams,
  clubId,
}: AssignPlayerModalProps) => {
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');

  const { players, fetchPlayers } = usePlayerStore();
  const { assignPlayersToTeam} = useTournamentStore();

  console.log('THE PLAYERS', players);

  players.map(player => {
    player.category = player.name as string;
  });

  useEffect(() => {
    fetchPlayers(clubId);
  }, [fetchPlayers, clubId]);

  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTeam(null);
      setSelectedPlayers([]);
      setCategoryFilter('');
      setGenderFilter('');
    }
  }, [isOpen]);

  const handleAssignPlayers = async () => {
    if (!selectedTeam || selectedPlayers.length === 0) return;
    
    try {
      // TODO: Implement the API call to assign players to team
      console.log('Assigning players:', selectedPlayers, 'to team:', selectedTeam.id);
      assignPlayersToTeam(selectedPlayers, selectedTeam.id, tournamentId);
      //onClose();
    } catch (error) {
      console.error('Error assigning players:', error);
    }
  };

  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      if (categoryFilter && player.category !== categoryFilter) return false;
      if (genderFilter && player.gender !== genderFilter) return false;
      return true;
    });
  }, [categoryFilter, genderFilter, players]);

  const columns: Column<PlayerTableItem>[] = [
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
      key: 'category',
      title: 'Category',
      sortable: true,
    },
    {
      key: 'gender',
      title: 'Gender',
      sortable: true,
      render: (value) => value === 'male' ? 'Male' : 'Female',
    },
  ];

  const handleSelectAll = () => {
    if (selectedPlayers.length === filteredPlayers.length) {
      setSelectedPlayers([]);
    } else {
      setSelectedPlayers(filteredPlayers.map(p => p.id));
    }
  };

  const dropdownTriggerClasses = 'w-full border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer';
  const dropdownContentClasses = 'px-4 py-2 text-left flex items-center text-gray-700';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title='Assign Players to Team' size="xl">
      <div className='space-y-6'>
        <div className='flex'>
            {/* Team Selection */}
            <div className=''>
                <label className='block text-sm font-medium text-gray-700'>
                    Team
                </label>
                <Dropdown
                    trigger={
                    <div className={dropdownTriggerClasses}>
                        <div className={dropdownContentClasses}>
                        {selectedTeam ? selectedTeam.name : 'Select Team'}
                        </div>
                    </div>
                    }
                    className='w-full'
                >
                    {teams.map((team) => (
                        console.log('THE TEAM NOW:', team),
                    <button
                        key={team.id}
                        onClick={() => setSelectedTeam(team)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between'
                    >
                        <span>{team.name} - {team.category.name} - {team.gender}</span>
                        {selectedTeam?.id === team.id && (
                        <Check className='w-4 h-4 text-primary' />
                        )}
                    </button>
                    ))}
                </Dropdown>
            </div>

            {/* Filters */}
            <div className='flex gap-4 ml-auto'>
                <div className='flex-1 space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                    Category
                    </label>
                    <Dropdown
                    trigger={
                        <div className={dropdownTriggerClasses}>
                        <div className={dropdownContentClasses}>
                            {categoryFilter || 'All Categories'}
                        </div>
                        </div>
                    }
                    className='w-full'
                    >
                    <button
                        onClick={() => setCategoryFilter('')}
                        className='w-full px-4 py-2 text-left hover:bg-gray-100'
                    >
                        All Categories
                    </button>
                    {['U7', 'U9', 'U11', 'U13', 'U15', 'U17'].map((category) => (
                        <button
                        key={category}
                        onClick={() => setCategoryFilter(category)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between'
                        >
                        <span>{category}</span>
                        {categoryFilter === category && (
                            <Check className='w-4 h-4 text-primary' />
                        )}
                        </button>
                    ))}
                    </Dropdown>
                </div>

                <div className='flex-1 space-y-2'>
                    <label className='block text-sm font-medium text-gray-700'>
                    Gender
                    </label>
                    <Dropdown
                    trigger={
                        <div className={dropdownTriggerClasses}>
                        <div className={dropdownContentClasses}>
                            {genderFilter ? (genderFilter === 'male' ? 'Male' : 'Female') : 'All Genders'}
                        </div>
                        </div>
                    }
                    className='w-full'
                    >
                    <button
                        onClick={() => setGenderFilter('')}
                        className='w-full px-4 py-2 text-left hover:bg-gray-100'
                    >
                        All Genders
                    </button>
                    {['male', 'female'].map((gender) => (
                        <button
                        key={gender}
                        onClick={() => setGenderFilter(gender)}
                        className='w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between'
                        >
                        <span>{gender === 'male' ? 'Male' : 'Female'}</span>
                        {genderFilter === gender && (
                            <Check className='w-4 h-4 text-primary' />
                        )}
                        </button>
                    ))}
                    </Dropdown>
                </div>
            </div>
        </div>
        

        {/* Players Table */}
        <div className='border rounded-lg'>
          <div className='p-4 border-b bg-gray-50 flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <button
                onClick={handleSelectAll}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedPlayers.length === filteredPlayers.length
                    ? 'bg-primary text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {selectedPlayers.length === filteredPlayers.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className='text-sm text-gray-600'>
                {selectedPlayers.length} players selected
              </span>
            </div>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={20} />
              <input
                type='text'
                placeholder='Search players...'
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent'
              />
            </div>
          </div>

          <DataTable
            data={filteredPlayers}
            columns={columns}
            className='rounded-none border-none shadow-none'
            actions={[
              {
                label: 'Select',
                onClick: (player: PlayerTableItem) => {
                  setSelectedPlayers(prev => 
                    prev.includes(player.id)
                      ? prev.filter(id => id !== player.id)
                      : [...prev, player.id]
                  );
                },
              },
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 pt-4 border-t'>
          <button
            onClick={onClose}
            className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={handleAssignPlayers}
            disabled={!selectedTeam || selectedPlayers.length === 0}
            className={`px-4 py-2 rounded-lg text-white ${
              !selectedTeam || selectedPlayers.length === 0
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            Assign Players
          </button>
        </div>
      </div>
    </Modal>
  );
};
