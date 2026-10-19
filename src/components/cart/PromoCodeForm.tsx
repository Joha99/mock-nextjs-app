"use client";

import { ApiError, getPromoCode } from "@/lib/api";
import { normalizePromoCode } from "@/lib/normalize";
import type { PromoCode } from "@/lib/types";
import { useState } from "react";

/**
 * 🛠️ FEATURE 7 — promo code input that calls the API.
 *
 * Flow:
 *   1. Controlled <input> + "Apply" button inside a <form>. Handle onSubmit
 *      and call e.preventDefault() (or you'll reload the page).
 *   2. Ignore empty/whitespace-only input.
 *   3. While the request is in flight: disable the button and show
 *      "Applying…". Prevent double-submits.
 *   4. Call getPromoCode(code) from src/lib/api.ts, then normalizePromoCode().
 *        - success: onApply(promo), clear the input
 *        - ApiError 404: show "That code doesn't exist"
 *        - anything else: show "Couldn't check that code. Try again."
 *   5. When a promo is applied, show "SAVE10 applied" with a "Remove" button
 *      that calls onApply(null), instead of the input.
 *   6. The *business* validation (expired, minimum spend, category) is NOT
 *      done here — calculateCartTotals returns promoError and the cart page
 *      displays it. The API only tells you the code exists.
 *
 * Accessibility: give the input a <label>, and put error text in an element
 * with role="alert" (or aria-live="polite") so screen readers announce it.
 *
 * Try: SAVE10, take20 (case-insensitive!), TECH15, OLDDEAL (expired), NOPE.
 */
export function PromoCodeForm({
  appliedPromo,
  onApply,
}: {
  appliedPromo: PromoCode | null;
  onApply: (promo: PromoCode | null) => void;
}) {
  const [code, setCode] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>();
  const [fetchStatus, setFetchStatus] = useState<
    "loading" | "success" | "error"
  >();

  const handleSubmit = () => {
    const formattedCode = code.trim();

    if (formattedCode === "") return;

    setFetchStatus("loading");
    setErrorMessage(undefined);

    getPromoCode(formattedCode)
      .then((res) => {
        const normalized = normalizePromoCode(res);
        setCode("");
        onApply(normalized);
        setFetchStatus("success");
      })
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          setErrorMessage(`That code doesn't exist`);
        } else {
          setErrorMessage(`Couldn't check that code. Try again.`);
        }
        setFetchStatus("error");
      });
  };

  const hasAppliedPromo = appliedPromo !== null;

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="flex gap-2 items-center">
          <label htmlFor="promo-code" className="font-semibold">
            Promo code:
          </label>
          {hasAppliedPromo ? (
            <p className="text-green-600 font-bold inline">
              {appliedPromo.code} applied
            </p>
          ) : (
            <input
              id="promo-code"
              name="promo-code"
              type="text"
              placeholder="SALE20"
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              className="rounded-3xl border border-gray-300 px-2"
            />
          )}
          {hasAppliedPromo && (
            <button
              type="button"
              className="bg-gray-300 px-2 rounded-3xl"
              onClick={() => {
                onApply(null);
              }}
            >
              Remove
            </button>
          )}
          {!hasAppliedPromo && (
            <button
              type="submit"
              className="bg-gray-300 px-2 rounded-3xl"
              disabled={fetchStatus === "loading"}
            >
              {fetchStatus === "loading" ? "Applying..." : "Apply"}
            </button>
          )}
        </div>
        {errorMessage && (
          <p aria-live="polite" className="text-xs text-red-600">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
