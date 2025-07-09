# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FTGO Web is a frontend monorepo for the FTGO food delivery platform, connecting to the FTGO Rust backend service located at `../ftgo-rust`. Built with pnpm workspaces, it's designed to support three separate web applications:

### Apps Structure
- `apps/ftgo-restaurant-web`: Restaurant management interface (currently implemented)
- `apps/ftgo-consumer-web`: Consumer ordering interface (planned)
- `apps/ftgo-courier-web`: Courier delivery interface (planned)

### Packages Structure
- `packages/ui`: Shared UI components library (currently empty/stub)
- `packages/util`: Shared utilities including networking code
- Additional shared packages for common functionality across apps

## Environment Setup

### Initial Setup
1. Copy the environment template:
```bash
cp .env.dist .env
```

2. Update `.env` with your backend configuration:
```bash
# FTGO API Backend URL
VITE_FTGO_API_URL=http://localhost:8100

# Development settings
NODE_ENV=development
```

3. Install dependencies:
```bash
pnpm install
```

### Environment Variables
- **VITE_FTGO_API_URL**: URL of the FTGO Rust backend (default: http://localhost:8100)
- **NODE_ENV**: Environment mode (development/production)

## Development Commands

### Root Level Commands
```bash
# Install dependencies for all packages
pnpm install

# Format and lint all code
pnpm exec biome format --write .
pnpm exec biome lint --write .
```

### Web Apps (from app directories)
```bash
# Restaurant app (apps/ftgo-restaurant-web)
cd apps/ftgo-restaurant-web
pnpm dev          # Development server with HMR
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Type checking

# Consumer app (apps/ftgo-consumer-web) - when implemented
cd apps/ftgo-consumer-web
pnpm dev          # Development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Type checking

# Courier app (apps/ftgo-courier-web) - when implemented
cd apps/ftgo-courier-web
pnpm dev          # Development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm typecheck    # Type checking
```

### UI Package (`packages/ui`)
```bash
# Development server
pnpm dev

# Build package
pnpm build

# Lint code
pnpm lint

# Preview build
pnpm preview
```

## Architecture

### Monorepo Structure
- **Package Manager**: pnpm with workspace configuration
- **Build System**: Vite for bundling and development
- **Code Quality**: Biome for formatting and linting at root level, ESLint for React-specific rules in packages
- **Backend Connection**: Connects to FTGO Rust backend at `../ftgo-rust`

### Web Applications Architecture
All three web apps (restaurant, consumer, courier) follow the same architectural patterns:
- **Framework**: React Router v7 with full-stack capabilities
- **Styling**: Tailwind CSS v4 with Vite plugin
- **Language**: TypeScript with strict type checking
- **Routing**: File-based routing with `routes.ts` configuration
- **Server**: Built-in React Router server for SSR
- **Shared Components**: Import from `packages/ui` for consistency

### Key Technologies
- React 19 with concurrent features
- React Router v7 (full-stack framework)
- Tailwind CSS v4 (latest version)
- TypeScript 5.8+
- Vite 6+ for build tooling
- Biome for code formatting and linting
- Docker support for containerized deployment

## Code Style and Standards

### Formatting
- **Biome** is configured at the root level with:
  - Space indentation
  - Double quotes for JavaScript/TypeScript
  - Organize imports enabled
  - Recommended linting rules

### TypeScript
- Strict type checking enabled
- React Router's type-safe routing with generated types
- Path aliases configured via `vite-tsconfig-paths`

### React Patterns
- Functional components with hooks
- React Router v7 conventions for routes, loaders, and actions
- Type-safe route definitions using Route types
- Error boundaries for graceful error handling

## Testing and Quality

### Type Checking
```bash
# Type check all apps
cd apps/ftgo-restaurant-web && pnpm typecheck
cd apps/ftgo-consumer-web && pnpm typecheck      # when implemented
cd apps/ftgo-courier-web && pnpm typecheck       # when implemented
```

### Linting
```bash
# Root level formatting and linting
pnpm exec biome check --write .

# Package-specific ESLint (ui package)
cd packages/ui && pnpm lint
```

## Deployment

### Docker
Each web app includes multi-stage Docker configuration:
- Development dependencies stage
- Production dependencies stage  
- Build stage
- Final runtime stage with Node.js Alpine

Note: Current Docker configuration assumes npm but project uses pnpm (may need adjustment)

### Build Process
1. Install dependencies
2. Run type checking
3. Build with Vite/React Router
4. Output to `build/` directory with client and server assets

## Backend Integration

### FTGO Rust Backend
- **Location**: `../ftgo-rust` (relative to this repository)
- **Repository**: https://github.com/jangjunha/ftgo-rust
- **Connection**: Each web app connects to the Rust backend API endpoints via environment variable
- **Configuration**: Set `VITE_FTGO_API_URL` in `.env` file (defaults to http://localhost:8100)
- **Development**: Ensure the Rust backend is running locally during development

## Important Notes

- This is a **frontend-only** project that connects to the FTGO Rust backend service
- Three separate web applications for different user types (restaurant, consumer, courier)
- Currently only `ftgo-restaurant-web` is implemented; `ftgo-consumer-web` and `ftgo-courier-web` are planned
- The UI package is currently a stub/placeholder for shared components
- Uses latest React Router v7 conventions (not Remix)
- Monorepo setup enables shared components and consistent architecture across all apps
- All apps follow the same architectural patterns for consistency