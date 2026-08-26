// ==================== STRIPE CARD CHECKOUT ====================

import React, { useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../utils/constants";

/**
 * Stripe.js is a single ~200KB script shared by every mount, and loadStripe
 * caches nothing across calls — so memoise per publishable key rather than
 * re-downloading it each time the buyer re-initiates.
 */
const stripeLoaders = new Map();

const getStripe = (publicKey) => {
  if (!stripeLoaders.has(publicKey)) {
    stripeLoaders.set(publicKey, loadStripe(publicKey));
  }
  return stripeLoaders.get(publicKey);
};

/**
 * Collect card details for an existing PaymentIntent and confirm it.
 *
 * The backend creates the intent (`POST /shares/buy` → `clientSecret` +
 * `publicKey`) and re-reads it server-side on verify, so nothing here is trusted
 * for fulfilment: this only drives the confirmation and then asks the API to
 * credit the shares.
 */
const CardForm = ({ darkMode, amountLabel, onConfirmed }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || submitting) return;

    setSubmitting(true);
    setError(null);

    // `redirect: "if_required"` keeps plain card payments inline and only leaves
    // the page for methods that genuinely need it (3DS, bank redirects). Those
    // land on /payment/callback, which recovers the reference from
    // sessionStorage and verifies there instead.
    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}${ROUTES.PAYMENT_CALLBACK}?gateway=stripe`,
      },
      redirect: "if_required",
    });

    if (confirmError) {
      setError(confirmError.message || "Your card could not be charged.");
      toast.error(confirmError.message || "Your card could not be charged.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      // Charged. The shares are credited by the verify call, not by Stripe.
      await onConfirmed();
      setSubmitting(false);
      return;
    }

    // `processing` (and anything else non-terminal) settles asynchronously —
    // Stripe has the money in hand but the intent is not `succeeded` yet, so
    // sending the buyer to verify now would only report "not completed".
    toast.success(
      "Your payment is processing. We'll credit your shares as soon as Stripe confirms it.",
    );
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <PaymentElement onReady={() => setReady(true)} />

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        type="submit"
        disabled={!stripe || !ready || submitting}
        className="w-full py-2.5 sm:py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing payment…
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Pay {amountLabel}
          </>
        )}
      </button>

      <p
        className={`text-[10px] sm:text-xs ${
          darkMode ? "text-zinc-500" : "text-gray-500"
        }`}
      >
        Card details go straight to Stripe — they never touch AfriTek's servers.
        Stripe bills in USD at the rate the API quoted for this order.
      </p>
    </form>
  );
};

export const StripeCheckout = ({
  clientSecret,
  publicKey,
  darkMode,
  amountLabel,
  onConfirmed,
}) => {
  const stripePromise = useMemo(
    () => (publicKey ? getStripe(publicKey) : null),
    [publicKey],
  );

  // Without STRIPE_PUBLISHABLE_KEY on the API, `publicKey` comes back null and
  // Stripe.js cannot initialise. Say so plainly instead of rendering a dead form.
  if (!stripePromise || !clientSecret) {
    return (
      <p className="text-xs text-red-400">
        Card payments are unavailable right now — Stripe is not fully configured
        on the server. Please choose Paystack or PayPal.
      </p>
    );
  }

  return (
    <Elements
      // The clientSecret is fixed for the life of an Elements instance; a new
      // intent (different quantity) must remount rather than mutate options.
      key={clientSecret}
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: darkMode ? "night" : "stripe",
          variables: {
            colorPrimary: "#f59e0b",
            borderRadius: "12px",
          },
        },
      }}
    >
      <CardForm
        darkMode={darkMode}
        amountLabel={amountLabel}
        onConfirmed={onConfirmed}
      />
    </Elements>
  );
};

export default StripeCheckout;
