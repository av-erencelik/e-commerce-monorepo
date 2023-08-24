import { create } from 'zustand';
import { UserPayload } from '@e-commerce-monorepo/global-types';

type AuthState = {
  user: UserPayload | null;
  login: (userData: UserPayload | null) => void;
  logout: () => void;
  setUserVerified: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: (userData) => set(() => ({ user: userData })),
  logout: () => set({ user: null }),
  setUserVerified: () =>
    set((state) => {
      if (state.user) {
        return {
          user: {
            ...state.user,
            verificated: true,
          },
        };
      }
      return state;
    }),
}));
