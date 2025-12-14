/**
 * Mobile Responsive Utility Classes and Functions
 * Helps ensure mobile-friendly design across the application
 */

import React from "react";

export const mobileResponsiveClasses = {
  // Responsive padding
  padding: {
    section: "p-3 sm:p-4 md:p-6 lg:p-8",
    small: "p-2 sm:p-3 md:p-4",
    large: "p-4 sm:p-6 md:p-8 lg:p-10",
  },

  // Responsive text sizes
  text: {
    h1: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    h2: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
    h3: "text-lg sm:text-xl md:text-2xl lg:text-3xl",
    h4: "text-base sm:text-lg md:text-xl lg:text-2xl",
    body: "text-sm sm:text-base md:text-lg",
    small: "text-xs sm:text-sm md:text-base",
  },

  // Responsive gaps
  gap: {
    small: "gap-2 sm:gap-3 md:gap-4",
    medium: "gap-3 sm:gap-4 md:gap-6",
    large: "gap-4 sm:gap-6 md:gap-8",
  },

  // Responsive heights
  height: {
    button: "h-10 sm:h-11 md:h-12",
    input: "h-10 sm:h-11 md:h-12",
    header: "h-14 md:h-16",
  },

  // Responsive grid columns
  grid: {
    cols1to2: "grid-cols-1 sm:grid-cols-2",
    cols1to3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    cols1to4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
    cols2to4: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
  },

  // Responsive max widths
  maxWidth: {
    small: "max-w-xs sm:max-w-sm",
    medium: "max-w-sm sm:max-w-md",
    large: "max-w-md sm:max-w-lg",
    xlarge: "max-w-lg sm:max-w-2xl",
  },

  // Common responsive containers
  container: {
    card: "rounded-lg p-4 sm:p-6 bg-card",
    dialog: "max-w-sm sm:max-w-md",
  },
};

/**
 * Check if screen is mobile size
 * Useful for conditional rendering in components
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

/**
 * Combine responsive classes easily
 */
export const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(" ");
};
