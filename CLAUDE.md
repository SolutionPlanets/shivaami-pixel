# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js Version Warning

This project uses **Next.js 16.2.4** with **React 19**. APIs, conventions, and file-system behaviour differ from training data. Before writing any App Router code, read the relevant guide in `node_modules/next/dist/docs/01-app/`. Heed all deprecation notices.

Key difference: `params` in page components is now a **Promise** and must be awaited:
```ts
// Correct
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
}
```

## Commands

```bash
npm run dev      # start dev server
npm run build    # production build (also runs TypeScript check)
npm run lint     # ESLint
npx tsc --noEmit # type-check without building
```

## Architecture

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS 4 · shadcn/ui (via `@base-ui/react`) · TypeScript 5

**Path alias:** `@/` maps to `src/`

### Routing

| Route | Status |
|---|---|
| `/` | Landing page (full marketing site) |
| `/products` | Pixel 10 series catalog grid |
| `/products/[slug]` | Individual product page (SSG via `generateStaticParams`) |
| `/marketplace` | Order flow — not yet built |
| `/admin` | Admin dashboard — not yet built |

All pages manually compose `<Navbar />` + `<main>` + `<Footer />` — there is no shared layout that wraps content pages.

### Component organisation

- `src/components/layout/` — `Navbar` (client, scroll-aware, mobile Sheet drawer), `Footer`
- `src/components/landing/` — one component per landing-page section
- `src/components/products/` — catalog and product-detail components; all consume typed data from `src/lib/products.ts`
- `src/components/ui/` — shadcn primitives: `Button`, `Badge`, `Card`, `Sheet`, `Separator`
- `src/hooks/useInView.ts` — Intersection Observer scroll-reveal hook; returns `{ ref, isVisible }`
- `src/lib/products.ts` — **single source of truth** for all product data (specs, colors, AI features, ecosystem benefits)
- `src/lib/utils.ts` — `cn()` (clsx + tailwind-merge)

### Scroll-reveal pattern

All animated sections use `useInView` + CSS classes from `globals.css`:
```tsx
const { ref, isVisible } = useInView(0.1);
<div ref={ref as React.RefObject<HTMLDivElement>}
     className={`reveal delay-100 ${isVisible ? "visible" : ""}`}>
```
Available stagger delays: `delay-100` through `delay-500`.

### Design system

Tailwind 4 CSS-only config — no `tailwind.config.ts`. All tokens are CSS custom properties defined in `src/app/globals.css` `:root` block using OKLCH.

Key tokens:
- `primary` → Google Blue `#4285F4`
- `secondary` → Lavender `#E8D5FF`
- `accent` → Mint `#CEEAD6`
- `muted-foreground` → `#5F6368`
- `border` → `#DADCE0`
- Base radius `0.75rem`; cards use `rounded-2xl` / `rounded-3xl`; buttons/pills use `rounded-full`

Custom animation classes: `animate-float`, `animate-float-slow`, `animate-float-reverse`, `animate-pulse-glow`, `animate-spin-slow`.

### UI component notes

`Button` wraps `@base-ui/react/button` (not HTML `<button>`). For link-styled buttons use `buttonVariants()` + Next.js `<Link>`:
```tsx
import { buttonVariants } from "@/components/ui/button";
<Link href="/foo" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full")}>
```

### Product data

`src/lib/products.ts` exports the `Product` interface and an array of 4 products. Use `getProductBySlug(slug)` and `getAllProductSlugs()` — do not duplicate product data in components.

## Project context

**Client:** Shivaami (Mumbai) — authorised Google Partner, Pixel SMB dealership  
**Contact:** pixel@shivaami.com | +91 90 2222 3600  
**WhatsApp deep link:** `https://wa.me/919022223600`  
**Brand campaign headline:** "Empower Your Team. Elevate Productivity."

**Planned but not yet built:** `/marketplace` (order flow + Razorpay), `/admin` (dashboard), Supabase integration (auth, products, orders tables), Razorpay payment webhook.
