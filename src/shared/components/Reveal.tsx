import React, { createContext, useContext } from 'react';
import { motion, useReducedMotion } from 'motion/react';

/**
 * Scroll-triggered micro-animation primitives.
 *
 * Framer-template motion is mostly *entrance* choreography: elements start
 * slightly displaced and settle as they enter the viewport, once, with a short
 * ease-out. `Reveal` does exactly that, so sections opt in without each one
 * hand-rolling `whileInView` + `viewport` props.
 *
 * Lives in `shared/` because it is a generic primitive, not a landing-page
 * concern — the Agent catalog renders the same cascade on `/agents`.
 *
 * `useReducedMotion` collapses every variant to a plain render. A user who asked
 * for less movement should get less movement, not content stuck mid-transform.
 */

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface RevealProps {
  children: React.ReactNode;
  /** Seconds of delay. Pair with `RevealItem` inside a `RevealGroup`. */
  delay?: number;
  /** Seconds. Longer feels more editorial; past ~0.6s it reads as broken. */
  duration?: number;
  /** Travel direction of the entrance. `none` fades in place. */
  from?: Direction;
  /** Pixels of travel before settling. */
  distance?: number;
  className?: string;
}

const OFFSETS: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 },
};

type Cascade = { stagger: number; delay: number };

const CascadeContext = createContext<Cascade | null>(null);

/**
 * Parent that staggers its `RevealItem` children.
 *
 * The timing is declared once here and read by each child through context, so a
 * grid of eight cards stays a one-line opt-in instead of eight hand-computed
 * delays that drift out of sync the moment a card is reordered.
 */
export const RevealGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
  /** Seconds between each child's entrance. */
  stagger?: number;
  /** Seconds before the first child starts. */
  delay?: number;
}> = ({ children, className = '', stagger = 0.07, delay = 0 }) => (
  <CascadeContext.Provider value={{ stagger, delay }}>
    <div className={className}>{children}</div>
  </CascadeContext.Provider>
);

export const Reveal: React.FC<RevealProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  from = 'up',
  distance = 18,
  className = '',
}) => {
  const reduceMotion = useReducedMotion();
  const cascade = useContext(CascadeContext);
  const offset = OFFSETS[from];

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: offset.x * distance, y: offset.y * distance }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};

/**
 * A cascade cell. Inside a `RevealGroup` it picks up the group's stagger;
 * outside one it behaves as a plain `Reveal`.
 */
export const RevealItem: React.FC<RevealProps & { index?: number }> = ({ index = 0, ...props }) => {
  const cascade = useContext(CascadeContext);
  const delay = cascade ? cascade.delay + index * cascade.stagger : props.delay;
  return <Reveal {...props} delay={delay} duration={props.duration ?? 0.5} distance={props.distance ?? 16} />;
};

export default Reveal;
