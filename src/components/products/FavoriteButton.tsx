"use client";

/**
 * 🛠️ FEATURE 14 — an OPTIMISTIC favorite (♡/♥) toggle.
 *
 * The API (PUT/DELETE /api/favorites/:id) takes 800ms. A button that waits
 * for the server before turning red feels broken. An OPTIMISTIC update shows
 * the result immediately, assumes success, and quietly ROLLS BACK if the
 * request fails.
 *
 * Do it twice: first the manual way, then with React's built-in hook.
 *
 * ── Version A: manual optimistic update ──
 *   1. Keep `isFavorite` in useState, initialized from the prop.
 *   2. On click: remember the previous value, flip the state immediately,
 *      then await setFavorite(productId, next).
 *   3. If it throws: set the state back to the previous value and show a
 *      small error ("Couldn't save, try again").
 *
 * ── Version B: useOptimistic ──
 *   const [optimisticFav, setOptimisticFav] = useOptimistic(isFavorite);
 *   ...inside startTransition(async () => {
 *        setOptimisticFav(next);           // shows instantly
 *        await setFavorite(productId, next);
 *        setIsFavorite(next);              // commit on success
 *      })
 *   When the transition ends, React drops the optimistic value and goes back
 *   to the real state, so if the request failed, the rollback is automatic.
 *
 * Requirements:
 *   ✅ The heart flips instantly on click.
 *   ✅ With `?fail=true` added to the request URL, it flips and then flips
 *      back, and the user sees an error.
 *   ✅ Accessible: a real <button> with aria-pressed={isFavorite} and an
 *      aria-label like "Add Mechanical Keyboard to favorites".
 *   ✅ It lives inside a <Link> card, so clicking the heart must NOT navigate
 *      (hint: e.preventDefault() and e.stopPropagation()).
 *
 * Where does the initial value come from? The products page should fetch
 * getFavorites() (per-user, so NOT cached) and pass `initialFavorite` to each
 * card. That's a mix of a cached catalog (Feature 11) and uncached user data
 * on one page. Where does the Suspense boundary go?
 *
 * Discuss: what happens if the user clicks 3 times fast? Which request "wins"?
 * Why did the API design use idempotent PUT/DELETE instead of POST /toggle?
 */
export function FavoriteButton({ productId, productTitle, initialFavorite }: { productId: number; productTitle: string; initialFavorite: boolean }) {
  void productId;
  void productTitle;
  return (
    <button type="button" disabled aria-pressed={initialFavorite} className="text-zinc-400">
      {initialFavorite ? "♥" : "♡"}
    </button>
  );
}
