# Sticky Notes

A single-page web application for managing sticky notes on a virtual board. Built with React and TypeScript, no third-party UI libraries.

## Features

- **Create notes** — Click anywhere on the board to place a new note
- **Move notes** — Drag a note by its header or body to reposition it
- **Resize notes** — Drag the right edge, bottom edge, or bottom-right corner
- **Delete notes** — Drag a note to the trash zone at the bottom of the screen
- **Edit text** — Double-click a note to enter edit mode
- **Bring to front** — Clicking a note brings it above overlapping notes
- **Color picker** — Choose from 6 colors before creating a note
- **Persistent storage** — Notes are saved to localStorage and restored on page load
- **Mock REST API** — All persistence goes through an async API layer with simulated network delays

## Tech Stack

- **React 19** (no stock/third-party UI components)
- **TypeScript**
- **Vite**

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/facufrastas/tempo-sticky-notes.git
cd sticky-notes
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## Architecture

The application is a pure client-side single-page application built with React 19 and TypeScript, bundled with Vite. It has no backend server — instead, all persistence flows through a mock async REST API layer (`api.ts`) that wraps browser `localStorage` with simulated network delays, making it straightforward to swap in a real backend in the future. The data model is a flat array of `Note` objects, each carrying position, dimensions, text, color, and z-index, serialized as JSON.

State management is handled entirely through React hooks. A custom `useNotes` hook centralizes all CRUD operations and exposes them to the main `App` component. Updates follow an optimistic UI pattern: the React state is modified immediately on user interaction, while a debounced persistence function (300 ms) batches writes to the API layer, keeping the interface responsive without excessive storage writes.

The UI is composed of a small set of focused components — `StickyNote`, `Toolbar`, `ColorPicker`, and `TrashZone` — all styled with inline CSS (no third-party UI or styling libraries). Drag, resize, and drop-to-delete interactions rely on the Pointer Events API with pointer capture for reliable cross-browser behavior. Z-index management uses a global counter so that the most recently interacted note always appears on top.

## Browser Support

- Google Chrome (latest, Windows & Mac)
- Mozilla Firefox (latest, all platforms)
- Microsoft Edge (latest)

Minimum screen resolution: 1024x768.

## Project Structure

```
src/
├── components/
│   ├── ColorPicker.tsx   # Color selection toolbar widget
│   ├── StickyNote.tsx     # Individual note with drag, resize, and edit
│   ├── Toolbar.tsx        # Top toolbar with instructions and color picker
│   └── TrashZone.tsx      # Drop zone for deleting notes
├── api.ts                 # Mock async REST API (localStorage-backed)
├── types.ts               # Shared types and constants
├── useNotes.ts            # Notes state management hook
├── App.tsx                # Main application component
├── main.tsx               # Entry point
└── index.css              # Global styles
```
