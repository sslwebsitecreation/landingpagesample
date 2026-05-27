# Riya Sri Silks — Saree Showcase

A mobile-first Ember.js application showcasing handloom and powerloom sarees from Riya Sri Silks. Features an interactive product catalog, video showcase studio, WhatsApp-based ordering, and local-first caching with IndexedDB.

## Features

- **Product Catalog** — 100+ products with color variants, pricing, discounts, and stock status
- **Video Showcase** — YouTube embed studio with shoppable product sidebar linked to each video
- **Search & Filter** — Full-text search, category browsing, multi-tag filtering with query params
- **WhatsApp Cart** — Build a tray of sarees, then send the complete order as a WhatsApp message
- **Skeleton Loading** — Shimmer-based skeleton screens shown while data loads
- **Toast Notifications** — Glassmorphism toast system with slide-down animation
- **Offline-First Caching** — IndexedDB + localStorage hybrid for instant reloads
- **Content Security Policy** — Locked-down CSP meta tag restricting scripts, frames, images, and fonts
- **Accessibility** — `act-as-a-button` modifier for keyboard-accessible interactive elements
- **Scroll Animations** — Intersection Observer-based reveal animations, GSAP parallax, CSS 3D transforms

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | Ember.js 3.28.8 (Octane) |
| Components | `@glimmer/component` v1.0.4 |
| Reactivity | `@glimmer/tracking` (`@tracked`) |
| Styling | Plain CSS with CSS custom properties |
| Animation | GSAP 3.15, Three.js 0.184 |
| Caching | IndexedDB + localStorage |
| Icons | Inline SVGs |
| Fonts | Inter + Playfair Display (Google Fonts) |
| Build | Ember CLI with webpack (ember-auto-import) |
| Minification | `ember-cli-terser` |
| Integrity | `ember-cli-sri` (Subresource Integrity) |

## Getting Started

```bash
git clone <repo-url>
cd dummysri
npm install
npm start          # ember serve → http://localhost:4200
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Development server with live reload |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | Run all linters |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm test` | Run linters + tests |
| `npm run build`  | Production build to `dist/` (output for Cloudflare Pages) |

## Architecture

### Routing (`app/router.js`)

| Route | Path | Purpose |
|-------|------|---------|
| `index` | `/` | Home — hero, categories, video studio, featured, testimonials |
| `collections` | `/collections` | Searchable product grid with filters and pagination |
| `product` | `/product/:product_id` | Single product detail with variants and enquiry |
| `cart` | `/cart` | Order tray with WhatsApp checkout |
| `about` | `/about` | Brand story |
| `privacy` | `/privacy` | Privacy policy |

Uses **hash-location** routing (`#/`) for static hosting compatibility.

### Services

| Service | Role |
|---------|------|
| `current-store` | Central data store — products, categories, cart, videos. Handles caching lifecycle and background refresh |
| `cache` | IndexedDB wrapper with version management via localStorage build stamp |
| `toast` | Toast notification queue with auto-dismiss and unique-ID DOM injection |
| `search` | Shared search/filter state consumed by topbar and search modal |
| `loading` | Global loading flag (used by collections route) |

### Data Flow

1. `fetchStoreData()` checks `cache.isCacheValid()` against build stamp
2. Cache hit → hydrate from IndexedDB immediately → background refresh from API
3. Cache miss → fetch from API → hydrate → persist to IndexedDB
4. All state flows through `@tracked` properties on `current-store` service
5. Components and controllers read reactively — no explicit re-render calls

### Security

- **CSP** enforced via `<meta http-equiv="Content-Security-Policy">` — restricts scripts to `'self' 'unsafe-eval'` (required by webpack), frames to YouTube only, images to trusted CDNs
- **`target="_blank" rel="noopener noreferrer"`** on all external links
- **Hash routing** prevents URL-based injection attacks
- **Ember auto-escaping** — all template output is HTML-escaped by default
- **IndexedDB** for catalog data (not localStorage) — no size limit, no sync blocking
- **Build stamp** for cache invalidation — every deploy busts stale cache
- **Subresource Integrity** via `ember-cli-sri`
- **No jQuery** — reduced attack surface

## Project Structure

```
app/
├── components/       # Reusable UI components
│   ├── product-card        # Product grid card with swatches
│   ├── video-showcase      # YouTube studio + shoppable sidebar
│   ├── toast-container     # Toast renderer
│   ├── topbar              # Navigation + search bar
│   ├── hero-flow           # Full-width hero with parallax
│   ├── category-carousel   # Infinite-scroll category orb carousel
│   ├── featured-collection # Signature series 3D showcase
│   ├── collection-tabs     # Trending / Specials tab switcher
│   ├── cinematic-promo     # Scroll-driven 3D promo card
│   ├── testimonials        # Client testimonial carousel
│   ├── search-filter-modal # Search + category + tag filter UI
│   └── loading-indicator   # Skeleton shimmer screen
├── controllers/      # Route-level logic
├── helpers/          # Template helpers (eq, add, sub, gt, gte, or, includes, take, category-count)
├── modifiers/        # Element modifiers
│   ├── act-as-a-button    # Keyboard + a11y for div buttons
│   ├── scroll-reveal      # Intersection Observer reveal
│   ├── parallax-scroll    # Scroll-driven translate
│   ├── autofocus          # Conditional autofocus
│   └── setup-3d           # Lifecycle hook for 3D setup
├── routes/           # Route handlers
├── services/         # Ember services
├── styles/           # Per-component CSS files
└── templates/        # Route templates
```

## Deployment (Cloudflare Pages)

This app is ready to deploy to Cloudflare Pages.

1. Connect your Git repository to Cloudflare Pages
2. Set the build command to `npm run build`
3. Set the build output directory to `dist/`
4. Deploy

> Hash routing (`/#/`) is used so every path resolves to `index.html` — no SPA redirect rules needed.

### Environment Variables (Cloudflare Pages)

Configure these in the Cloudflare Pages dashboard under **Settings > Environment variables**:

| Variable | Description | Example |
|----------|-------------|---------|
| `apiBaseUrl` | API base URL (relative or absolute) | `/api/v1` |
| `imageCdnUrl` | CDN base URL for product images | `https://images.example.com` |

> **Note:** In this Ember app, these values are currently hardcoded in `config/environment.js`. To make them truly dynamic per environment, you would need to inject them at build time via Cloudflare Pages build variables.

## Browser Support

Targets modern browsers (see `config/targets.js`):
- Latest 2 versions of Chrome, Firefox, Safari, Edge
- iOS Safari 12+
- Android Chrome (last 2 major versions)

## License

MIT
