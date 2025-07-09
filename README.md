# TFI Frontend - Sanchez Palomino

A modern Next.js application built with TypeScript, featuring authentication, state management, and a comprehensive UI system.

## Technology Stack

- **Next.js 14** - React framework with SSR/SSG 
- **React 18** - UI library with latest features
- **TypeScript 5.2** - Static type checking
- **Chakra UI 2.8** - Component library and design system
- **Custom Theme** - Extended Chakra UI theme with custom foundations
- **Responsive Design** - Mobile-first approach with custom breakpoints
- **React Query (TanStack Query) 5.22** - Server state management
- **React Hook Form 7.50** - Form state management and validation
- **Axios 1.6** - HTTP client with interceptors
- **NextAuth.js 4.24** - Authentication framework
- **JWT Tokens** - Secure session management
- **Security Headers** - XSS protection, frame options, DNS prefetch control
- **date-fns 3.6** - Date manipulation library
- **next-intl 3.17** - Internationalization
- **next-seo 6.4** - SEO optimization
- **ESLint** - Code linting
- **TypeScript Path Mapping** - Custom import aliases
- **React Query DevTools** - Development debugging tools

## Requirements

### Node.js Version
- **Node.js 18.x or higher** (recommended: Node.js 20.x LTS)
- **npm 9.x or higher**

### Recommended Setup
We recommend installing [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for Node.js and npm version management.

### Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_API_URL=your_api_url_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd tfi-fe-sanchezpalomino
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Copy the example environment file and configure your variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 4. Run the Development Server
```bash
npm run dev
```

<!-- Your application will be available at [http://localhost:3000](http://localhost:3000) -->

### 5. Build for Production
```bash
npm run build
npm start
```

### 6. Linting
```bash
npm run lint
```

## Deployment

**Production URL:** [https://tfi-fe-sanchezpalomino.onrender.com](https://tfi-fe-sanchezpalomino.onrender.com)

The application is automatically deployed on [Render.com](https://render.com) with the following configuration:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** Node.js
- **Auto-deploy:** Enabled (deploys on every push to main branch)

### Environment Variables (Production)
The following environment variables are configured in Render:
- `NEXTAUTH_SECRET` - NextAuth.js secret for session encryption
- `NEXTAUTH_URL` - Production URL for NextAuth callbacks
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Project Structure

```
├── components/          # Reusable UI components
├── layouts/            # Page layouts and templates
├── lib/                # Utility libraries
│   ├── helpers/        # Helper functions
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API services and clients
│   └── types/          # TypeScript type definitions
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   └── auth/           # Authentication pages
├── public/             # Static assets
├── styles/             # Styling and theme configuration
│   ├── components/     # Component-specific styles
│   └── foundations/    # Design system foundations
└── next.config.js      # Next.js configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint