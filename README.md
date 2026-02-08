# Untuk Kamu ❤️

A romantic, production-ready Next.js website created with love. A personal dedication to someone special, featuring beautiful animations, memories timeline, gallery of moments, and a heartfelt letter - all wrapped in elegant, aesthetic design.

## ✨ Features

- **Romantic Aesthetic Design** - Soft pastels (pink, red, beige, cream), elegant typography
- **Smooth Animations** - Framer Motion for fade, slide, float, and heart animations
- **Multiple Pages** - Home, About, Memories Timeline, Gallery, Love Letter
- **Custom Cursor** - Heart-shaped cursor that follows the mouse
- **Background Music** - Auto-playing romantic instrumental (with fallback behavior)
- **Fully Responsive** - Mobile-first design that looks great on all devices
- **Production-Ready** - TypeScript strict, zero console errors, optimized for Vercel
- **Docker Support** - Multi-stage Dockerfile for development and production
- **Environment Variables** - Customizable domain and configuration

## 🛠️ Technology Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Fonts**: Playfair Display (titles) + Lora (body) from Google Fonts
- **Deployment**: Vercel-ready (standalone output)
- **Containerization**: Docker with multi-stage build

## 📁 Project Structure

```
my-kasih/
├── app/
│   ├── layout.tsx              # Root layout with Navbar, Footer, Music Player
│   ├── page.tsx                # Home page with hero section
│   ├── globals.css             # Global styles & animations
│   ├── about/
│   │   └── page.tsx           # About us page
│   ├── memories/
│   │   └── page.tsx           # Timeline of cherished memories
│   ├── gallery/
│   │   └── page.tsx           # Photo gallery grid
│   └── letter/
│       └── page.tsx           # Love letter with scroll reveal
├── components/
│   ├── Navbar.tsx             # Navigation bar
│   ├── Footer.tsx             # Footer with links
│   ├── AnimatedText.tsx       # Typing effect component
│   ├── HeartCursor.tsx        # Custom heart cursor
│   ├── MusicPlayer.tsx        # Audio player
│   └── LoveTimeline.tsx       # Memory timeline
├── lib/
│   ├── constants.ts           # Site config, sample data
│   └── animations.ts          # Framer Motion variants
├── public/
│   ├── images/                # Gallery photos (customize here)
│   └── music/                 # Background music (add romantic-instrumental.mp3)
├── Dockerfile                 # Multi-stage production Dockerfile
├── docker-compose.yml         # Development environment setup
├── .env.example              # Environment variables template
├── tailwind.config.ts        # Tailwind CSS configuration
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ or Docker
- npm or yarn

### Local Development

1. **Clone and install**

```bash
cd my-kasih
npm install
```

2. **Setup environment**

```bash
cp .env.example .env.local
# Update NEXT_PUBLIC_DOMAIN if needed (default: ennoukesayangan)
```

3. **Run development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Docker Development

**Using Docker Compose (recommended for local development):**

```bash
docker-compose up dev
```

Visit [http://localhost:3001](http://localhost:3001)

**Using Docker directly:**

```bash
# Build image
docker build -t my-kasih .

# Run container
docker run -p 3000:3000 -e NODE_ENV=development my-kasih
```

## 🎨 Customization

### Update Site Information

Edit `lib/constants.ts`:

```typescript
export const SITE_NAME = "Untuk Kamu ❤️";
export const SITE_DESCRIPTION = "A romantic journey of love and memories";
export const DOMAIN = "ennoukesayangan"; // Your custom domain
```

### Add Your Own Memories

Edit `MEMORIES_DATA` in `lib/constants.ts`:

```typescript
export const MEMORIES_DATA = [
  {
    id: 1,
    date: "2024-01-15",
    title: "Our First Meeting",
    description: "Your custom memory description",
    emoji: "✨",
  },
  // Add more memories...
];
```

### Customize Gallery

1. Add images to `public/images/`
2. Update `GALLERY_PHOTOS` in `lib/constants.ts`
3. Modify gallery component to show actual images

### Add Background Music

1. Add your MP3 file to `public/music/romantic-instrumental.mp3`
2. The music player will auto-play (with fallback)

### Customize the About Page

Edit `app/about/page.tsx` - replace the sample text with your own story

### Personalize the Love Letter

Edit `app/letter/page.tsx` - the `letterText` array contains the letter content

### Adjust Colors

Colors are defined in:

- `tailwind.config.ts` - color palette
- `app/globals.css` - CSS variables and gradients

Current palette:

- Soft Pink: `#f8d7e6`
- Pastel Red: `#e6a1a1`
- Beige: `#f5f0eb`
- Cream: `#faf8f6`
- Romantic Red: `#d4757f`

