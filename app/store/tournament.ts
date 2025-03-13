import { create } from 'zustand';
import { Tournament } from '../types';
import axios from 'axios';

export type TournamentState = {
    registeredTournaments: Tournament[];
    tournaments: Tournament[];
    currentTournament: Tournament | null;
    isLoading: boolean;
    error: string | null;
}

export type TournamentActions = {
    fetchTournaments: () => void;
    viewTournament: (tournamentId: number) => void;
    addTournament: (tournament: Tournament) => void;
    updateTournament: (tournamentId: number, tournamentData: Partial<Tournament>) => void;
    deleteTournament: (tournamentId: number) => void;
    registerTournament: (tournamentData: Partial<Tournament>) => void;
    getRegisteredTournamentsByClubId: (clubId: number) => void;
    assignPlayersToTeam: (players: number[], teamId: number, tournamentId: number) => void;
}

export const useTournamentStore = create<TournamentState & TournamentActions>((set) => ({
  tournaments: [],
  registeredTournaments: [],
  currentTournament: null,
  isLoading: false,
  error: null,
  viewTournament: async (tournamentId: number) => {
    set({ isLoading: true, error: null });
    //const currentClub = get().clubs.find((c) => c.id === clubId);
    try {
        const currentTournament = await axios.get(`/api/tournaments?id=${tournamentId}`);
        console.log('currentTournament store', currentTournament.data);
        set({ currentTournament: currentTournament.data, isLoading: false })
    } catch (error) {
        set({ isLoading: false, error: `Failed to fetch tournament: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  },
  fetchTournaments: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/tournaments');
      set({ tournaments: response.data.results, isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch tournaments',
        });
    }
  },
  addTournament: async (tournamentData: Tournament) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/tournaments', tournamentData);
      const newTournament = response.data.data;
      set((state) => ({ tournaments: [...state.tournaments, newTournament], isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add tournament',
        });
    }
  },
  updateTournament: async (tournamentId: number, tournamentData: Partial<Tournament>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/tournaments/${tournamentId}`, tournamentData);
      const updatedTournament = response.data;
      set((state) => ({ tournaments: state.tournaments.map((t) => t.id === tournamentId ? updatedTournament : t), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update tournament',
        });
    }
  },
  deleteTournament: async (tournamentId: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/tournaments/${tournamentId}`);
      set((state) => ({ tournaments: state.tournaments.filter((t) => t.id !== tournamentId), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete tournament',
        });
    }
  },
  getRegisteredTournamentsByClubId: async (clubId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`/api/tournaments/registered?clubId=${clubId}`);
      console.log('response from get registered tournaments by club id', response.data);
      set({ registeredTournaments: response.data.data, isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to get tournament by club id',
        });
    }
  },
  registerTournament: async(tournamentData: Partial<Tournament>) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/api/tournaments/registered', tournamentData);
      set({ isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add tournament',
        });
    }
  },
  assignPlayersToTeam: async (players: number[], teamId: number, tournamentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = {
        players,
        teamId,
        tournamentId
      }
      await axios.post(`/api/tournaments/assign-players-to-team`, data);
      set({ isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to assign players to team',
        });
    }
  }
}));
