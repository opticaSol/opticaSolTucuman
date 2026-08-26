import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function priceOf(product) {
  return product.precioDescuento && product.precioDescuento < product.precio
    ? product.precioDescuento
    : product.precio;
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i._id === product._id);
        const stock = product.stock ?? Infinity;

        if (existing) {
          const nextQty = Math.min(existing.qty + qty, stock);
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, qty: nextQty } : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                _id: product._id,
                nombre: product.nombre,
                imagen: product.imagenes?.[0],
                precio: priceOf(product),
                stock,
                qty: Math.min(qty, stock),
              },
            ],
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) });
      },

      updateQty: (id, qty) => {
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.qty * i.precio, 0),
    }),
    { name: 'opticasol-cart' }
  )
);
