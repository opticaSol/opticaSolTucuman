import { motion } from 'framer-motion';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-[calc(100vh-1px)] grid md:grid-cols-2">
      <div className="relative hidden md:flex flex-col justify-center bg-sol-negro p-12 overflow-hidden">
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: 'linear' }}
          className="pointer-events-none absolute -left-52 -bottom-52 w-[520px] h-[520px] rounded-full opacity-[0.08]"
          style={{
            backgroundImage: 'repeating-conic-gradient(#F5C518 0deg 9deg, transparent 9deg 18deg)',
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative"
        >
          <h2 className="font-display font-black text-4xl uppercase leading-[0.95] mb-4">
            Tu mirada,
            <br />
            <span className="text-sol-amarillo">nuestra pasión</span>
          </h2>
          <p className="text-sol-blanco/60 max-w-xs">
            Sumate a la comunidad Óptica Sol y accedé a tus pedidos, promos y presupuestos desde
            un solo lugar.
          </p>
          <div className="flex gap-8 mt-8">
            <div>
              <p className="font-display font-black text-2xl text-sol-amarillo">+40</p>
              <p className="text-xs text-sol-blanco/50">años en Tucumán</p>
            </div>
            <div>
              <p className="font-display font-black text-2xl text-sol-amarillo">+500</p>
              <p className="text-xs text-sol-blanco/50">clientes felices</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center justify-center bg-sol-negro px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
