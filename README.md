# Shoply: Next.js interview practice

A small storefront app for practicing the kind of Next.js live-coding interview where you:

> "...work with API data, implement some business logic, and render the results in the UI. We're interested in how you break down the problem, communicate your thinking, write clear code, and debug."

The mock API, data, types and page skeletons are already in place. **You build the features.** The specs are in **[FEATURES.md](./FEATURES.md)**, and every file you need to touch has a `🛠️ FEATURE n` comment at the top explaining what to do.

```bash
npm run dev      # start the app at http://localhost:3000
npm test         # run the business-logic tests (they fail until you implement them)
npm run lint     # ESLint
npm run build    # production build; catches type errors too
```

---

## Next.js in 10 minutes (for React developers)

You already know React. Next.js is React plus **a router based on files**, **server rendering**, and **a way to write API endpoints**. This app uses the **App Router** (the `src/app` folder), which is the current default. If you find tutorials about `pages/` and `getServerSideProps`, that's the older Pages Router, so skip them.

### 1. Folders are URLs

```
src/app/
├── layout.tsx              → wraps EVERY page (header/nav, providers)
├── page.tsx                → "/"
├── products/
│   ├── page.tsx            → "/products"
│   ├── loading.tsx         → shown automatically while page.tsx is loading
│   ├── error.tsx           → shown automatically if page.tsx throws
│   └── [id]/
│       ├── page.tsx        → "/products/1", "/products/42", ... (dynamic)
│       ├── loading.tsx
│       └── not-found.tsx   → shown when the page calls notFound()
├── cart/page.tsx           → "/cart"
└── api/
    └── products/route.ts   → GET "/api/products"  (an API endpoint, not a page)
```

- `page.tsx`: the UI for a URL. A folder with no `page.tsx` isn't a page.
- `layout.tsx`: shared wrapper. It stays mounted when you navigate, so state inside it is kept.
- `route.ts`: an API endpoint. You export functions named after HTTP methods (`export async function GET(request) {}`).
- `[id]`: a dynamic segment. Its value arrives as `params.id`, **always a string**.
- `loading.tsx` / `error.tsx` / `not-found.tsx`: special files that Next wires up as Suspense, error and 404 boundaries for you.

### 2. Server Components vs Client Components (the big one)

**Every component is a Server Component by default.** It runs on the server and sends HTML to the browser, and its code never ships to the browser.

| | Server Component (default) | Client Component (`"use client"` at top of file) |
|---|---|---|
| `async` / `await` data directly | ✅ | ❌ (use `useEffect`, or get the data as props) |
| `useState`, `useEffect`, `useContext` | ❌ | ✅ |
| `onClick`, `onChange`, other event handlers | ❌ | ✅ |
| Browser APIs (`window`, `localStorage`) | ❌ | ✅ (but only after mount) |
| Ships JS to the browser | No | Yes |

**Rule of thumb:** fetch data in Server Components (pages), and push `"use client"` down to the small interactive leaves (a button, a filter bar, a form). A Server Component can render a Client Component and pass it props. The props must be serializable (data, not functions).

```tsx
// app/products/page.tsx (Server Component)
export default async function Page() {
  const products = await getProducts();          // runs on the server
  return <ProductList products={products} />;     // can render client components
}
```

```tsx
// components/LikeButton.tsx (Client Component)
"use client";
export function LikeButton() {
  const [liked, setLiked] = useState(false);
  return <button onClick={() => setLiked(!liked)}>{liked ? "♥" : "♡"}</button>;
}
```

If you see an error like *"useState only works in Client Components"* or *"Event handlers cannot be passed to Client Component props"*, you're missing a `"use client"` or putting interactivity in a Server Component.

### 3. Data fetching

In a Server Component, just `await fetch(...)` (or any async function). No `useEffect` or loading state is needed in the component, because `loading.tsx` handles it.

In a Client Component, fetch in an event handler (e.g. on form submit) or a `useEffect`, and manage `loading` / `error` state yourself. Feature 7 practices this.

`fetch` **does not throw on 404 or 500**. Always check `res.ok`.

### 4. Pages get `params` and `searchParams` as Promises

```tsx
export default async function Page(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;                 // from the URL path
  const { sort } = await props.searchParams;         // from ?sort=...
}
```

`PageProps<"/route">`, `LayoutProps` and `RouteContext` are typed helpers that Next generates globally. You don't import them.

### 5. Navigation

- `<Link href="/products/1">` from `next/link` does client-side navigation with prefetching. Use it instead of `<a>` for internal links.
- In Client Components, use `useRouter()`, `usePathname()` and `useSearchParams()` from **`next/navigation`** (not `next/router`, which is the old Pages Router).
- `notFound()` and `redirect()` from `next/navigation` work in Server Components.

### 6. Caching & "Cache Components" (just enough to not get confused)

This project was generated with the current `create-next-app` defaults, which turn on **Cache Components** (`cacheComponents: true` in `next.config.ts`). The model is:

