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

export const overlayTransitionProps = {
  transition: {
    in: { opacity: 1, transform: 'scale(1)' },
    out: { opacity: 0, transform: 'scale(0.95)' },
    transitionProperty: 'transform, opacity',
  },
  duration: motion.durationOverlay,
  timingFunction: motion.easing,
} satisfies Partial<TransitionProps>;

// Drawer keeps Mantine's slide that follows its position and only takes the duration and easing.
export const drawerTransitionProps = {
  duration: motion.durationStandard,
  timingFunction: motion.easing,
} satisfies Partial<TransitionProps>;
