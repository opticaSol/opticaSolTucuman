import { motion } from 'framer-motion';

export default function FadeInSection({ children, className = '', delay = 0, id }) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
