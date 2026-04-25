---
name: Electric Daybreak
colors:
  surface: '#fcf8f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0edec'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#484831'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#78795f'
  outline-variant: '#c9c8aa'
  surface-tint: '#5f6300'
  primary: '#5f6300'
  on-primary: '#ffffff'
  primary-container: '#f6ff00'
  on-primary-container: '#707400'
  inverse-primary: '#c7cf00'
  secondary: '#a90097'
  on-secondary: '#ffffff'
  secondary-container: '#d300bd'
  on-secondary-container: '#fffbff'
  tertiary: '#7212ff'
  on-tertiary: '#ffffff'
  tertiary-container: '#faf2ff'
  on-tertiary-container: '#8243ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3ec00'
  primary-fixed-dim: '#c7cf00'
  on-primary-fixed: '#1c1d00'
  on-primary-fixed-variant: '#474a00'
  secondary-fixed: '#ffd7f0'
  secondary-fixed-dim: '#fface8'
  on-secondary-fixed: '#3a0033'
  on-secondary-fixed-variant: '#840076'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#fcf8f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-xl:
    fontFamily: Spline Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Spline Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Spline Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
  status-banner:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  unit-xs: 4px
  unit-sm: 8px
  unit-md: 16px
  unit-lg: 24px
  unit-xl: 40px
  touch-target-min: 48px
  touch-target-optimal: 56px
  container-margin: 20px
  gutter: 12px
---

## Brand & Style

The brand personality of this design system is high-octane, immersive, and reliable. Reimagined for "Electric Daybreak," it transitions the intensity of the festival circuit into a high-visibility, light-mode environment suitable for daytime outdoor events and high-glare settings. The emotional response remains one of excitement and "pulse," but shifts from dark-room immersion to a clean, high-energy clarity that ensures functionality under the sun.

The design style is a hybrid of **Minimalism** and **Glassmorphism**, utilizing **Fluorescent High-Contrast** accents. By using a crisp white foundation, we ensure maximum legibility and a fresh, modern aesthetic. Vibrant "Electric Lime" and "Neon Pink" elements serve as powerful navigational beacons. The interface maintains depth through subtle translucent layers and soft shadows, preserving the atmospheric energy of the original system while optimizing for daytime performance.

## Colors

The palette is anchored in clean whites and light greys to ensure maximum readability in high-ambient light conditions. 

*   **Primary (Electric Lime):** Used for primary actions, active states, and critical path navigation. On a light background, it provides a sharp, high-visibility focus that cuts through glare.
*   **Secondary (Neon Pink):** Reserved for secondary actions, highlights, and promotional festival content.
*   **Tertiary (Cyber Purple):** Used for accents, categorization of events, and decorative highlights.
*   **Neutral:** A scale of whites, off-whites, and soft greys to create structural hierarchy and clean separation without the weight of dark backgrounds.
*   **Functional:** A high-visibility Amber is reserved for connectivity warnings and offline states, ensuring they are never confused with standard UI elements.

## Typography

This design system utilizes a dual-font strategy to balance technical character with absolute utility. **Spline Sans** is used for headlines and display text, providing a fresh, geometric, and technical feel that aligns with the "Electric Daybreak" aesthetic. **Inter** is used for all functional body copy and labels to ensure maximum legibility and hardware-like precision.

To accommodate varying outdoor light levels, font weights are robust and line heights are generous. This prevents text from washing out when viewed on mobile screens in direct sunlight or through polarized lenses.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model optimized for one-handed use in high-motion environments. 

*   **Touch Targets:** All interactive elements (buttons, toggles, list items) must adhere to a minimum height of 48px, with an optimal height of 56px for primary actions to account for user movement and fatigue.
*   **Grid System:** A 4-column mobile grid with 20px outer margins. This provides enough breathing room to prevent accidental taps while maintaining high information density.
*   **Spacing Rhythm:** All spacing is derived from a 4px base unit. Vertical rhythm is strictly enforced to ensure that real-time updates and status changes don't cause jarring layout shifts.

## Elevation & Depth

Visual hierarchy is established through **Tonal Layers** and **Soft Shadows** rather than pure color value.

1.  **Level 0 (Background):** Pure white (#FFFFFF).
2.  **Level 1 (Cards/Containers):** Subtle off-white surfaces with a 1px soft border or a very low-opacity ambient shadow to define edges against the background.
3.  **Level 2 (Modals/Overlays):** Semi-transparent light surfaces (90% opacity) with a 20px backdrop blur, creating a clean glassmorphic effect that maintains context.
4.  **Active Depth:** Elements in an "active" or "pressed" state use a saturated color fill (Electric Lime) or an inner shadow to indicate depression, ensuring clear feedback even in bright environments.

## Shapes

The shape language of this design system is **Rounded**, utilizing an 8px (0.5rem) base radius for standard components and 16px (1rem) for large containers and cards.

*   **Primary Buttons:** Fully pill-shaped (rounded-full) to distinguish them from informational cards.
*   **Status Indicators:** Small circles or rounded-sm for badges.
*   **Images/Media:** Match the container radius (16px) to maintain a cohesive, "friendly-tech" aesthetic.

## Components

### Buttons
*   **Primary:** High-contrast Electric Lime background with dark text. Designed to pop against the white UI and provide maximum visibility.
*   **Secondary:** Ghost style with a 2px Neon Pink border and Pink text.
*   **Tertiary:** Transparent background with dark text and underline, used for low-priority actions.

### Cards & Lists
*   **Event Cards:** Feature high-saturation imagery with a clean white footer area to ensure text legibility. 
*   **Status Lists:** Real-time updates (e.g., "Set starting in 5m") use a pulsing Electric Lime icon to draw immediate attention.

### Connectivity Banners
*   **Offline/Low-Sync:** A full-width banner using a high-visibility functional amber (#FFB800) pinned to the top of the viewport. It uses high-contrast black text and a "Warning" icon to ensure it remains visible even in the brightest conditions.

### Input Fields
*   **Fields:** Light grey backgrounds with 1px borders. When focused, the border transitions to Electric Lime.
*   **Tap Targets:** Input heights are set to 56px for easy selection in active settings.

### Additional Components
*   **Live Pulse Badge:** A small animated dot indicating a live event or real-time status update.
*   **Flash Action:** A large, centered CTA button for "Emergency" or "Help" features, using the Neon Pink palette for maximum urgency.