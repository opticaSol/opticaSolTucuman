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

      // Se puede comprar aunque no haya stock (se pide al proveedor), así que la
      // cantidad en el carrito ya no se limita al stock disponible.
      addItem: (product, qty = 1) => {
        const items = get().items;
        const existing = items.find((i) => i._id === product._id);

        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id ? { ...i, qty: i.qty + qty } : i
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
                stock: product.stock,
                qty,
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
            i._id === id ? { ...i, qty: Math.max(1, qty) } : i
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