- **By default, nothing is cached.** Every `fetch` and `await` in a Server Component runs fresh on each request.
- Anything that waits on uncached data **must be inside a `<Suspense>` boundary** (a `loading.tsx` file counts as one). Next pre-renders the part outside Suspense as an instant "shell" and streams the rest in. If you forget, the dev overlay shows a **"blocking-route"** / *"Uncached data was accessed outside of `<Suspense>`"* error. The fix is to add a `loading.tsx` or wrap the slow component in `<Suspense fallback={...}>`.
- To opt **in** to caching, put `"use cache"` at the top of an async function. You don't need it for this practice app.

⚠️ Your interview repo may be on an older Next version or have Cache Components off. In that "previous model", `fetch` results and pages *could* be cached by default, and you'd see `export const dynamic = "force-dynamic"` or `fetch(url, { cache: "no-store" })` to force fresh data. If you ever see **stale data**, check `next.config` and `package.json` first, and say that out loud.

### 7. Debugging tips

- **Where does my `console.log` show up?** In a Server Component it prints in the **terminal** running `npm run dev`. In a Client Component it prints in the **browser console**. People get caught by this all the time.
- The Network tab won't show fetches made by Server Components, because they happen on the server.
- React DevTools (browser extension) lets you inspect props and state of Client Components.
- The Next.js error overlay in the browser shows the stack trace. Read the first line carefully.
- *Hydration mismatch* errors mean the server HTML differed from the first client render. This is usually caused by `Date.now()`, `Math.random()`, `localStorage` or `window` used during render.

---

## Project map

```
src/
├── app/                      routes (see above)
│   ├── api/                  ✅ mock backend: don't need to touch
│   ├── products/             🛠️ Features 1, 3, 4
│   ├── cart/                 🛠️ Features 5, 6, 7
│   ├── admin/                🛠️ Feature 12 (Server Action + cache invalidation)
│   └── debug/                🐛 Feature 8
├── components/
│   ├── products/             🛠️ ProductCard, ProductFilters, AddToCartButton
│   ├── cart/                 🛠️ CartProvider, CartSummary, PromoCodeForm (CartLink ✅)
│   └── debug/                🐛 InventoryReport (has 4 planted bugs)
└── lib/
    ├── types.ts              ✅ RawProduct (API shape) vs Product (UI shape)
    ├── data/                 ✅ the "database" (seed data + in-memory store)
    ├── format.ts             ✅ formatCents, formatDate
    ├── api.ts                🛠️ fetch helpers
    ├── normalize.ts          🛠️ raw → clean data
    ├── pricing.ts            🛠️ cart math
    ├── cache.ts              🛠️ TTL/LRU cache + memoizeAsync (Feature 10)
    ├── catalog.ts            🛠️ "use cache" data functions (Feature 11)
    ├── store.ts / cartStore.ts 🛠️ external store + persistence (Feature 15)
    └── __tests__/            ✅ tests that describe the expected behavior
```

## The mock API

| Endpoint | Returns |
|---|---|
| `GET /api/products?page=1&limit=50` | `{ data: RawProduct[], page, limit, total, totalPages }` |
| `GET /api/products/:id` | `RawProduct`, or `404` / `400` |
| `GET /api/promo-codes/:code` | `RawPromoCode`, or `404` |
| `PATCH /api/products/:id` | admin update: `{ price_cents?, sale_price_cents?, stock? }` (Part 2) |
| `GET /api/products/:id/stock` | `{ id, stock, checked_at }`, fast and fresh (Part 2) |
| `GET /api/favorites` · `PUT`/`DELETE /api/favorites/:id` | `{ ids: number[] }` (Part 2) |
| `POST /api/orders` | 🛠️ you design it (Feature 13) |

Every request is logged in the `npm run dev` terminal (`[api #12] GET /api/products`), which is how you'll see caching work in Part 2. Data lives in memory: edits persist until you restart the dev server.

Every endpoint has fake latency (~600ms by default) and accepts:
- `?fail=true`: respond with a `500` so you can test error UI
- `?delay=2000`: change the latency so you can see loading states better

Open http://localhost:3000/api/products in the browser to see the raw data.

> If port 3000 is taken, `npm run dev` picks another port. Server Components fetch via the absolute `API_BASE_URL` in `src/lib/api.ts`, so then run `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 npm run dev` (with the actual port).

---

## How to practice

1. **Talk out loud, even alone.** The interview grades your communication as much as your code. Before you code each feature, say: what you understand the requirement to be, what's unclear (and what you'll assume), the pieces you'll break it into, and the order you'll build them in.
2. **Get something on screen fast, then refine.** For example, render `JSON.stringify(products)` first, then make it pretty.
3. **Time-box it.** Try Features 1–2 in ~25 min, 3–4 in ~25 min, 5–7 in ~45 min, and 8 in ~20 min.
4. **Do it twice.** Once slowly with the docs open (`node_modules/next/dist/docs/` has the docs for this exact version), then reset with `git stash` / a new branch and redo it faster without help.
5. **When stuck, narrate.** "I expected X, I'm seeing Y, my hypothesis is Z, let me verify by...". This *is* the debugging signal they're looking for.
