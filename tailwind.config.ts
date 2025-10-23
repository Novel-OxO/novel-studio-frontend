import type { Config } from "tailwindcss";

// Tailwind Theme Extend
const config: Config = {
  theme: {
    extend: {
      colors: {
        // Neutral colors
        neutral: {
          1: "var(--color-neutral-1)",
          3: "var(--color-neutral-3)",
          5: "var(--color-neutral-5)",
          10: "var(--color-neutral-10)",
          20: "var(--color-neutral-20)",
          30: "var(--color-neutral-30)",
          35: "var(--color-neutral-35)",
          40: "var(--color-neutral-40)",
          50: "var(--color-neutral-50)",
          60: "var(--color-neutral-60)",
          70: "var(--color-neutral-70)",
          75: "var(--color-neutral-75)",
          80: "var(--color-neutral-80)",
          90: "var(--color-neutral-90)",
          95: "var(--color-neutral-95)",
        },
        // Red colors
        red: {
          1: "var(--color-red-1)",
          5: "var(--color-red-5)",
          10: "var(--color-red-10)",
          20: "var(--color-red-20)",
          30: "var(--color-red-30)",
          40: "var(--color-red-40)",
          50: "var(--color-red-50)",
        },
        // Mint colors
        mint: {
          1: "var(--color-mint-1)",
          10: "var(--color-mint-10)",
          20: "var(--color-mint-20)",
          30: "var(--color-mint-30)",
          40: "var(--color-mint-40)",
          50: "var(--color-mint-50)",
        },
        // Blue colors
        blue: {
          1: "var(--color-blue-1)",
          bg: {
            1: "var(--color-blue-bg-1)",
          },
        },
        // Purple colors
        purple: {
          1: "var(--color-purple-1)",
          bg: {
            1: "var(--color-purple-bg-1)",
          },
        },
        // Yellow colors
        yellow: {
          1: "var(--color-yellow-1)",
          bg: {
            1: "var(--color-yellow-bg-1)",
          },
        },
      },
    },
  },
};

export default config;
