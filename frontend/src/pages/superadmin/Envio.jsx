import { useState } from 'react';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { useEnvioStore } from '../../store/useEnvioStore';
import { fetchClients, fetchPromoMessage, updateClient } from '../../lib/api';
import { buildWhatsAppLinkTo, fillPromoTemplate } from '../../lib/whatsapp';

export default function Envio() {
  const [starting, setStarting] = useState(false);
  const queue = useEnvioStore((s) => s.queue);
  const currentIndex = useEnvioStore((s) => s.currentIndex);
  const sentIds = useEnvioStore((s) => s.sentIds);
  const skippedIds = useEnvioStore((s) => s.skippedIds);
  const mensaje = useEnvioStore((s) => s.mensaje);
  const startBatch = useEnvioStore((s) => s.startBatch);
  const markSent = useEnvioStore((s) => s.markSent);
  const markSkipped = useEnvioStore((s) => s.markSkipped);
  const reset = useEnvioStore((s) => s.reset);

  const hasBatch = queue.length > 0;
  const isFinished = hasBatch && currentIndex >= queue.length;
  const current = hasBatch && !isFinished ? queue[currentIndex] : null;

  async function handleIniciar() {
    setStarting(true);
    try {
      const [clientsData, promoData] = await Promise.all([
        fetchClients({ all: true }),
        fetchPromoMessage(),
      ]);

      if (clientsData.items.length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No hay clientes para enviar',
          text: 'No tenés clientes cargados que acepten promos todavía.',
          background: '#0D0D0D',
          color: '#FFFFFF',
          confirmButtonColor: '#F5C518',
        });
        return;
      }

      startBatch(clientsData.items, promoData.texto);
    } finally {
      setStarting(false);
    }
  }

  async function handleEnviarYSiguiente() {
    const mensajeFinal = fillPromoTemplate(mensaje, current.nombre);
    window.open(buildWhatsAppLinkTo(current.whatsapp, mensajeFinal), '_blank', 'noopener,noreferrer');
    markSent(current._id);
    try {
      await updateClient(current._id, { ultimoContacto: new Date().toISOString() });
    } catch {
      // El mensaje ya se abrió; si falla el registro de fecha no hace falta avisar.
    }
  }

  function handleSaltar() {
    markSkipped(current._id);
  }

  async function handleNuevaTanda() {
    reset();
  }

  if (!hasBatch) {
    return (
      <div className="max-w-xl flex flex-col gap-6">
        <h1 className="font-display font-black text-2xl uppercase">Enviar promo</h1>
        <p className="text-sm text-sol-blanco/60">
          Se muestra un cliente por vez, con un botón grande para abrir WhatsApp ya con el
          mensaje listo. Cada mensaje se envía manualmente, un clic por vez, para no arriesgar
          el número.
        </p>
        <motion.button
          onClick={handleIniciar}
          disabled={starting}
          whileHover={{ scale: starting ? 1 : 1.02 }}
          whileTap={{ scale: starting ? 1 : 0.97 }}
          className="rounded-full bg-sol-rojo text-sol-blanco font-display font-bold py-4 disabled:opacity-50"
        >
          {starting ? 'Cargando clientes...' : 'Iniciar tanda'}
        </motion.button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-xl flex flex-col gap-6">
        <h1 className="font-display font-black text-2xl uppercase">Tanda terminada</h1>
        <div className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-6 flex flex-col gap-2">
          <p>
            Enviados: <strong className="text-sol-amarillo">{sentIds.length}</strong>
          </p>
          <p>
            Salteados: <strong className="text-sol-blanco/60">{skippedIds.length}</strong>
          </p>
        </div>
        <button
          onClick={handleNuevaTanda}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3"
        >
          Iniciar una tanda nueva
        </button>
      </div>
    );
  }

  const mensajeFinal = fillPromoTemplate(mensaje, current.nombre);

  return (
    <div className="max-w-xl flex flex-col gap-6">
      <h1 className="font-display font-black text-2xl uppercase">Enviar promo</h1>

      <div>
        <div className="h-2 rounded-full bg-sol-blanco/10 overflow-hidden">
          <div
            className="h-full bg-sol-amarillo transition-all"
            style={{ width: `${(currentIndex / queue.length) * 100}%` }}
          />
        </div>
        <p className="text-xs text-sol-blanco/50 mt-1">
          {currentIndex} de {queue.length}
        </p>
      </div>

      <div className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-6 flex flex-col gap-3">
        <p className="font-display font-black text-xl">{current.nombre}</p>
        <p className="text-sm text-sol-blanco/60">{current.whatsapp}</p>
        <div className="flex justify-end mt-2">
          <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-[#005c4b] text-sol-blanco px-4 py-3 text-sm whitespace-pre-wrap">
            {mensajeFinal}
          </div>
        </div>
      </div>

      <motion.button
        onClick={handleEnviarYSiguiente}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-full bg-sol-rojo text-sol-blanco font-display font-bold py-4"
      >
        Enviar y siguiente
      </motion.button>
      <button
        onClick={handleSaltar}
        className="rounded-full border border-sol-blanco/20 text-sol-blanco/70 font-display font-bold py-3"
      >
        Saltar
      </button>

      <p className="text-xs text-sol-blanco/40 text-center">
        Se envía manualmente desde WhatsApp, un clic por vez. Podés pausar y retomar cuando
        quieras.
      </p>
    </div>
  );
}
