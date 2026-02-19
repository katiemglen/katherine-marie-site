# Changelog

## 2026-02-19 — Glassmorphism Elevation & Polish

### Glass Treatment
- Elevated base `.glass` class: blur 12→16px, added inset highlight + layered shadow
- Dark mode glass gets deeper shadows for depth contrast
- ClosingCTA section: wrapped text in frosted glass panel
- Mobile nav overlay: added backdrop blur for consistency
- Lightbox: glass-blurred background, frosted nav buttons, glass counter pill

### Photo Enhancement
- Prose images: layered dual-shadow system (ambient + directional)
- Premium cubic-bezier transitions on hover (0.22, 1, 0.36, 1)
- PostCard: smooth lift-on-hover with shadow escalation
- Film-strip: softer borders, layered shadows, improved dark mode
- Hero category tags: glassmorphic with backdrop blur
- Gallery tile hover utility class for consistent lift effect

### Polish
- Consistent easing curve throughout: cubic-bezier(0.22, 1, 0.36, 1)
- Card hover: removed rotation, cleaner vertical lift
- Smooth scroll behavior (respects prefers-reduced-motion)
- All transitions use longer durations for premium feel (0.4–0.5s)
