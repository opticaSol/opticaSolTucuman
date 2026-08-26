import Swal from 'sweetalert2';
import { formatPrice } from '../../lib/formatters';
import { useCartStore } from '../../store/useCartStore';

export default function CartItem({ item }) {
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  async function handleRemove() {
    const result = await Swal.fire({
      title: '¿Quitar producto?',
      text: item.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Quitar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      cancelButtonColor: '#0D0D0D',
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    if (result.isConfirmed) {
      removeItem(item._id);
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-sol-blanco/10">
      <img
        src={item.imagen}
        alt={item.nombre}
        className="w-20 h-20 rounded-lg object-cover bg-sol-blanco/5"
      />
      <div className="flex-1 min-w-0">
        <p className="font-display font-bold truncate">{item.nombre}</p>
        <p className="text-sm text-sol-blanco/60">{formatPrice(item.precio)}</p>

        <div className="mt-2 flex items-center gap-2">
          <button
            onClick={() => updateQty(item._id, item.qty - 1)}
            className="w-7 h-7 rounded-full border border-sol-blanco/20 hover:border-sol-amarillo"
          >
            −
          </button>
          <span className="w-6 text-center">{item.qty}</span>
          <button
            onClick={() => updateQty(item._id, item.qty + 1)}
            disabled={item.qty >= item.stock}
            className="w-7 h-7 rounded-full border border-sol-blanco/20 hover:border-sol-amarillo disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      <div className="text-right flex flex-col items-end gap-2">
        <span className="font-display font-bold">{formatPrice(item.precio * item.qty)}</span>
        <button
          onClick={handleRemove}
          className="text-xs text-sol-rojo hover:underline"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}
