import { create } from 'zustand';
import { Club } from '../types';
import axios from 'axios';

export type ClubState = {
    clubs: Club[];
    currentClub: Club | null;
    isLoading: boolean;
    error: string | null;
}

export type ClubActions = {
    fetchClubs: () => void;
    viewClub: (clubId: number) => void;
    addClub: (club: Club) => void;
    updateClub: (clubId: number, clubData: Partial<Club>) => void;
    deleteClub: (clubId: number) => void;
}

export const useClubStore = create<ClubState & ClubActions>((set) => ({
  clubs: [],
  currentClub: null,
  isLoading: false,
  error: null,
  viewClub: async (clubId: number) => {
    set({ isLoading: true, error: null });
    //const currentClub = get().clubs.find((c) => c.id === clubId);
    try {
        const currentClub = await axios.get(`/api/clubs?id=${clubId}`);

        const currentClubData = currentClub.data.club[0];

        set({ currentClub: currentClubData, isLoading: false })
    } catch (error) {
        set({ isLoading: false, error: `Failed to fetch club: ${error instanceof Error ? error.message : 'Unknown error'}` });
    }
  },
  fetchClubs: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/clubs');
      set({ clubs: response.data.clubs, isLoading: false });
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch clubs',
        });
    }
  },
  addClub: async (clubData: Club) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/api/clubs', clubData);
      const newClub = response.data.data;
      set((state) => ({ clubs: [...state.clubs, newClub], isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add club',
        });
    }
  },
  updateClub: async (clubId: number, clubData: Partial<Club>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.put(`/api/clubs/${clubId}`, clubData);
      const updatedClub = response.data;
      set((state) => ({ clubs: state.clubs.map((c) => c.id === clubId ? updatedClub : c), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update club',
        });
    }
  },
  deleteClub: async (clubId: number) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`/api/clubs/${clubId}`);
      set((state) => ({ clubs: state.clubs.filter((c) => c.id !== clubId), isLoading: false }));
    } catch(error) {
        set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete club',
        });
    }
  }
}));
