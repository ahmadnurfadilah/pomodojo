# 🥋 Pomodojo

> *"Train your focus. Together."*

A virtual co-working dojo where users can focus together in real-time. Turn solo work into a shared focus ritual with live avatars, Pomodoro timers, and themed environments.

## 🎯 Overview

**Pomodojo** is a virtual co-working space that brings accountability and presence to remote work. Each user appears as an avatar in a room, sets their own Pomodoro timer, moves freely in a themed environment, and enjoys background music set by the room owner. It's a social focus experience that transforms the lonely Pomodoro into a shared ritual.

## ✨ Features

- **🏠 Room System**: Create or join public/private rooms with custom themes
- **🧍 Live Presence**: Real-time avatars that move around the room
- **⏱️ Pomodoro Timers**: Individual timers with focus/break cycles
- **💬 Real-time Chat**: Communicate with other participants
- **🎨 Themed Environments**: Multiple room themes (Zen Garden, Cyber Loft, Meeting Room, etc.)
- **🎵 Background Music**: Room owners can set ambient music
- **📊 Leaderboard**: Track focus stats and compete with others
- **👤 User Profiles**: Track focus minutes, streaks, and achievements

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | TanStack Start | Routing, SSR, streaming, and interactivity |
| **Backend** | Convex | Real-time data, presence sync, room logic |
| **Authentication** | Clerk | User authentication and management |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | Radix UI + shadcn/ui | Accessible component library |
| **Monitoring** | Sentry | Error tracking and instrumentation |
| **Animations** | Motion (Framer Motion) | Smooth animations and transitions |
| **Icons** | Lucide React | Icon library |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm
- A Convex account and project
- A Clerk account (for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pomodojo
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_CONVEX_URL=your_convex_url
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

4. **Set up Convex**
   ```bash
   npx convex dev
   ```

   This will:
   - Create a `convex` folder if it doesn't exist
   - Deploy your functions and schema
   - Set up the Convex dashboard

5. **Set up Clerk**
   - Create a Clerk application
   - Configure authentication providers
   - Add your domain to allowed origins

6. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📁 Project Structure

```
pomodojo/
├── convex/              # Convex backend functions and schema
│   ├── schema.ts        # Database schema definitions
│   ├── rooms.ts         # Room-related functions
│   └── auth.config.ts   # Authentication configuration
├── src/
│   ├── components/      # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── header.tsx   # Header component
│   │   └── create-room-form.tsx
│   ├── routes/          # TanStack Start routes
│   │   ├── index.tsx    # Landing page
│   │   ├── rooms.tsx    # Rooms list
│   │   ├── rooms.$id.tsx # Individual room view
│   │   └── leaderboard.tsx
│   ├── integrations/    # Third-party integrations
│   │   ├── convex/      # Convex provider
│   │   └── tanstack-query/
│   ├── lib/             # Utility functions
│   └── styles.css       # Global styles
├── public/              # Static assets
└── package.json
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run check` - Format and lint in one command
- `npm start` - Start production server

## 🎨 Room Themes

Pomodojo includes several themed environments:

- 🌿 **Zen Garden** - Peaceful, minimalist focus space
- 🌃 **Cyber Loft** - Modern, tech-inspired environment
- 🏢 **Meeting Room** - Professional workspace vibe
- ☁️ **Cloud Room** - Light, airy atmosphere
- 🌙 **Midnight Café** - Cozy, late-night work ambiance
- 🚀 **Outer Space** - Futuristic, distraction-free zone

## 🔧 Development

### Adding New Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. To add a new component:

```bash
pnpx shadcn@latest add [component-name]
```

### Convex Functions

Server functions are automatically instrumented with Sentry. Wrap implementations with `Sentry.startSpan`:

```tsx
import * as Sentry from '@sentry/tanstackstart-react'

Sentry.startSpan({ name: 'Function name' }, async () => {
  // Your implementation
})
```

### Database Schema

The Convex schema defines the following tables:
- `rooms` - Room metadata and settings
- `roomParticipants` - Active users in rooms with positions and timers
- `pomodoroSessions` - Completed focus sessions
- `cursorPositions` - Real-time cursor/avatar positions
- `chatMessages` - Room chat messages

See `convex/schema.ts` for full schema definitions.

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages / Netlify

1. Connect your repository to the platform
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables:
   - `VITE_CONVEX_URL`
   - `VITE_CLERK_PUBLISHABLE_KEY`

### Deploy Convex

Convex functions are automatically deployed when you run:
```bash
npx convex deploy
```

---

Built with ❤️ using [TanStack Start](https://tanstack.com/start), [Convex](https://convex.dev), and [Clerk](https://clerk.com)
