ruan.dev

Personal portfolio site for Ruan Lewis — Creative Developer & Designer.

🔗 Live site: ruan-dev-mauve.vercel.app

Tech Stack
React 19 + TypeScript
Vite 6 — build tooling
Tailwind CSS 4 — styling
Framer Motion / Motion — animation
Three.js, @react-three/fiber, @react-three/drei — 3D graphics
Lenis — smooth scrolling
Supabase — backend/data
Express — server (server.ts)
Project Structure
.
├── components/ui/   # UI components
├── lib/             # Shared utilities/helpers
├── src/             # Application source
├── index.html       # Entry HTML
├── server.ts         # Express server
├── vite.config.ts    # Vite configuration
└── tsconfig.json     # TypeScript configuration
Getting Started
Prerequisites
Node.js (or Bun, since a bun.lock is included)
Installation
bash
npm install
Environment Variables

Create a .env.local file and add any required keys (e.g. Supabase credentials).

Development
bash
npm run dev

Starts the Vite dev server at http://localhost:3000.

Build
bash
npm run build

Outputs a production build to dist/.

Other Scripts
Script	Description
npm run clean	Removes the dist/ directory
npm run lint	Type-checks the project with tsc --noEmit
Deployment

The site is deployed on Vercel.

License

This project is personal/private and not licensed for reuse.
