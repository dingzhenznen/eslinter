# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 + TypeScript + Tailwind CSS project with Jest testing. Currently implementing a login page feature with form validation, password visibility toggle, and Toast notifications.

## Important: Next.js Version Note

**This is NOT the Next.js you know.** This project uses Next.js 16 with breaking changes - APIs, conventions, and file structure may differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Common Commands

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Building
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run all tests
npm test -- <path>   # Run single test file (e.g., npm test -- src/__tests__/login/useLoginForm.test.ts)
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report

# Linting
npm run lint         # Run ESLint
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Home page
│   └── login/
│       └── page.tsx        # Login page (in progress)
├── components/
│   ├── login/
│   │   ├── useLoginForm.ts    # Form logic hook
│   │   ├── PasswordInput.tsx  # Password input with visibility toggle (planned)
│   │   └── LoginForm.tsx      # Login form component (planned)
│   └── ui/
│       └── Toast.tsx          # Toast notification component (planned)
└── __tests__/              # Tests mirror source structure
    ├── page.test.tsx
    └── login/
        └── useLoginForm.test.ts
```

## Architecture Patterns

### Path Aliases
- `@/` maps to `src/` - use for all imports (e.g., `import { useLoginForm } from '@/components/login/useLoginForm'`)

### Testing Pattern
- Tests are co-located in `src/__tests__/` mirroring the source structure
- Uses Jest with jsdom environment and React Testing Library
- Tests include: `describe` blocks with `it` cases, `render`/`renderHook` for components, `act` for interactions

### Styling
- Tailwind CSS v4 with PostCSS
- Uses Geist font family (configured in layout.tsx)
- Dark mode support via `dark:` prefix classes

### Component Patterns
- Custom hooks for form logic (see `useLoginForm.ts`)
- Props interfaces defined inline with TypeScript
- Client components marked with `'use client'` directive

## Key Configuration Files

- `jest.config.ts` - Jest configuration using `next/jest` preset
- `jest.setup.ts` - Imports `@testing-library/jest-dom`
- `eslint.config.mjs` - ESLint flat config using `eslint-config-next`
- `tsconfig.json` - TypeScript with path alias `@/*`
- `next.config.ts` - Next.js configuration (currently minimal)

## Form Validation Rules

Per the design spec (`docs/superpowers/specs/2025-04-27-login-page-design.md`):

| Field | Rule | Error Message |
|-------|------|---------------|
| Username | Required, 3-20 chars | "请输入用户名" / "用户名需3-20个字符" |
| Password | Required, min 6 chars | "请输入密码" / "密码至少6个字符" |

## Implementation Plans

Active implementation plan located at:
- `docs/superpowers/plans/2025-04-27-login-page.md` - Full TDD implementation plan for login page
- `docs/superpowers/specs/2025-04-27-login-page-design.md` - Design specification

Follow these plans when implementing the login feature.
