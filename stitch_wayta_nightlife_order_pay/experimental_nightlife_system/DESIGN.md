---
name: Experimental Nightlife System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1b1b'
  surface-container: '#1f1f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e2e2e2'
  on-surface-variant: '#c4c9ac'
  inverse-surface: '#e2e2e2'
  inverse-on-surface: '#303030'
  outline: '#8e9379'
  outline-variant: '#444933'
  surface-tint: '#abd600'
  primary: '#ffffff'
  on-primary: '#283500'
  primary-container: '#c3f400'
  on-primary-container: '#556d00'
  inverse-primary: '#506600'
  secondary: '#ffabf3'
  on-secondary: '#5b005b'
  secondary-container: '#fe00fe'
  on-secondary-container: '#500050'
  tertiary: '#ffffff'
  on-tertiary: '#410587'
  tertiary-container: '#ecdcff'
  on-tertiary-container: '#784bbe'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c3f400'
  primary-fixed-dim: '#abd600'
  on-primary-fixed: '#161e00'
  on-primary-fixed-variant: '#3c4d00'
  secondary-fixed: '#ffd7f5'
  secondary-fixed-dim: '#ffabf3'
  on-secondary-fixed: '#380038'
  on-secondary-fixed-variant: '#810081'
  tertiary-fixed: '#ecdcff'
  tertiary-fixed-dim: '#d5baff'
  on-tertiary-fixed: '#270057'
  on-tertiary-fixed-variant: '#592a9e'
  background: '#131313'
  on-background: '#e2e2e2'
  surface-variant: '#353535'
typography:
  headline-xl:
    fontFamily: Newsreader
    fontSize: 80px
    fontWeight: '200'
    lineHeight: 72px
    letterSpacing: -0.05em
  headline-lg:
    fontFamily: Newsreader
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 48px
    letterSpacing: -0.02em
  body-md:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-mono:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.1em
  glitch-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '300'
    lineHeight: 12px
    letterSpacing: 0.3em
spacing:
  unit: 4px
  gutter: 16px
  margin-safe: 24px
  fragment-offset: 12px
---

## Brand & Style

This design system is built for the sensory overload of the nightlife industry. It occupies the tension between "Glitch Pulse" (digital chaos, high energy) and "Ethereal Flow" (sublime, fluid luxury). The brand personality is visceral, raw, and unapologetically bold, designed to be legible under strobe lights while maintaining a premium, editorial edge.

The aesthetic fuses **Digital Brutalism** with **Iridescent Glassmorphism**. It utilizes fragmented layouts and heavy contrast to mirror the staccato nature of electronic music, balanced by soft, flowing gradients that represent the "after-hours" haze. It is a system designed to be felt as much as it is used, challenging the user to interact with a UI that feels alive and slightly unpredictable.

## Colors

The palette is anchored in an absolute **Black (#000000)** to preserve OLED battery life and reduce eye strain in dark club environments. 

- **Acid Green (Primary):** Used for critical actions and "active" states. It provides the highest visibility.
- **Neon Pink (Secondary):** Used for alerts, highlights, and decorative glitch elements.
- **Iridescent Violet (Tertiary):** A bridge to the "Ethereal" direction, used for subtle blurs, overlays, and flowing gradients.
- **High-Contrast White:** Reserved strictly for essential metadata and body text.

Apply colors with a "strobe" logic: heavy saturations in small, concentrated bursts against the void of the background.

## Typography

This design system employs a high-friction typographic pairing. 

- **The Serif (Newsreader):** Used for large-scale "Ethereal" expressions. It should be used for event titles and artist names. Headlines should often be italicized or set with tight leading to create a sense of elegant motion.
- **The Monospace (Space Grotesk):** Used for all functional data—times, prices, locations, and CTAs. This brings the "Glitch" technicality to the UI. 

**Experimental Rule:** Labels should be set in uppercase with wide tracking. Headlines are permitted to overflow screen boundaries or be intentionally clipped by the viewport edge to reinforce the fragmented layout.

## Layout & Spacing

The layout rejects the traditional centered container. It utilizes a **Fragmented Offset Grid**. 

1. **The Base:** A 6-column fluid grid.
2. **The Offset:** Elements should be shifted by the `fragment-offset` (12px) relative to their neighbors, creating a stepped, jagged visual flow.
3. **Whitespace:** Use extreme vertical whitespace (64px+) between sections to allow the "Ethereal" iridescent backgrounds to breathe. 

Avoid symmetry. Content should feel like it is floating or "glitching" into place rather than being locked into a rigid box.

## Elevation & Depth

Depth is not communicated through shadows, but through **Optical Vibrancy and Transparency**.

- **Level 0 (Base):** Solid #000000.
- **Level 1 (Glass):** Semi-transparent surfaces (10-20% opacity) with a heavy (40px) backdrop blur. This creates the "soft focus" ethereal effect.
- **Level 2 (Active):** High-contrast borders in Acid Green or Neon Pink. No blur.
- **The Glow:** Use an outer glow (bloom effect) instead of a shadow for elevated elements. The glow should match the color of the element (e.g., a Pink button has a subtle Pink neon bloom).

## Shapes

The primary shape language is **Sharp (0px)**. All containers, buttons, and input fields must have hard 90-degree corners to maintain the "Glitch Pulse" brutalist aesthetic.

To contrast this, **Photography** and **Avatars** should use "Fluid" masking—organic, non-geometric blobs that feel like liquid mercury or light leaks. This creates a focal point of "softness" within the rigid, sharp-edged UI framework.

## Components

### Buttons
Buttons are rectangular with 0px radius. The "Primary" state is a solid Acid Green block with Black monospace text. The "Hover/Active" state triggers a 2px horizontal offset (a literal glitch shift) and a color inversion.

### Cards
Cards do not have background colors. They are defined by 1px top and bottom borders only. This creates a "scanning line" effect throughout the feed. 

### Inputs
Input fields are single lines with the label floating in a small, 10px monospace font above the line. Upon focus, the line vibrates (animation) and turns Neon Pink.

### Glitch Photography
All imagery must pass through a chromatic aberration filter. Images should be treated as "textures" rather than just content. Soft-focus, long-exposure shots are preferred to lean into the "Ethereal" vibe.

### Pulse Progress Bars
Instead of a smooth fill, progress bars are composed of individual vertical segments that "blink" or "flicker" as they load, mimicking a signal readout.