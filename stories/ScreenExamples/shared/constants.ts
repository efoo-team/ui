// Values the 画面例 share apart from the fictional data in data.ts: the service's name and the sizes they lay out by.

// The size of an icon beside text: in a button, a menu item, a link or an input.
export const ICON_SIZE = 16;

/*
 * The fictional service's name. The sign-in screen shows it, because there the user has not entered yet and needs to
 * know they are at the right service. The frame (AppFrame) does not: the signed-in user is already in it, the top of
 * the sidebar names the organization, and a service puts its own name in the document title.
 */
export const SERVICE_NAME = '販売管理';

// Container breakpoints for the grids on the screens (Grid and SimpleGrid with type="container"), which change their
// columns by their own width, so an open sidebar and a narrow column are taken into account. Mantine needs exact widths
// for container queries. xs is where two columns of fields or cards fit side by side.
// lg (66rem = 1056px) is where the four stat cards and the side-by-side chart row start; it stays clear of the main width at
// common viewports (1440: 1152 open / 1360 rail, 1280: 992 / 1200, 1200: 912 / 1120, 1024: 736 / 944).
export const CONTENT_BREAKPOINTS = {
  xs: '36rem',
  sm: '48rem',
  md: '48rem',
  lg: '66rem',
  xl: '80rem',
};
