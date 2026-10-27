import type { TransitionProps } from '@mantine/core';

export const motion = {
  durationFast: 120,
  durationOverlay: 150,
  durationStandard: 200,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const;

export const motionCssVariables = {
  '--efoo-motion-duration-fast': `${motion.durationFast}ms`,
  '--efoo-motion-duration-overlay': `${motion.durationOverlay}ms`,
  '--efoo-motion-duration-standard': `${motion.durationStandard}ms`,
  '--efoo-motion-easing': motion.easing,
};

const overlayScale = 0.95;

export const overlayTransitionProps = {
  transition: {
    in: { opacity: 1, transform: 'scale(1)' },
    out: { opacity: 0, transform: `scale(${overlayScale})` },
    transitionProperty: 'transform, opacity',
  },
  duration: motion.durationOverlay,
  timingFunction: motion.easing,
} satisfies Partial<TransitionProps>;

// The full-screen Modal content sets --efoo-modal-scale to 1, so it only fades instead of showing the page at its edges.
export const modalTransitionProps = {
  ...overlayTransitionProps,
  transition: {
    ...overlayTransitionProps.transition,
    out: { opacity: 0, transform: `scale(var(--efoo-modal-scale, ${overlayScale}))` },
  },
} satisfies Partial<TransitionProps>;

// Drawer keeps Mantine's slide that follows its position and only takes the duration and easing.
export const drawerTransitionProps = {
  duration: motion.durationStandard,
  timingFunction: motion.easing,
} satisfies Partial<TransitionProps>;
