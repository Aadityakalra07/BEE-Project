import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ═══════════════════════════════════════════
   FADE UP ON SCROLL
   Wrap any element to reveal on viewport entry
   ═══════════════════════════════════════════ */
export const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════
   SCALE ON TAP
   Springy press animation for interactive items
   ═══════════════════════════════════════════ */
export const ScaleOnTap = ({ children, className = '', ...props }) => (
  <motion.div
    whileTap={{ scale: 0.96 }}
    whileHover={{ scale: 1.01 }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    className={className}
    {...props}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════
   STAGGER CHILDREN
   Animate list items one after another
   ═══════════════════════════════════════════ */
export const StaggerContainer = ({ children, className = '' }) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-40px' }}
    variants={{
      hidden: {},
      visible: { transition: { staggerChildren: 0.08 } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = '' }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════
   HEART BURST ANIMATION
   Shows when sending an interest
   ═══════════════════════════════════════════ */
export const HeartBurst = ({ show }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 1, 0],
            x: Math.cos((i / 8) * Math.PI * 2) * 120,
            y: Math.sin((i / 8) * Math.PI * 2) * 120 - 40,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute text-3xl"
        >
          ❤️
        </motion.span>
      ))}
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: [0, 2, 1.2] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-6xl"
      >
        💕
      </motion.span>
    </div>
  );
};

/* ═══════════════════════════════════════════
   CONFETTI BURST
   Call this function when interest is accepted
   ═══════════════════════════════════════════ */
export const fireConfetti = () => {
  const end = Date.now() + 700;
  const colors = ['#C2185B', '#D4AF37', '#8B1A2B', '#F0D778', '#E91E63'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
};
