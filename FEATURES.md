# Features to build

Work through these in order, because later features build on earlier ones. Each one lists **what to build**, **acceptance criteria** (how you know you're done), **files**, and **things to talk about** (what a good candidate says out loud).

Status key: ✅ provided · 🛠️ you build · 🐛 you debug

---

## Feature 0: Orientation (10 min)

**Goal:** understand the codebase before writing code. In a real interview, spending the first few minutes reading and asking questions is a *plus*.

- [ ] `npm run dev`, open http://localhost:3000.
- [ ] Open http://localhost:3000/api/products and http://localhost:3000/api/products/1. Compare the JSON to `RawProduct` in `src/lib/types.ts`.
- [ ] Try `/api/products?fail=true` and `/api/products/999`.
- [ ] Read `src/lib/types.ts`. Notice `RawProduct` vs `Product`, and that money is in **cents**.
- [ ] Skim `src/lib/data/products.ts` and list the data problems you can see (casing, nulls, an inactive item, a bad sale price).
- [ ] `npm test`. Everything fails; that's expected.

**Talk about:** "Before I start, let me look at the data shape. I see the API returns snake_case with some nulls, so I'll want a normalization step..."

---

## Feature 1: Fetch & render the product list 🛠️

**Files:** `src/lib/api.ts` (`getProducts`), `src/app/products/page.tsx`, `src/components/products/ProductCard.tsx`, `src/app/products/loading.tsx`, `src/app/products/error.tsx`

**Build:**
1. Implement `getProducts()` in `api.ts`: build the URL, `fetch` with `{ cache: "no-store" }`, check `res.ok`, throw `ApiError` on failure, return the parsed JSON.
2. In `products/page.tsx`, make the component `async`, `await getProducts()`, and render a grid of `ProductCard`s.
3. Flesh out `ProductCard`: title, category pill, price (sale price + strikethrough original when on sale), rating or "No reviews yet", and an "Out of stock" badge.
4. Skeleton loading state in `loading.tsx`.
5. Friendly error state with a **Try again** button in `error.tsx`.

**Acceptance criteria:**
- [ ] `/products` shows 16 products (18 in the data minus 2 inactive, *once Feature 2 is done*).
- [ ] A count like "16 products" is shown.
- [ ] Prices display as `$149.99`, never `14999` or `$14999.00`.
- [ ] Refreshing shows the skeleton for ~600ms.
- [ ] With `getProducts({ fail: true })`, the error UI shows and **Try again** re-fetches.
- [ ] Clicking a card navigates to `/products/{id}` without a full page reload.

**Talk about:** why the page is a Server Component (no client JS for a static list, data fetched close to the source); why fetching lives in `api.ts`; why `res.ok` matters.

---

## Feature 2: Normalize messy API data 🛠️

**Files:** `src/lib/normalize.ts` (`normalizeProduct`, `normalizeProducts`)
**Tests:** `src/lib/__tests__/normalize.test.ts`

**Build:** convert `RawProduct` to `Product` following the rules in the file's comments: camelCase, trimmed/lowercased category, defaults for null/missing fields, drop invalid sale prices, `created_at` to `Date`, filter out inactive products.

**Acceptance criteria:**
- [ ] `npm test -- normalize` passes (except the promo-code tests, which belong to Feature 7).
- [ ] "Discontinued Lamp" and "Beta Smartwatch" never appear in the UI.
- [ ] "4K Webcam" is **not** shown as on sale (its sale price is higher than its regular price).
- [ ] "Linen Throw Blanket" shows "No reviews yet", not "0 stars".

**Talk about:** normalizing *at the boundary* so the rest of the app trusts its types; `null` rating ("unknown") vs `0` ("terrible"); what you'd do with *unknown* categories (drop? "other"? log?). Ask the interviewer.

---

## Feature 3: Search, filter & sort, synced to the URL 🛠️

**Files:** `src/components/products/ProductFilters.tsx` (Client Component), `src/app/products/page.tsx` (read `searchParams`), and a new pure function, e.g. `src/lib/filterProducts.ts`, with its own test file.

**URL params:** `q`, `category`, `sort` (`featured` | `price-asc` | `price-desc` | `rating` | `newest`), `inStock=1`. Full rules are in `ProductFilters.tsx`.

**Acceptance criteria:**
- [ ] Typing "tent" shows only the Ultralight Tent. The search is case-insensitive and matches the title or description.
- [ ] Category dropdown with "All" + 5 categories filters correctly.
- [ ] `price-asc` sorts by **effective** price (sale price when on sale). Merino Wool Beanie ($28.00) comes first and Ultralight Tent ($299.00 on sale, $349.00 regular) comes last.
- [ ] `rating` sorts highest first, and products with no rating go **last**.
- [ ] Filters combine (search + category + in-stock + sort all at once).
- [ ] Copy the URL, open it in a new tab, and you see the same filtered view with the inputs pre-filled.
- [ ] Search input is debounced (~300ms) and doesn't spam history entries.
- [ ] "No products match your filters" + a "Clear filters" button when the result is empty.

**Talk about:** URL as state (shareable, survives refresh, back button works); filtering on the server vs client and the tradeoffs; why the filter logic is a pure function; `Array.prototype.sort` mutates (copy first!).

---

## Feature 4: Product detail page 🛠️

**Files:** `src/lib/api.ts` (`getProduct`), `src/app/products/[id]/page.tsx`

**Build:** fetch one product by id, call `notFound()` on 404, and render the full details (spec in the file).

**Acceptance criteria:**
- [ ] `/products/1` shows sale price, struck-through original price, and "25% off".
- [ ] `/products/3` says "Out of stock". `/products/2` says "Only 3 left". `/products/7` says "In stock".
- [ ] `/products/8` (inactive) and `/products/999` show the "Product not found" page.
- [ ] `/products/abc` doesn't crash with an unhandled error. Decide what it should do (400 → not found?) and say why.
- [ ] Browser tab title is the product name (`generateMetadata`).

**Talk about:** dynamic segments; `params` is a string and a Promise; distinguishing 404 from 500; percent-off rounding (`Math.round`).

---

## Feature 5: Cart state 🛠️

**Files:** `src/components/cart/CartProvider.tsx`, `src/components/products/AddToCartButton.tsx`, `src/lib/pricing.ts` (`clampQuantity`), `src/app/cart/page.tsx`

**Build:** a context + reducer cart with `addItem`, `updateQuantity`, `removeItem`, `clear`, `itemCount`. Add an **Add to cart** button on the detail page and a cart page listing line items with quantity controls.

**Acceptance criteria:**
- [ ] Adding the same product twice gives one line with quantity 2, not two lines.
- [ ] Header badge shows total **units** (2 headphones + 1 book = 3).
- [ ] Can't exceed stock: Mechanical Keyboard (stock 3) maxes out at 3, and the button shows "Max in cart".
- [ ] Out-of-stock products can't be added.
- [ ] Setting quantity to 0 removes the line.
- [ ] Cart survives navigating between pages (it's in the layout).
- [ ] `clampQuantity` tests pass.
- [ ] Stretch: cart survives a full page refresh (localStorage, without a hydration error).

**Talk about:** why context (who reads the cart?) vs prop drilling vs a library; `useReducer` for related state transitions; immutability; storing `product` snapshot vs only `productId` (what if the price changes?).

---

## Feature 6: Pricing business logic 🛠️

**Files:** `src/lib/pricing.ts`, `src/components/cart/CartSummary.tsx`, `src/app/cart/page.tsx`
**Tests:** `src/lib/__tests__/pricing.test.ts`

**Rules** (full detail in `pricing.ts`):
1. Unit price = sale price if on sale, else regular price
2. Subtotal = Σ unit price × qty
3. One promo code max: percent or fixed, with optional minimum spend, category restriction, and expiry
4. Shipping: free when (subtotal − discount) ≥ $50, else $5.99, and $0 for an empty cart
5. Tax: 8.25% of (subtotal − discount), shipping not taxed, rounded to the cent
6. Total = subtotal − discount + shipping + tax

**Acceptance criteria:**
- [ ] `npm test -- pricing` passes.
- [ ] Cart page shows Subtotal / Discount / Shipping / Tax / Total.
- [ ] Shows "Add $X.XX more for free shipping" when below the threshold.
- [ ] No floating-point artifacts like `$10.000000001`. Everything stays in integer cents.

**Talk about:** pure functions + passing `now` in for testability; integer cents; order of operations (discount before tax? shipping taxed?). These are **product decisions**, so in an interview, *ask* rather than guess. Write a test before fixing a bug.

---

## Feature 7: Promo codes 🛠️

**Files:** `src/lib/api.ts` (`getPromoCode`), `src/lib/normalize.ts` (`normalizePromoCode`), `src/components/cart/PromoCodeForm.tsx`, `src/components/cart/CartProvider.tsx` (store `promo`)

**Build:** a form that looks up a code via the API (client-side fetch), stores the applied promo in cart state, and displays `promoError` from `calculateCartTotals`.

**Acceptance criteria:**
- [ ] `SAVE10` → 10% off. `take20` (lowercase) works too.
- [ ] `TAKE20` with a $40 cart → "Spend $60.00 more to use this code". Add items until it's ≥ $100 and the discount appears automatically, with no need to re-apply.
- [ ] `TECH15` with only books → "This code only applies to electronics items". Add headphones and 15% comes off **only** the headphones.
- [ ] `OLDDEAL` → "This code has expired".
- [ ] `NOPE` → "That code doesn't exist".
- [ ] Button disabled + "Applying…" while loading. Double-clicking sends one request (check the Network tab).
- [ ] Removing a promo restores the original totals.
- [ ] Remaining normalize tests pass.

**Talk about:** client-side fetch with loading/error state; why "code exists" (API) and "code applies to this cart" (business logic) are separate; race conditions (what if two requests resolve out of order? `AbortController`).

---

## Feature 8: Debug lab 🐛

**File:** `src/components/debug/InventoryReport.tsx` · **URL:** `/debug`

The page renders without crashing, but QA filed these 4 bug reports. For each: **reproduce → hypothesize → verify → fix → explain the root cause**. Try not to just eyeball the code. Practice using the tools (console, React DevTools, adding logs).

1. **"Total inventory value is way too low."** It shows $135.09. The real value (Σ price × stock) is $13,509.03.
2. **"The low-stock counter is stuck."** Change the threshold from 5 to 20. The label updates, but the count doesn't.
3. **"The 'All products (by ID)' table isn't in ID order."** It's sorted by stock instead, even though nobody asked for that.
4. **"Reorder checkboxes jump to the wrong product."** Tick "Reorder?" on *Cast Iron Skillet*, then tick "Hide out of stock". The check mark is now on a different product.

<details>
<summary>Hints (try first!)</summary>

1. What unit does `formatCents` expect?
2. When does that `useEffect` run? Does this value even need to be state?
3. Which array methods mutate in place?
4. What is React using to decide which `Row` keeps which state?

</details>

**Talk about:** derived state vs `useState` + `useEffect` (compute during render instead); why silencing `exhaustive-deps` is a smell; immutability; stable keys.

---

## Feature 9: Stretch goals (pick any)

- [ ] **Pagination:** use `?page=&limit=8` on the API. Add Prev/Next links that keep the current filters. (Note: once filtering is server-side and paginated, where should filtering happen? Discuss.)
- [ ] **Tests for `filterProducts`**, including the "rating nulls last" and "sort doesn't mutate input" cases.
- [ ] **Persist the cart** to `localStorage` without a hydration mismatch.
- [ ] **Optimistic UI**: "Added ✓" instantly, rolled back if something fails.
- [ ] **Server Action checkout**: a `"use server"` function that re-validates stock and prices on the server (never trust client totals!) and returns an order summary.
- [ ] **Accessibility pass**: keyboard-only navigation, visible focus states, labeled inputs, `aria-live` for cart updates.
- [ ] **Race condition**: in the promo form, type a code, apply, quickly apply a different code with `?delay=3000` on the first. Make sure the last request wins.
- [ ] **Client-side fetching version**: rebuild `/products` as a Client Component with `useEffect` + loading/error state. Compare the two approaches out loud.

---

## Interview-day checklist

- Restate the problem and ask clarifying questions before coding.
- Look at the real API response first.
- Sketch the component tree + where state lives (server? URL? context? local?).
- Build the happy path end-to-end, then loading/error/empty states, then polish.
- Keep business logic in pure functions; keep components dumb where possible.
- Narrate while debugging: expected vs actual → hypothesis → check.
- Leave time to mention what you'd do next (tests, a11y, edge cases).
