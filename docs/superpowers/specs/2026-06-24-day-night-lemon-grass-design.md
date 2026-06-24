---
draft: true
---

# Revenza Day and Night Lemon Grass Design

## Goal

Replace the current mixed theme with two intentional appearances:

- **Day:** faithfully follows the approved “Generated image 3” reference.
- **Night:** preserves the same hierarchy and component design using deep forest surfaces and accessible warm-white typography.

The homepage hero will use the 3D artwork as a full-bleed animated background instead of displaying it inside a visible rectangular image frame.

## Theme Behavior

- The selector exposes only **Day** and **Night**.
- Day is the default for first-time visitors.
- System preference is ignored.
- The visitor’s selection persists in local storage.
- The toggle labels and accessible names use “Day mode” and “Night mode,” not “light,” “dark,” or “system.”
- Both themes support `prefers-reduced-motion`.

## Day Palette

The Day palette is derived from the approved sample:

- Page canvas: `#fffefb`
- Alternate surface: `#f8f9f3`
- Soft lemon-grass surface: `#edf2df`
- Border and divider: `#dfe5d8`
- Primary forest green: `#0d5b37`
- Deep forest green: `#174d34`
- Lemon-grass accent: `#c9db8d`
- Main text: `#15241d`
- Secondary text: `#59685f`
- White controls: `#ffffff`

Shadows remain subtle and green-tinted. Gradients are used only for atmospheric hero overlays and soft illustration surfaces.

## Night Palette

Night is a token translation of Day, not a separate design:

- Page canvas: `#0d120d`
- Alternate surface: `#101610`
- Raised surface: `#182218`
- Soft active surface: `#263122`
- Border and divider: `#33412c`
- Primary lemon-grass accent: `#c9db8d`
- Bright accent: `#dbe8b2`
- Main text: `#f4f7ee`
- Secondary text: `#c5cdbb`
- Muted text: `#aeb9a2`

Text, links, form controls, search results, code blocks, sidebars, cards, and status messages must meet WCAG AA contrast.

## Homepage Hero

- The hero occupies the full available width beneath the navigation.
- The generated 3D ecommerce image fills the entire hero background with `cover`.
- A theme-specific overlay protects headline readability:
  - Day uses warm-white opacity from left to right.
  - Night uses near-black forest opacity from left to right.
- The current separate floating brand image is removed from the hero because the generated scene already contains brand imagery.
- Motion is applied to the background using slow transform-only scale and position movement.
- On mobile, the composition changes to a vertical gradient so text remains legible above the visible illustration.
- Reduced-motion users receive a static background.

## Navigation and Mode Toggle

- Navigation keeps the approved reference’s clean, thin-divider treatment.
- Day navigation uses warm white with forest text.
- Night navigation uses deep forest with warm-white text.
- The mode control is a two-state button:
  - Moon icon and “Switch to Night mode” in Day.
  - Sun icon and “Switch to Day mode” in Night.
- Search, GitHub, and navigation links remain clearly visible in both themes.

## App Directory

- The Revenza Upsell card remains vertical and compact.
- The 3D Upsell artwork replaces temporary initials or corporate-logo imagery.
- Day card surfaces use white and pale lemon-grass tones.
- Night card surfaces use raised forest panels with lemon-grass accents.
- Card text is limited to a short introduction and one primary knowledge-base action.

## Documentation and Contact Page

- Documentation pages follow the approved sample:
  - Forest sidebar labels.
  - Pale lemon active rows.
  - Thin dividers.
  - Flat content surfaces.
  - Restrained shadows.
- The Contact page uses identical tokens and typography.
- Form labels, placeholders, errors, success messages, disabled controls, and focus rings remain visible in both modes.

## Responsive Design

- Desktop: full-bleed hero with left-aligned copy and artwork visible across the right and center.
- Tablet: hero remains full width; overlay grows stronger behind text.
- Mobile: hero stacks visually through background positioning, not a separate image block.
- No horizontal overflow at `390px`, `768px`, or `1440px`.

## Performance and Accessibility

- Use the optimized WebP assets already in the project.
- Do not add animation libraries.
- Animate only `transform` and opacity.
- Disable nonessential animation under `prefers-reduced-motion`.
- Preserve semantic headings, keyboard navigation, visible focus, and local search.
- Verify contrast for all primary and secondary text in both themes.

## Verification

- Build succeeds with `npm run build`.
- Contact logic tests pass with `npm test`.
- Day and Night are the only available appearance choices.
- No system-mode option or system-preference behavior remains.
- Homepage, contact, docs, FAQ, changelog, search, sitemap, and manifest routes return successfully.
- Visual QA covers `1440x1024`, `768x1024`, and `390x844` in both modes.
