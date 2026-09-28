import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Progreso de la tanda de envío de promo, persistido en localStorage para
// poder pausar y retomar (el dueño la usa desde su celular, en varias veces).
export const useEnvioStore = create(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: 0,
      sentIds: [],
      skippedIds: [],
      mensaje: '',

      hasActiveBatch: () => get().queue.length > 0 && get().currentIndex < get().queue.length,
      isFinished: () => get().queue.length > 0 && get().currentIndex >= get().queue.length,

      startBatch: (clients, mensaje) =>
        set({ queue: clients, currentIndex: 0, sentIds: [], skippedIds: [], mensaje }),

      markSent: (clientId) =>
        set((s) => ({ sentIds: [...s.sentIds, clientId], currentIndex: s.currentIndex + 1 })),

      markSkipped: (clientId) =>
        set((s) => ({ skippedIds: [...s.skippedIds, clientId], currentIndex: s.currentIndex + 1 })),

      reset: () => set({ queue: [], currentIndex: 0, sentIds: [], skippedIds: [], mensaje: '' }),
    }),
    { name: 'opticasol-envio-promo' }
  )
);
