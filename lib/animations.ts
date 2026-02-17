export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeUpLanding = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInScale = {
  hidden: { opacity: 0, scale: 1.03 },
  visible: { opacity: 1, scale: 1 }
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export const staggerContainer = (staggerMs: number = 60) => ({
  hidden: {},
  visible: { transition: { staggerChildren: staggerMs / 1000 } }
});

// Default transition
export const defaultTransition = { duration: 0.5, ease: 'easeOut' as const };
export const textTransition = { duration: 0.4, ease: 'easeOut' as const };
export const fastTransition = { duration: 0.3, ease: 'easeOut' as const };
export const landingTransition = { duration: 0.6, ease: 'easeOut' as const };
