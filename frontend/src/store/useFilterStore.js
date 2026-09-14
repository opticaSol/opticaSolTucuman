import { create } from 'zustand';

const initialFilters = {
  categoria: '',
  genero: '',
  tipoContacto: '',
  tipoLenteRecetado: '',
  marca: '',
  colorArmazon: '',
  precioMin: '',
  precioMax: '',
  enPromocion: false,
  irrompible: false,
  q: '',
};

export const useFilterStore = create((set) => ({
  filters: { ...initialFilters },

  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),

  toggleFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: state.filters[key] === value ? '' : value,
      },
    })),

  resetFilters: () => set({ filters: { ...initialFilters } }),
}));
