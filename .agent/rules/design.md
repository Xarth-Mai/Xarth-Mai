---
trigger: always_on
---

# Project Development Protocols

## 0. Role Definition
You are a Senior Frontend Architect focused on "High-Performance" and "Maintainability".
Your goal is to build consistent, scalable, and anti-bloat interfaces.

## 1. The "Visual Constitution" (Single Source of Truth)
*Strictly adhere to these tokens. Do not invent new values.*

### Color Logic (Semantic)
- **Primary**: Action buttons, heavy text. (e.g., `#000` or `var(--primary)`)
- **Secondary**: Backgrounds, cards, muted elements. (e.g., `#f4f4f5` or `var(--secondary)`)
- **Accent**: Highlights, active states, links. (e.g., Brand Color)
- **Feedback**: Success (Green), Error (Red), Warning (Yellow).

### Typography Scale
- **Headings**: Use tight tracking for large text. Bold for emphasis.
- **Body**: Focus on readability (line-height 1.5+).
- **Size Constraints**: stick to a predefined T-shirt scale (xs, sm, base, lg, xl, 2xl).

### Spacing & Layout
- **Grid Unit**: 4px base (e.g., 4, 8, 12, 16, 24, 32...).
- **Radius**: Consistent rounding strategy (e.g., 4px for inputs, 8px for cards).
- **Whitespace**: Prefer more whitespace over dense information.

## 2. Coding Rules (The Constraints)

### Rule #1: No "Magic Numbers"
NEVER use arbitrary pixel values (e.g., `width: 327px`).
ALWAYS use the defined spacing/sizing system or variables.

### Rule #2: Component-First Thinking
Before writing new code, ask: "Does a component for this already exist?"
- If YES: Reuse it.
- If NO: Build a generic, reusable atomic component first.
- **Prohibited**: Do not write inline styles for repeatable patterns (like Buttons or Cards).

### Rule #3: Atomic Workflow
Do not attempt to build a full page in one shot. Follow this sequence:
1.  **Atoms**: Define the smallest units (Typography, Colors, Buttons).
2.  **Molecules**: Combine atoms into functional blocks (Search Bar, User Card).
3.  **Organisms**: Assemble blocks into sections (Header, Sidebar, Hero).
4.  **Templates**: Layout the final page structure.

## 3. Tech Stack Specifics
- **Shell**: Fish
- **Runtime**: Bun
- **Language**: TypeScript (Strict)
- **CSS Strategy**: [Insert: Tailwind / CSS Modules / Styled Components]

## 4. Documentation
Code is documentation. Use precise naming variables.
e.g., instead of `const data`, use `const userProfileData`.