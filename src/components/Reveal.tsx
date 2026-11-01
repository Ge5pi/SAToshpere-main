import React from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'none';
  distance?: number;
}

export const Reveal: React.FC<RevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={`min-w-0 ${className}`.trim()}>{children}</div>;
  }

  const initialOffset =
    direction === 'up'
      ? { y: distance, x: 0 }
      : direction === 'left'
        ? { x: -distance, y: 0 }
        : direction === 'right'
          ? { x: distance, y: 0 }
          : { x: 0, y: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, ...initialOffset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.14, margin: '0px 0px -36px 0px' }}
      transition={{
        duration: 0.52,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`min-w-0 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
};

export const ScrollProgressBar: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    restDelta: 0.001,
  });

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[3px] origin-left bg-gradient-to-r from-[#00887A] via-[#77A6F7] to-[#00887A]"
    />
  );
};
