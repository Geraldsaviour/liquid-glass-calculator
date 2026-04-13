# Liquid Glass Calculator

A standard and scientific calculator with glassmorphism UI, light/dark theming, and GSAP animations.

## 🔗 Live Site

**[https://liquid-glass-calculator-mcdevv.vercel.app/](https://liquid-glass-calculator-mcdevv.vercel.app/)**

## Purpose

Provides a fully functional calculator with standard and scientific modes. Features persistent theme preference, mouse-driven background parallax, and animated button interactions.

## Tech Stack

- React 18
- Vite 5
- GSAP 3
- math.js
- CSS Custom Properties
- localStorage

## File Structure

```
liquid-glass-calculator/
├── public/
│   ├── bg-light.jpg
│   └── 84684467e008de73218276315a431ecd.jpg
├── src/
│   ├── components/
│   │   ├── Calculator.jsx
│   │   ├── ButtonGrid.jsx
│   │   ├── Display.jsx
│   │   └── ModeToggle.jsx
│   ├── hooks/
│   │   ├── useCalculator.js
│   │   └── useTheme.js
│   ├── styles/
│   │   └── glass.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

## Installation

Requires Node.js 18 or later.

```bash
git clone https://github.com/Geraldsaviour/liquid-glass-calculator.git
cd liquid-glass-calculator
npm install
npm run dev
```

App runs at `http://localhost:5173`.

```bash
npm run build
npm run preview
```

## Key Decisions

Theme state is owned by App.jsx and passed as props to prevent split-state bugs after refresh. math.js handles expression evaluation with degree-to-radian conversion. GSAP provides precise animation sequencing. mathjs is split into a separate chunk to keep the main bundle small.

## Environment Variables

None required.

## Vercel Deployment

Push to GitHub, import in Vercel dashboard. Settings in vercel.json are applied automatically. No environment variables needed in Vercel dashboard.
