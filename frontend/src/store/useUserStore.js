import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setSession: ({ user, token }) => set({ user, token }),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, token: null }),

      isAuthenticated: () => Boolean(get().token),
      isAdmin: () => ['admin', 'superadmin'].includes(get().user?.rol),
      isSuperAdmin: () => get().user?.rol === 'superadmin',
    }),
    { name: 'opticasol-user' }
  )
);
