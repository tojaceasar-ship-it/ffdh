#!/bin/bash

# FFDH Next.js Project Generator – 20-minute autonomous scaffold
# This script creates the complete project structure

PROJECT_DIR="ffdh-next"
TIMESTAMP=$(date +%s)

echo "🍉 Starting FFDH Next.js Project Generation..."
echo "Time: $(date)"
echo "---"

# 1. Create folder structure
echo "📁 Creating folder structure..."
mkdir -p {app,src/components/{ui,layout,sections,forms},src/lib/{sanity,integrations},src/services,src/store/slices,src/contexts,src/hooks,src/types,src/middleware,sanity/schemas,sanity/lib,sanity/plugins,public/assets/{images,icons,fonts},scripts}

# 2. Create TypeScript config
echo "🔧 Creating TypeScript config..."
cat > tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*", "app/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
EOF

# 3. Create Tailwind config
echo "🎨 Creating Tailwind config..."
cat > tailwind.config.ts <<'EOF'
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#FF1493',
        'neon-cyan': '#00CED1',
        'neon-yellow': '#FFD700',
        'neon-green': '#32CD32',
      },
      fontFamily: {
        headline: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        cta: ['Rajdhani', 'sans-serif'],
        accent: ['Bungee', 'cursive'],
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.1s ease-in-out',
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)' },
        },
        'glitch': {
          '0%': { transform: 'skew(0deg)', filter: 'hue-rotate(0deg)' },
          '50%': { transform: 'skew(2deg)', filter: 'hue-rotate(180deg)' },
          '100%': { transform: 'skew(0deg)', filter: 'hue-rotate(360deg)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
export default config
EOF

# 4. Create PostCSS config
echo "⚙️  Creating PostCSS config..."
cat > postcss.config.js <<'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF

# 5. Create Next.js config
echo "🚀 Creating Next.js config..."
cat > next.config.js <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'cdn.sanity.io' },
      { hostname: '*.printful.com' },
    ],
  },
  experimental: {
    optimizePackageImports: ['@reduxjs/toolkit', 'framer-motion'],
  },
}
module.exports = nextConfig
EOF

# 6. Create .env.example
echo "🔐 Creating .env.example..."
cat > .env.example <<'EOF'
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_AUTH_TOKEN=your_sanity_token

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Printful
PRINTFUL_API_KEY=your_printful_key

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 7. Create .gitignore
echo "📋 Creating .gitignore..."
cat > .gitignore <<'EOF'
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
EOF

echo "✅ Project structure created successfully!"
echo "📦 Next step: npm install"
echo "🚀 Then: npm run dev"
