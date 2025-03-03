import { create } from 'zustand';
import { Player } from '../types';
import axios from 'axios';

export type PlayerState = {
    players: Player[];
    currentPlayer: Player | null;
    isLoading: boolean;
    error: string | null;
}

export type PlayerActions = {
    fetchPlayers: (clubId?: number) => void;
    viewPlayer: (player: Player) => void;
    addPlayer: (player: Player) => void;
    updatePlayer: (playerId: number, playerData: Partial<Player>) => void;
    deletePlayer: (playerId: number) => void;
}

export const usePlayerStore = create<PlayerState & PlayerActions>((set, get) => ({
  players: [],
  currentPlayer: null,
  isLoading: false,
  error: null,
  viewPlayer: (player: Player) => {
    set({ isLoading: true, error: null });
    const currentPlayer = get().players.find((p) => p.id === player.id);

    if(currentPlayer) {
      set({ currentPlayer, isLoading: false });
    } else {
      set({ isLoading: false, error: 'Player not found' });
    }
  },
  fetchPlayers: async (clubId?: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = clubId ? await axios.get(`/api/players?club_id=${clubId}`) : await axios.get('/api/players');
      set({ players: response.data.data, isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch players',
        });
    }
  },
  addPlayer: async (playerData: Player) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/players', playerData);
      const newPlayer = response.data.data;

      set((state) => ({ players: [...state.players, newPlayer], isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add player',
        });
    }
  },
  updatePlayer: async (playerId: number, playerData: Partial<Player>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/players/${playerId}`, playerData);
      const updatedPlayer = response.data;
      set((state) => ({ players: state.players.map((p) => p.id === playerId ? updatedPlayer : p), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update player',
        });
    }
  },
  deletePlayer: async (playerId: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/players/${playerId}`);
      set((state) => ({ players: state.players.filter((p) => p.id !== playerId), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete player',
        });
    }
  }
}));
