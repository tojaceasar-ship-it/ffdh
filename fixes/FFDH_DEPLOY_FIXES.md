# FFDH_DEPLOY_FIXES

Scope: Functional, A11y, Performance

## Applied
- Sanitize scripts/create-env-files.ps1 and add to .gitignore
- Fix Stripe init in app/api/checkout/route.ts (remove invalid apiVersion)
- Stabilize E2E tests (deterministic href navigation, strict selectors)

## Pending (Proposed)

### A11y
1) Add accessible name to mobile menu button in `src/components/Navbar.tsx`:
- Add `aria-label="Open menu"` to the toggle `<button>`.

2) Improve footer contrast in `src/components/Footer.tsx`:
- Replace `text-gray-500` with `text-gray-300` (or brighter) for links and small text.

3) Ensure document title on `/shop/cart`:
- In `app/shop/cart/page.tsx`, export `metadata = { title: 'Cart | FFDH' }`.

### Performance
4) Lazy-load non-critical images:
- Add `loading="lazy"` to non-hero `<img>` elements (cards, thumbnails).

5) Fonts
- Ensure `font-display: swap` (via next/font or CSS) to improve LCP.

6) Animations
- Reduce initial animation work on hero (Framer Motion) or defer with `prefers-reduced-motion`.

## patch.diff (not applied)

```
*** Update File: src/components/Navbar.tsx
@@
-  <button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:text-neon-yellow md:hidden">
+  <button aria-label="Open menu" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition-colors hover:text-neon-yellow md:hidden">
     <IconMenu className="h-6 w-6" />
   </button>
```

```
*** Update File: src/components/Footer.tsx
@@
-  <p className="text-gray-500 text-sm">© 2025 Fruits From Da Hood. All rights reserved.</p>
+  <p className="text-gray-300 text-sm">© 2025 Fruits From Da Hood. All rights reserved.</p>
@@
-  <a className="text-gray-500 transition-colors hover:text-neon-yellow" href="/privacy">Privacy Policy</a>
+  <a className="text-gray-300 transition-colors hover:text-neon-yellow" href="/privacy">Privacy Policy</a>
```

```
*** Update File: app/shop/cart/page.tsx
@@
+export const metadata = { title: 'Cart | Fruits From Da Hood' }
```

```
*** Update File: src/components/ProductCard.tsx
@@
-  <img
+  <img loading="lazy"
      src={image}
      alt={name}
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
  />
```

```
*** Update File: app/product/[slug]/layout.tsx
@@
   return {
-    title: `${product.name} | Fruits From Da Hood`,
+    title: `${product.name} | Fruits From Da Hood`,
     description: product.description,
     openGraph: {
       title: `${product.name} | Fruits From Da Hood`,
       description: product.description,
       images: product.imageUrl ? [product.imageUrl] : undefined,
     },
+    alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.slug}` },
   }
```

## Notes
- After applying, re-run: `npm run a11y`, `npm run lhci`. Targets in `lighthouserc.js` should then pass or be closer to thresholds.


