"use client"; // Error boundaries must be Client Components

/**
 * 🛠️ FEATURE 1 — error UI for /products.
 *
 * Special file: if page.tsx (or anything it renders) throws, Next shows THIS
 * instead of crashing the whole app. The header/nav from layout.tsx stays.
 *
 * TODO:
 *   - Show a friendly message, not the raw error.
 *   - Add a "Try again" button that calls `retry()` — it re-runs the page's
 *     data fetching.
 *   - console.error the error (in real life: send it to Sentry/Datadog).
 *
 * Test it: temporarily call getProducts({ fail: true }) in page.tsx.
 *
 * Note: in production, errors thrown in Server Components arrive here with a
 * generic message (to avoid leaking secrets) plus an `error.digest` id.
 */
export default function ProductsError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  void error;
  void retry;
  return <p className="text-red-600">TODO (Feature 1): something went wrong.</p>;
}
