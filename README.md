# GlobalTech Connect — Accessible Employee Portal

A working prototype of an accessible enterprise employee portal, built as the practical companion to a Business Analysis case study on digital accessibility. The portal is designed and audited against **WCAG 2.2 AA** success criteria.

**Live demo:** open `index.html` in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## What it demonstrates

- **Accessibility Hub** — a live customisation panel covering typography scaling, line/letter/word spacing, dyslexia-friendly and monospace fonts, light/dark/high-contrast themes, colour-blindness simulation shaders, contrast and saturation controls, text-to-speech reading, a visual ARIA output console, a braille output simulator, voice-command navigation, configurable keyboard focus rings, enlarged click targets, a large high-contrast cursor, reading ruler and reading mask overlays, an ADHD focus frame, reduced motion, forced icon labels, and visual equivalents for sound alerts — with every setting persisted per user.
- **Portal modules** — employee dashboard, HR self-service (leave requests and benefits enrolment with accessible form validation), learning & development (captioned mock video player with interactive transcript), IT support desk (sortable ticket history), company news, employee directory, knowledge base, and help centre.
- **Inclusive interaction patterns** — skip-to-content link, breadcrumb navigation, full keyboard operability (including WAI-ARIA tab patterns and a focus-trapped modal), screen-reader live regions, visible empty states, toast notifications instead of blocking alerts, and responsive layouts from mobile to desktop.

## Stack

Plain HTML, CSS and JavaScript — no frameworks, no build step. All state is client-side; the data shown is mock data.

## Case study context

Built by **Beri Vishnu Vardhan Reddy** (MSc Business Analysis & Consulting, University of Strathclyde) to demonstrate how the accessibility recommendations from the GlobalTech case study translate into a working product.
