# Design System: Para Carol

## 1. Visual Theme & Atmosphere
A tender, elegant, and minimal digital space. The atmosphere is soft and emotional, evoking the feeling of a handwritten love letter combined with a modern art gallery. It uses generous whitespace, diffused pastel gradients, and continuous floating micro-motion to create a calm, premium, and deeply personal environment. 

## 2. Color Palette & Roles
- **Canvas White** (`#FAFAFC`) — Primary background surface. A very soft, warm off-white.
- **Baby Pink** (`#FCE4EC`) — Primary accent, used for gradients, glowing effects, and delicate emphasis.
- **Soft Lavender** (`#F3E5F5`) — Secondary gradient tone, used for deep parallax layers and subtle background particles.
- **Pure Surface** (`#FFFFFF`) — Card and container fill. Offers a clean, crisp contrast against the pastel canvas.
- **Charcoal Ink** (`#2C2C2E`) — Primary text. A deep, soft gray to ensure high contrast without the harshness of pure black.
- **Muted Steel** (`#8E8E93`) — Secondary text for metadata or delicate subheadings.
- **Whisper Border** (`rgba(255, 255, 255, 0.6)`) — Glassmorphism borders and soft highlights.

## 3. Typography Rules
- **Display:** Playfair Display — Used exclusively for the Hero title and section headers. Elegant, high-contrast, with generous tracking.
- **Body:** Poppins — Used for all reading text, buttons, and cards. Relaxed leading, 65ch max-width.
- **Banned:** Inter, generic system fonts, pure black text.

## 4. Component Stylings
- **Buttons / Cards:** Generously rounded corners (`1.5rem`). Glassmorphism styling (`backdrop-filter: blur(12px)` with `rgba(255, 255, 255, 0.4)` background). Diffused whisper shadow. No harsh solid borders. Hover states scale up smoothly (`scale(1.02)`) and increase the soft glow.
- **Typography Layout:** Text never overlaps images or particles. Perfect alignment and centered layouts are used gracefully in the hero and final message, while an asymmetric grid is used for the "Things I appreciate" cards.

## 5. Layout Principles
Grid-first responsive architecture. Generous internal padding (`clamp(3rem, 8vw, 6rem)` between sections). Strict single-column collapse below `768px`. Maximum width containment of `1200px` for content.

## 6. Motion & Interaction
Perpetual micro-loops on the canvas background (floating particles with varied opacity and slow upward drift). Staggered cascade reveals on scroll using Intersection Observer. Fluid spring-physics-like CSS transitions (`cubic-bezier(0.25, 0.1, 0.25, 1)`) for hover effects. Hardware-accelerated transforms and opacity only. Typewriter effect reveals the love letter smoothly character by character.

## 7. Anti-Patterns (Banned)
No pure black (`#000000`). No neon glows. No overlapping elements. No AI copywriting clichés. No 3-column equal grids for cards.
