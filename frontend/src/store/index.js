import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      
      setAuth: (data) => set({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
      }),
      
      updateUser: (userData) => set((state) => ({
        user: { ...state.user, ...userData }
      })),
      
      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  loading: false,
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading }),
}));

export const useCreditsStore = create((set) => ({
  credits: {
    total: 0,
    used: 0,
    remaining: 0,
  },
  
  setCredits: (credits) => set({ credits }),
  
  deductCredits: (amount) => set((state) => ({
    credits: {
      ...state.credits,
      used: state.credits.used + amount,
      remaining: state.credits.remaining - amount,
    }
  })),
}));
