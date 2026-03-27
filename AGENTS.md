# AGENTS.md - Development Guide for AI Agents

This file provides guidelines for AI agents working on this codebase.

## Project Overview

This is a monorepo with two main components:
- **Client** (`/client`): React 18 + TypeScript + Vite + Tailwind CSS frontend
- **Server** (`/server`): Node.js + Express backend with Firebase/MongoDB

---

## Build, Lint, and Test Commands

### Client Commands (from `/client` directory)

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint (no dedicated lint script - use npx eslint)
npx eslint src/
```

### Server Commands (from `/server` directory)

```bash
# Start server in development mode
npm run dev
# or
npm start

# No test framework configured
```

### Running a Single Test

There is no formal test framework configured. If adding tests, use Vitest for client:
```bash
npm install -D vitest
npx vitest run --single-thread
```

---

## Code Style Guidelines

### General

- Use **2 spaces** for indentation
- Use **single quotes** for strings in JavaScript
- Use **semicolons** at the end of statements
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names and React components

### Client (React + TypeScript)

- Use **`.tsx`** for React components
- Use **`.ts`** for TypeScript utility files
- Use **React hooks** (`useState`, `useEffect`, etc.) for state management
- Use **Tailwind CSS** for styling (not CSS modules or styled-components)
- Follow **React hooks rules** - run ESLint with `react-hooks` plugin
- Use **functional components** only (no class components)
- Use **TypeScript strict mode** - always define types

### Server (Node.js + Express)

- Use **CommonJS** (`require`/`module.exports`)
- Use **`.js`** extension for files
- Use **async/await** for asynchronous operations
- Use **Joi** for input validation
- Use proper **error handling** with try/catch blocks

### Imports

**Client:**
```typescript
import { useState } from 'react'
import axios from 'axios'
import './App.css'
```

**Server:**
```javascript
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files (components) | PascalCase | `AuthController.js`, `UserProfile.tsx` |
| Files (utils) | camelCase | `validateInput.ts`, `apiClient.ts` |
| Functions | camelCase | `getUserData()`, `handleSubmit()` |
| Components | PascalCase | `LoginForm`, `Dashboard` |
| Variables | camelCase | `userData`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| React Props | camelCase | `onSubmit`, `userName` |

### TypeScript Guidelines

- Always enable **strict mode**
- Define interfaces/types for all data structures
- Avoid `any` - use `unknown` when type is truly unknown
- Use `interface` for object shapes, `type` for unions/intersections
- Use `readonly` for immutable data

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'candidate' | 'creator';
}

const getUser = async (id: string): Promise<User> => {
  // implementation
}
```

### Error Handling

**Server (Express):**
```javascript
const handler = async (req, res) => {
  try {
    // logic
    res.status(200).json({ data });
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
```

**Client (React):**
```typescript
try {
  const response = await apiCall();
  setData(response.data);
} catch (error) {
  console.error('API Error:', error);
  setError('Failed to fetch data');
}
```

### Tailwind CSS

- Use utility classes for styling
- Follow the configured color palette in `tailwind.config.js`
- Use semantic class names when possible
- Example: `<div className="flex items-center justify-between p-4">`

---

## Project Structure

```
/client
  /src
    App.tsx          # Main app component
    main.tsx         # Entry point
    /assets          # Static assets
    /components      # React components
    /hooks           # Custom hooks
    /pages           # Page components
    /stores          # Zustand stores
    /utils           # Utility functions
  /public            # Public static files
  tailwind.config.js
  vite.config.js

/server
  /controllers       # Route handlers
  /routes            # Express routers
  /middleware        # Express middleware
  server.js          # Entry point
  firebase.admin.js  # Firebase admin setup

Root
  tsconfig.*.json    # TypeScript configs
  vite.config.ts     # Vite config
  eslint.config.js   # ESLint config
```

---

## Environment Variables

- Client: Uses `.env` in `/client`
- Server: Uses `.env` in `/server` or root
- Required variables include JWT_SECRET, Firebase config, MongoDB URI

---

## Notes for AI Agents

1. **Do not modify** the ESLint configuration unless necessary
2. **Always run** `npm run build` before committing to verify client compiles
3. **Use type-safe patterns** - avoid `as` type assertions when possible
4. **Handle errors gracefully** - never leave unhandled promise rejections
5. **Follow existing patterns** - match the code style in the relevant files