## 🌍 Deployment to Vercel

### Zero-Config Deployment

1. **Push to GitHub** (if not already)

```bash
git init
git add .
git commit -m "Initial commit: Romantic website"
git push origin main
```

2. **Deploy to Vercel**

```bash
npm i -g vercel
vercel
```

Or visit [Vercel Dashboard](https://vercel.com) and import your repository

3. **Set Environment Variables** (in Vercel Dashboard)

- Go to Settings → Environment Variables
- Add: `NEXT_PUBLIC_DOMAIN=your-domain`
- Add: `NEXT_PUBLIC_SITE_URL=https://your-domain.com`

4. **Connect Custom Domain** (optional)

- In Vercel Dashboard → Settings → Domains
- Add your custom domain (e.g., ennoukesayangan.com)

### Environment Variables for Production

```env
NEXT_PUBLIC_DOMAIN=ennoukesayangan
NEXT_PUBLIC_SITE_URL=https://ennoukesayangan.com
NEXT_PUBLIC_SITE_NAME=Untuk Kamu ❤️
```

## 📦 Build & Production

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm start
```

### Using Docker for production

```bash
docker build -t my-kasih:latest .
docker run -p 3000:3000 -e NODE_ENV=production my-kasih:latest
```

## ✅ Quality Assurance

- **TypeScript**: Strict mode enabled - zero type errors
- **Linting**: ESLint configured - run `npm run lint`
- **Build Size**: Optimized with Next.js production build
- **Performance**:
  - Image optimization with next/image
  - Font optimization with next/font
  - CSS minification with Tailwind
  - Code splitting and lazy loading
- **Accessibility**: Semantic HTML, ARIA labels where needed
- **Mobile Responsive**: Tested at 375px, 768px, 1920px breakpoints

## 🎭 Animation Features

- **Fade In / Fade Out** - Smooth opacity transitions
- **Slide In** - Left, right, up, down movements
- **Scale** - Growth and shrink effects
- **Float** - Gentle up-down motion
- **Heart Beat** - Pulsing hearts
- **Stagger** - Sequential element animations
- **Scroll Reveal** - Elements appear as you scroll
- **Typing Effect** - Letter-by-letter text reveal

All animations use Framer Motion for smooth, GPU-accelerated performance.

## 🔒 Security Features

- No hardcoded sensitive data
- Environment variables for configuration
- Security headers in Next.js config
- Non-root Docker user
- HTTPS-ready for production

## 🐛 Troubleshooting

### Music not playing?

- Check `public/music/romantic-instrumental.mp3` exists
- Various browsers restrict auto-play - user must click play button first
- Check browser console for errors

### Styling not applying?

- Clear `.next` folder: `rm -rf .next`
- Rebuild: `npm run build`
- Clear browser cache

### Docker issues?

- Rebuild image: `docker build --no-cache -t my-kasih .`
- Check Node.js version: `docker run -it node:20-alpine node -v`

## 📄 License

This project is created with love and is for personal use. Feel free to customize and deploy to make it your own!

## 💝 Notes

This website is more than code - it's a testament to love, effort, and emotion. Every animation, color choice, and word has been carefully considered to create a meaningful digital experience.

Customization is encouraged! Make it truly yours by adding personal touches, memories, and heartfelt words.

---

Made with ❤️ using Next.js, Tailwind CSS, and Framer Motion.

Untuk kamu, selamanya. 💕
