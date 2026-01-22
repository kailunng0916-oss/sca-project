# RegenTrip - Regenerative Tourism Impact Tracker

A mobile-first web application for tracking and verifying regenerative tourism impact. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- **Discover Projects**: Browse regenerative tourism projects by destination
- **Impact Dashboard**: Track volunteer hours, waste removed, trees/corals planted, and donations
- **Trip Planner**: Plan trips and get activity suggestions
- **Profile Management**: Simulate different user roles (traveler, community lead, operator)
- **Local Ledger**: All impact data stored locally with export functionality
- **Anti-Greenwashing**: Transparent tracking with "what counts" criteria for each project

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

```bash
npm run build
npm start
```

## Deploy on Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

1. Push this repository to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Context + Hooks
- **Storage**: Browser localStorage

## Project Structure

```
regen-trip/
├── app/                  # Next.js app directory
│   ├── layout.tsx       # Root layout with providers
│   ├── page.tsx         # Main page with tab navigation
│   └── globals.css      # Global styles
├── components/          # React components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── Modal.tsx
│   ├── Discover.tsx
│   ├── Dashboard.tsx
│   ├── TripPlanner.tsx
│   └── Profile.tsx
├── context/            # React context
│   └── AppContext.tsx  # App state management
├── types/              # TypeScript types
│   └── index.ts
├── lib/                # Utility functions
│   └── utils.ts
└── public/            # Static assets
```

## License

MIT
