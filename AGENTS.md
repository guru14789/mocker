# AGENTS.md

## Project Structure

- **Client** (`/client`): React 18 + Vite + Tailwind + Zustand
- **Server** (`/server`): Express + MongoDB + Firebase Admin

## Commands

From **root** directory:
```bash
npm run install-all   # Install all dependencies (root + client + server)
npm run dev         # Run both client and server concurrently
```

From **/client**:
```bash
npm run dev         # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

From **/server**:
```bash
npm run dev       # Start with nodemon
npm start        # Start production
```

## Key Details

- **ESM vs CommonJS**: Client uses ESM (`"type": "module"` in package.json), server uses CommonJS
- **Environment**: Single `.env` in root directory; server reads it via `dotenv`
- **No test framework** configured
- **No lint/typecheck scripts** - use `npx eslint src/` in client if needed

## Before Committing

Always run `npm run build` in `/client` to verify client compiles.

## Do Not Modify

- ESLint configuration
- Project structure assumptions