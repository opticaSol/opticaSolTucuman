const WHATSAPP_URL = 'https://wa.link/s1krfl';

export default function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className="fixed z-40 right-4 bottom-20 md:bottom-6 flex items-center justify-center w-14 h-14 rounded-full bg-sol-rojo shadow-card hover:scale-105 transition-transform"
    >
      <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-7 h-7">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.81.48 3.53 1.32 5.02L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.14c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11a15.9 15.9 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.71-.17 1.39Z" />
      </svg>
    </a>
  );
}
