# Design Tokens - Color System

## Overview

This project uses a custom color system defined as CSS variables in `app/globals.css` using Tailwind CSS v4's `@theme` directive. The color palette is designed to provide a comprehensive set of neutral tones and accent colors for building a consistent UI.

**Note**: This design system is optimized for **light mode only** and does not support dark mode.

## Color Palette

### Base Colors
- `--color-white`: #ffffff
- `--color-black`: #000000

### Neutral Colors
A grayscale palette ranging from light to dark, ideal for backgrounds, borders, and text.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-1` | #f9f9fa | Lightest background |
| `--color-neutral-3` | #f1f2f3 | Very light background |
| `--color-neutral-5` | #eaebec | Light background |
| `--color-neutral-10` | #dbdcdf | Subtle borders |
| `--color-neutral-20` | #cccdd1 | Light borders |
| `--color-neutral-30` | #aeb0b6 | Disabled text |
| `--color-neutral-35` | #989ba2 | Secondary text |
| `--color-neutral-40` | #878a93 | Muted text |
| `--color-neutral-50` | #70737c | Body text |
| `--color-neutral-60` | #5a5c63 | Dark text |
| `--color-neutral-70` | #46474c | Emphasis text |
| `--color-neutral-75` | #37383c | Very dark text |
| `--color-neutral-80` | #27282c | Dark background |
| `--color-neutral-90` | #212225 | Very dark background |
| `--color-neutral-95` | #1b1c1e | Darkest background |

### Red Colors
Used for error states, destructive actions, and alerts.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-red-1` | #fffaf7 | Error background (lightest) |
| `--color-red-5` | #ffebe0 | Error background (light) |
| `--color-red-10` | #fcaea9 | Error border |
| `--color-red-20` | #ff8f87 | Error accent |
| `--color-red-30` | #fe7a70 | Error primary |
| `--color-red-40` | #ff6c62 | Error emphasis |
| `--color-red-50` | #f1564b | Error dark |

### Mint Colors
**Brand color** - Primary accent color used throughout the project for main CTAs, primary actions, and brand identity.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-mint-1` | #c6fae6 | Brand background (lightest) |
| `--color-mint-10` | #98f9d5 | Brand background (light) |
| `--color-mint-20` | #29ffb0 | Brand border |
| `--color-mint-30` | #08f29b | Brand accent |
| `--color-mint-40` | #0dd78c | Brand primary |
| `--color-mint-50` | #1ba673 | Brand dark (hover states) |

### Blue Colors
**Chip color** - Used for tags, badges, and chip components.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-blue-1` | #418cc3 | Blue chip text |
| `--color-blue-bg-1` | #e8f1ff | Blue chip background |

### Purple Colors
**Chip color** - Used for tags, badges, and chip components.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-purple-1` | #9c6bb3 | Purple chip text |
| `--color-purple-bg-1` | #f1e8ff | Purple chip background |

### Yellow Colors
**Chip color** - Used for tags, badges, and chip components.

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-yellow-1` | #d77b0f | Yellow chip text |
| `--color-yellow-bg-1` | #fff3c2 | Yellow chip background |

## Usage in Tailwind CSS v4

### Method 1: Direct CSS Variable Reference (Bracket Notation)
```tsx
<div className="bg-[--color-neutral-10] text-[--color-red-40]">
  Direct CSS variable usage
</div>
```

### Method 2: Configured Theme Colors (Recommended)
After extending the theme in `tailwind.config.ts`, you can use shorthand class names:

```tsx
<button className="bg-mint-40 text-white hover:bg-mint-50">
  Click Me
</button>
```

## Extending Theme in Tailwind CSS v4

The `tailwind.config.ts` file maps CSS variables to convenient class names:

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        neutral: {
          1: "var(--color-neutral-1)",
          10: "var(--color-neutral-10)",
          // ... etc
        },
        red: {
          1: "var(--color-red-1)",
          40: "var(--color-red-40)",
          // ... etc
        },
        mint: {
          1: "var(--color-mint-1)",
          40: "var(--color-mint-40)",
          // ... etc
        },
        // ... other colors
      },
    },
  },
};

export default config;
```

### Key Points:
1. **CSS Variables in `@theme`**: Define your color tokens in `app/globals.css` using the `@theme` directive (Tailwind v4 feature)
2. **Map in Config**: Reference these variables in `tailwind.config.ts` to create convenient class names
3. **Use Everywhere**: Apply colors using standard Tailwind utilities like `bg-mint-40`, `text-neutral-70`, etc.

## Benefits of This Approach

✅ **Centralized Management**: All color definitions in one place (`globals.css`)

✅ **Type-Safe**: TypeScript config ensures proper color references

✅ **Consistent**: Optimized color palette for light mode ensures visual consistency

✅ **Developer-Friendly**: Intuitive class names like `bg-mint-40` instead of `bg-[--color-mint-40]`

✅ **Maintainable**: Changes to color values automatically propagate throughout the app

## Example Usage

```tsx
// Primary button with brand color (Mint)
<button className="bg-mint-40 hover:bg-mint-50 text-white rounded-lg px-6 py-3">
  Primary Action
</button>

// Chip components
<span className="bg-blue-bg-1 text-blue-1 px-3 py-1 rounded-full text-sm">
  Blue Chip
</span>

<span className="bg-purple-bg-1 text-purple-1 px-3 py-1 rounded-full text-sm">
  Purple Chip
</span>

<span className="bg-yellow-bg-1 text-yellow-1 px-3 py-1 rounded-full text-sm">
  Yellow Chip
</span>

// Error message
<div className="bg-red-5 text-red-50 border border-red-20 p-4 rounded">
  Error message here
</div>

// Neutral card
<div className="bg-neutral-1 border border-neutral-10 rounded-lg p-6">
  <h2 className="text-neutral-80 font-semibold">Card Title</h2>
  <p className="text-neutral-50">Card content</p>
</div>
```
