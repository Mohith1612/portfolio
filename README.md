# Portfolio

A minimalist portfolio website showcasing backend engineering work and digital architecture. Built with Astro, React, and Three.js for a deliberately reductive, high-performance experience.

## Overview

This is a static-first portfolio that combines performance-optimized frontend architecture with deliberate design restraint. Every visual element and interaction serves a purpose—nothing is decorative.

**Key Philosophy**: Subtraction over addition. Clear, resilient systems that respect user experience and operational limits.

## Features

- **Dark/Light Theme System** - Automatic OS preference detection with localStorage persistence and smooth transitions
- **Interactive 3D Particle Background** - 1500 WebGL particles with real-time mouse interaction and theme-aware coloring
- **Custom Cursor** - Scales on interactive elements, gracefully degrades on touch devices
- **Scroll-Triggered Navbar** - Glassmorphism navbar that appears after scrolling with smooth fade animations
- **Performance Optimized** - Partial hydration, scroll-aware rendering, optimized for Core Web Vitals
- **Mobile-First Design** - Fully responsive, accessible, and touch-friendly
- **Smooth Navigation** - Scroll anchoring between sections with seamless transitions

## Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| **Framework** | Astro | 5.16.6 |
| **UI Library** | React | 19.2.3 |
| **Styling** | Tailwind CSS | 4.1.18 |
| **3D Graphics** | Three.js | 0.182.0 |
| **Package Manager** | Bun | - |
| **Build Tool** | Vite (via Astro) | - |
| **Language** | TypeScript | - |

**Theme Architecture**: CSS custom properties with Tailwind v4 theming for seamless dark/light mode switching.

## Project Structure

```
src/
├── layouts/
│   └── Layout.astro              # Root HTML template with theme script
├── pages/
│   └── index.astro               # Homepage with all sections
├── components/
│   ├── sections/                 # Page content (all static Astro)
│   │   ├── Hero.astro            # 3D particle background + intro
│   │   ├── About.astro           # Professional philosophy
│   │   ├── Experience.astro      # Work history timeline
│   │   ├── Projects.astro        # Portfolio showcase
│   │   ├── Writing.astro         # Blog/articles index
│   │   └── Footer.astro          # Contact and social links
│   ├── navigation/
│   │   └── Navbar.tsx            # Scroll-aware navbar (React)
│   ├── cursor/
│   │   └── CustomCursor.tsx      # Interactive cursor (React)
│   ├── ui/
│   │   └── ThemeToggle.tsx       # Dark/light mode switch (React)
│   └── visuals/
│       └── HeroParticlesThree.tsx # 3D particle system (React + Three.js)
├── lib/
│   ├── utils.ts                  # cn() utility for Tailwind class merging
│   └── theme.ts                  # Theme detection and management
├── styles/
│   └── global.css                # CSS variables, animations, Tailwind config
└── assets/
    └── (static files)
```

**Design Approach**:
- **Zero-JS sections** (About, Experience, Projects, Writing, Footer) use Astro components
- **Interactive features** (Navbar, Cursor, Theme, Particles) use React with `client:load` directive
- **Partial hydration** minimizes JavaScript bundle for static content

## Getting Started

### Prerequisites

- **Node.js** 18+ or **Bun** (recommended)
- Basic familiarity with Astro and React

### Installation

```bash
# Clone the repository
git clone https://github.com/Mohith1612/portfolio.git
cd portfolio

# Install dependencies (using Bun)
bun install

# Or using npm
npm install
```

### Development

```bash
# Start the dev server (hot reload at localhost:4321)
bun dev

# Or with npm
npm run dev
```

Visit `http://localhost:4321` to see your changes in real-time.

### Building for Production

```bash
# Build static site
bun build

# Preview production build locally
bun preview
```

The build outputs optimized HTML, CSS, and JavaScript to the `dist/` directory.

## Available Commands

All commands are run from the project root:

| Command | Action |
|---------|--------|
| `bun install` | Install project dependencies |
| `bun dev` | Start local dev server at `localhost:4321` |
| `bun build` | Build production-ready site to `./dist/` |
| `bun preview` | Preview the production build locally |
| `bun astro` | Access Astro CLI tools and utilities |

**Note**: Replace `bun` with `npm run` if using npm instead of Bun.

## Development Workflow

