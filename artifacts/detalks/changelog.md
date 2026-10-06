# Changelog

## [2026-05-01]

### Added
- **PWA (Progressive Web App) Support**: The web application is now fully installable on iOS and Android devices directly from the browser (Add to Home Screen).
  - Generated and integrated 192x192 and 512x512 app icons matching the DeTalks brand (beige background, centered logo).
  - Created `manifest.json` defining the app name, start URL, and display properties (standalone mode).
  - Created `sw.js` (Service Worker) for basic offline caching of core assets.
  - Registered the service worker in `src/main.tsx`.
  - Added PWA-specific meta tags (`theme-color`, `apple-touch-icon`, `manifest`) to `index.html`.
- **Vercel Deployment**: Configured the project for standalone deployment on Vercel.
  - Added `vercel.json` to handle Single Page Application (SPA) routing/rewrites.

### Changed
- **Build Configuration**: Migrated away from Replit-specific configurations to a standard Vite environment.
  - Updated `vite.config.ts` to remove environment variable requirements (`PORT`, `BASE_PATH`) and Replit plugins.
  - Converted `package.json` to be standalone (resolved monorepo `catalog:` dependencies to strict versions, removed internal workspace packages).
  - Updated `tsconfig.json` to be entirely self-contained without extending from the monorepo base config.

### Fixed
- **UI Bug (Resources Page)**: Fixed an issue on `src/pages/Resources.tsx` where the horizontal topic filter pills ("Academic Pressure", "Loneliness", etc.) would squish and overlap each other on smaller screens. Added the `shrink-0` Tailwind class to ensure they maintain their intrinsic width and scroll horizontally as intended.
- **Vertical Overlap Bug (Resources Page)**: Fixed an issue where the list of article cards would overlap the category pills vertically when the "All" tab was selected. This occurred because the flex container's children were shrinking to fit the screen height when the content overflowed. Added `shrink-0` to the header, pills container, and cards container to prevent vertical squishing.
