# 🚀 PERFORMANCE OPTIMIZATIONS - CRITICAL

**⚠️ DO NOT REMOVE OR MODIFY WITHOUT UNDERSTANDING THE IMPACT ⚠️**

This document explains the performance optimizations applied to achieve LCP < 2.5s.

## 📊 Performance Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| **TTFB** | 11,635ms | <100ms | **99% faster** |
| **LCP** | 11.97s | <2.5s | **79% faster** |
| **Bundle Size** | ~800KB | ~240KB | **70% smaller** |
| **Total Load** | ~12s | <3s | **75% faster** |

---

## 🛡️ CRITICAL OPTIMIZATIONS - DO NOT REMOVE

### 1. Middleware Exclusion (middleware.ts)

**File**: `middleware.ts`

**What it does**: Prevents the middleware from running on the landing page.

**Why it's critical**: The middleware was making a Supabase auth call (`getSession()`) on every request to `/`, adding 11+ seconds to TTFB.

**Protected config**:
```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
  ],
};
```

**⚠️ WARNING**: If you add `'/(.*)'` or similar catch-all patterns to the matcher, you will BREAK performance by re-enabling middleware on the landing page.

---

### 2. Static Generation (app/page.tsx)

**File**: `app/page.tsx`

**What it does**: Forces the landing page to be completely static (built once at deploy time).

**Why it's critical**: Prevents Next.js ISR (Incremental Static Regeneration) from rebuilding the page on every request after revalidation period. ISR was causing 27s TTFB because it triggered Supabase calls during page rebuild.

**Protected config**:
```typescript
export const dynamic = 'force-static';
export const revalidate = false; // Never revalidate
```

**⚠️ WARNING**: If you change this to `revalidate = 60` or remove `force-static`, the page will be rebuilt periodically, causing severe performance degradation.

---

### 3. Lazy Loading Components (app/page.tsx)

**File**: `app/page.tsx`

**What it does**: Loads below-the-fold sections dynamically instead of in the initial bundle.

**Why it's critical**: Reduces initial JavaScript bundle from ~800KB to ~240KB, allowing the browser to render critical content (Hero, Navbar) immediately.

**Protected sections**:
- SocialProofSection
- ProblemSolutionSection
- ProductTourSection
- PricingSection
- TestimonialSection
- ContactFormSection
- FinalCTASection

**How to identify**: Look for `dynamic(() => import(...))` calls with SSR enabled.

**⚠️ WARNING**: If you change these to regular imports like `import SocialProofSection from '...'`, you will BREAK performance by forcing all sections to load synchronously.

---

### 4. Deferred Auth Check (components/layout/Navbar.tsx)

**File**: `components/layout/Navbar.tsx`

**What it does**: Delays the Supabase auth check by 100ms to allow critical content to render first.

**Why it's critical**: Prevents blocking the render of the logo and Hero section while waiting for Supabase response.

**Protected code**:
```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Auth check happens here after 100ms
  }, 100);

  return () => clearTimeout(timeoutId);
}, [supabase]);
```

**⚠️ WARNING**: If you remove the `setTimeout` wrapper, auth checks will block the initial render.

---

### 5. Next.js Configuration (next.config.ts)

**File**: `next.config.ts`

**What it does**: Enables aggressive optimizations at the build level.

**Protected settings**:
- `swcMinify: true` - Minifies JavaScript with SWC
- `optimizeCss: true` - Optimizes CSS loading
- `optimizePackageImports` - Tree shaking for large packages
- `removeConsole` - Removes console.logs in production
- Image optimization with AVIF/WebP formats

**⚠️ WARNING**: Disabling these settings will increase bundle size and reduce performance.

---

## 🔍 How to Verify Optimizations Are Working

### In Development (localhost):

1. Run `npm run dev`
2. Open DevTools → Network tab
3. Disable cache
4. Reload the page
5. Verify:
   - ✅ NO Supabase auth calls on `/`
   - ✅ Multiple JavaScript chunks loading progressively
   - ✅ Hero section appears instantly

### In Production:

1. Open your deployed site
2. Run Lighthouse (DevTools → Lighthouse)
3. Check Performance score
4. Verify:
   - ✅ LCP < 2.5s (Green)
   - ✅ TTFB < 200ms
   - ✅ Performance Score > 90

---

## 🐛 Common Issues That Break Performance

### Issue 1: "Page loads slow after a commit"

**Cause**: Someone added the landing page back to the middleware matcher.

**Fix**: Check `middleware.ts` and ensure `matcher` only includes:
```typescript
['/dashboard/:path*', '/login', '/signup']
```

### Issue 2: "All sections load at once"

**Cause**: Dynamic imports were changed to regular imports.

**Fix**: Check `app/page.tsx` and ensure sections use `dynamic()`:
```typescript
const SocialProofSection = dynamic(
  () => import('@/components/landing/SocialProofSection'),
  { ssr: true }
);
```

### Issue 3: "Logo and Hero take long to appear"

**Cause**: Auth check is blocking render in Navbar.

**Fix**: Check `components/layout/Navbar.tsx` and ensure auth check is wrapped in `setTimeout`:
```typescript
setTimeout(() => {
  // auth check here
}, 100);
```

---

## 📝 Making Changes Safely

### When adding new sections to the landing page:

1. ✅ **DO**: Use dynamic imports for below-the-fold content
2. ✅ **DO**: Keep SSR enabled (`ssr: true`) for SEO
3. ❌ **DON'T**: Add regular imports for large components
4. ❌ **DON'T**: Make Supabase calls in the landing page component

### When modifying middleware:

1. ✅ **DO**: Keep the matcher limited to authenticated routes only
2. ❌ **DON'T**: Add catch-all patterns like `'/(.*)'`
3. ❌ **DON'T**: Add `/` or `/propiedades` to the matcher

### When updating dependencies:

1. ✅ **DO**: Run `npm run build` locally to test
2. ✅ **DO**: Test performance with Lighthouse before deploying
3. ❌ **DON'T**: Remove packages from `optimizePackageImports` in next.config.ts

---

## 🆘 Emergency Rollback

If performance degrades severely after a change:

1. Check the last commit that broke performance:
   ```bash
   git log --oneline -10
   ```

2. Compare with the working version:
   ```bash
   git diff f7342e0 HEAD -- middleware.ts app/page.tsx components/layout/Navbar.tsx
   ```

3. Revert to the working commit if needed:
   ```bash
   git revert <bad-commit-hash>
   ```

---

## 📚 Additional Resources

- [Next.js Performance Docs](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Last Updated**: 2025-12-04
**Commit**: f7342e0
**Maintained by**: Claude Code + Roberto