### Adding New Content

1. **Static Pages/Sections**
   - Create new `.astro` files in `src/components/sections/`
   - Import and add to `src/pages/index.astro`
   - No JavaScript is required or loaded

2. **Interactive Components**
   - Create `.tsx` files in appropriate `src/components/` subdirectories
   - Import into Astro files and use `client:load` directive
   - React handles interactivity; Astro strips unused code

3. **Styling**
   - Use Tailwind CSS utility classes
   - CSS variables (defined in `src/styles/global.css`) handle theming
   - Use the `cn()` utility from `src/lib/utils.ts` for conditional classes

### Theming

The project uses CSS custom properties for theme colors:

```css
/* Dark mode (default) */
--background: #0a0a0a;
--foreground: #ededed;
--accent: #a33333; /* Muted red/burgundy */

/* Light mode */
html.light {
  --background: #ffffff;
  --foreground: #171717;
}
```

Theme preference is detected automatically from system settings and persists via localStorage.

### Performance Optimization Tips

- Use Astro for static content (zero JavaScript)
- Only hydrate React components that need interactivity
- Defer non-critical Three.js initialization with `client:load`
- Leverage Tailwind's tree-shaking to minimize CSS bundle

## Features Deep Dive

### 3D Particle Background

- **Technology**: Three.js with WebGL renderer
- **Performance**: 1500 particles, high-performance renderer settings, pixel ratio capped at 2x
- **Interactivity**: Particles respond to mouse movement with damped rotation
- **Responsive**: Scales canvas to window size automatically
- **Optimization**: Rendering pauses when scrolled out of view (opacity = 0)
- **Theme-Aware**: Particle color updates automatically when theme changes

### Custom Cursor

- **Behavior**: Custom accent-colored dot on desktop, native cursor on touch devices
- **Scaling**: Grows 1.5x when hovering interactive elements (a, button, input, etc.)
- **Accessibility**: Uses `@media (pointer: fine)` to detect touch devices
- **Performance**: Hardware-accelerated with `transform` and `mix-blend-difference`

### Glassmorphism Navbar

- **Trigger**: Appears after scrolling 100px down the page
- **Style**: Translucent glass effect with backdrop blur
- **Navigation**: Smooth scroll to section anchors (#about, #experience, #projects, #writing)
- **Animation**: 700ms fade-in with slide-up transition

### Dark/Light Mode

- **Detection**: Respects OS preference via `prefers-color-scheme` media query
- **Persistence**: User selection saved to localStorage
- **Transitions**: Smooth 0.3s color transitions between themes
- **Flash Prevention**: Inline script in Layout.astro runs before DOM renders
- **Dynamic Updates**: MutationObserver in particles component watches for theme class changes

## Deployment

This is a static site generator—no server required. Deploy to any static host:

### Vercel (Recommended)

```bash
# Connect your GitHub repo to Vercel
# Vercel auto-detects Astro and builds automatically
```

### Netlify

```bash
# Connect your GitHub repo to Netlify
# Set build command: `bun build` or `npm run build`
# Set publish directory: `dist`
```

### GitHub Pages

```bash
# Build locally and push dist/ to gh-pages branch
bun build
# Configure GitHub Pages to serve from gh-pages branch
```

### Static File Server

Any HTTP server can host the `dist/` folder:

```bash
# Simple Python server
cd dist
python -m http.server 8000

# Or Node.js
npx http-server dist/
```

**Why Static Hosting?**
- No server maintenance required
- Lightning-fast global CDN distribution
- Excellent for SEO and Core Web Vitals
- Lower costs and better uptime guarantees

## Browser Support

- **Modern browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari 14+, Chrome for Android
- **Graceful degradation**: 3D particles and custom cursor degrade on unsupported devices
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation supported

## License

MIT License - feel free to use this as inspiration for your own portfolio.

## Contact

- **Email**: mohith.dev16@gmail.com
- **GitHub**: [@Mohith1612](https://github.com/Mohith1612)
- **LinkedIn**: [Mohith N](https://linkedin.com/in/mohith16/)

Have questions or want to collaborate? Reach out—I'd love to hear from you.

## Acknowledgments

- [Astro](https://astro.build) - Static site generator
- [React](https://react.dev) - Component library
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Three.js](https://threejs.org) - 3D graphics library
