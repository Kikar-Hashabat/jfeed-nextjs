export const SPACING = {
  xs: 2, // 0.5rem - 8px
  sm: 4, // 1rem - 16px
  md: 6, // 1.5rem - 24px
  lg: 8, // 2rem - 32px
  xl: 12, // 3rem - 48px
};

export const SIZING = {
  container: "max-w-7xl",
  aside: "w-72",
  article: {
    image: {
      sm: "w-60",
      md: "w-[300px]",
      lg: "w-full",
    },
  },
};

export const COLORS = {
  primary: "red-700",
  secondary: "blue-600",
  accent: "green-500",
  text: {
    primary: "gray-900",
    secondary: "gray-600",
    muted: "gray-400",
  },
  border: "neutral-200",
  background: {
    light: "white",
    dark: "gray-50",
  },
};

// Common component styles
export const commonStyles = {
  container: `${SIZING.container} mx-auto px-${SPACING.sm}`,
  section: `mb-${SPACING.md}`,
  heading: {
    primary: `text-2xl md:text-3xl font-bold text-${COLORS.text.primary}`,
    secondary: `text-xl font-bold text-${COLORS.text.primary}`,
  },
  article: {
    container: `flex flex-col gap-${SPACING.sm}`,
    image: "relative aspect-video rounded-lg overflow-hidden",
    title: `text-lg font-bold text-${COLORS.text.primary} group-hover:text-${COLORS.primary} transition-colors`,
    meta: `flex items-center gap-${SPACING.xs} text-sm text-${COLORS.text.muted} uppercase`,
  },
};
