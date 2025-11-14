# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**LandView App CMS** is a Next.js 15 application for managing and viewing 360-degree panoramic virtual tours of real estate properties (terrenos). The app uses Supabase for backend services (authentication, database, storage) and Photo Sphere Viewer for rendering interactive 360° panoramas with navigable hotspots.

## Tech Stack

- **Framework**: Next.js 15.5.4 with App Router and Turbopack
- **React**: 19.1.0 (Client Components primarily)
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS 4.1.14 with PostCSS
- **Backend**: Supabase (authentication, PostgreSQL database, storage)
- **3D Viewer**: Photo Sphere Viewer with markers and gallery plugins
- **Code Quality**: ESLint + Prettier (semicolons, single quotes)

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production (uses Turbopack)
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code with Prettier
npm run format
```

## Architecture

### Authentication Flow

- **Middleware** (`middleware.ts`): Uses Supabase SSR to handle session management on all routes
- Server-side session checking via `createServerClient` from `@supabase/ssr`
- Client-side auth uses `createBrowserClient` via `lib/supabaseClient.js`
- Protected routes redirect to `/login` if no active session exists

### Supabase Client Pattern

**CRITICAL**: The app uses TWO different Supabase client creation patterns:

1. **Client Components**: Create client using `createClient()` from `lib/supabaseClient.js`
   - Uses `createBrowserClient` from `@supabase/ssr`
   - Wrap in `useMemo()` to prevent recreating on every render

2. **Middleware/Server**: Use `createServerClient` directly
   - Handles cookie manipulation for SSR
   - See `middleware.ts` for reference implementation

### Database Schema

The app works with two main tables in Supabase:

1. **terrenos** (properties/lands)
   - `id`: UUID primary key
   - `title`: Property name
   - `image_urls`: Array of panoramic image URLs
   - `created_at`: Timestamp
   - Additional metadata fields

2. **hotspots** (navigation markers)
   - `id`: Integer primary key
   - `terreno_id`: Foreign key to terrenos
   - `panorama_index`: Which panorama image this hotspot appears on
   - `position_yaw`: Horizontal position in radians
   - `position_pitch`: Vertical position in radians
   - `title`: Hotspot label
   - `target_panorama_index`: Which panorama to navigate to when clicked
   - `image_url`: Optional custom icon (nullable)

### Route Structure

```
app/
├── page.tsx                    # Landing page (default Next.js template)
├── layout.tsx                  # Root layout with Geist fonts
├── login/page.js              # Authentication page
├── signup/page.js             # User registration (if exists)
├── dashboard/
│   ├── page.js                # Main dashboard - list all terrenos
│   ├── add-terrain/page.js    # Form to create new terreno
│   └── edit-terrain/[id]/page.js  # Edit terreno details
└── terreno/[id]/
    ├── page.js                # Public viewer for virtual tour
    ├── PhotoSphereViewer.js   # Main 360° viewer component
    └── editor/
        ├── page.js            # Hotspot management interface
        └── HotspotEditor.js   # Interactive hotspot editor component
```

### Key Components

**PhotoSphereViewer.js** (`app/terreno/[id]/PhotoSphereViewer.js`):

- Client-side component that renders 360° panoramas
- Uses `@photo-sphere-viewer/core` with `MarkersPlugin`
- Handles panorama switching via state (`currentIndex`)
- Manages hotspot markers that trigger navigation between panoramas
- Important: Uses multiple `useEffect` hooks with careful dependency management to prevent infinite re-renders
- Tracks loaded panorama index to avoid redundant setPanorama calls

**HotspotEditor.js** (`app/terreno/[id]/editor/HotspotEditor.js`):

- Administrative interface for adding/editing/deleting hotspots
- Allows clicking on panorama to add new navigation markers
- CRUD operations via `lib/hotspotsService.js`

### Service Layer

**lib/supabaseClient.js**:

- Exports `createClient()` function for browser-side Supabase client
- Validates environment variables are present
- Uses `createBrowserClient` from `@supabase/ssr`

**lib/hotspotsService.js**:

- Provides CRUD functions for hotspot management
- `getHotspotsByTerreno(terrenoId)`
- `createHotspot(hotspot)` - transforms client format to database format
- `updateHotspot(id, updates)`
- `deleteHotspot(id)`
- Handles field name mapping between app state and DB schema

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These are validated at runtime by `lib/supabaseClient.js`.

## Image Handling

- Configured in `next.config.ts` to allow images from Supabase storage domain
- Images stored as array of URLs in `terrenos.image_urls` field
- First image used as thumbnail in dashboard cards
- Uses Next.js `<Image>` component with fill/objectFit for responsive display

## Code Style

- **Prettier config**: Semicolons enabled, single quotes
- **ESLint**: Next.js core-web-vitals + Prettier integration
- Prettier warnings (not errors) to maintain flexibility
- TypeScript path alias: `@/*` maps to project root

## Common Patterns

### Fetching Data in Client Components

```javascript
const supabase = useMemo(() => createClient(), []);

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase.from('table').select('*');
    // handle data/error
  };
  fetchData();
}, [supabase]);
```

### Protected Route Pattern

```javascript
useEffect(() => {
  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
    }
  };
  checkAuth();
}, [supabase, router]);
```

### Hotspot Data Transformation

## Known Issues & Important Notes

1. **Photo Sphere Viewer Initialization**: The viewer requires careful useEffect dependency management to prevent infinite loops. Always check if viewer already exists before reinitializing.

2. **Mixed JS/TS Files**: The codebase has a mix of `.js` (client components) and `.tsx/.ts` files. New files should prefer TypeScript.

3. **Supabase Client Recreation**: Creating a new Supabase client on every render causes issues. Always memoize or create outside component scope where appropriate.

4. **Windows Development**: This project is developed on Windows (note the Windows path structure). Be mindful of path separators if contributing cross-platform.

5. **Turbopack**: The project uses Next.js Turbopack for faster builds. Some plugins may not be compatible yet.

## File Naming Conventions

- Route pages: `page.js` or `page.tsx`
- Components: PascalCase (e.g., `PhotoSphereViewer.js`, `HotspotEditor.js`)
- Utilities/services: camelCase (e.g., `supabaseClient.js`, `hotspotsService.js`)
- Config files: kebab-case or standard names (e.g., `next.config.ts`, `.eslintrc.json`)
