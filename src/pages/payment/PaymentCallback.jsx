import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, ArrowRight, RefreshCw } from "lucide-react";
import { shareAPI } from "../../api/auth.api.js";
import { ROUTES } from "../../utils/constants";
import { useAuth } from "../../hooks/useAuth";
import {
  clearPendingPayment,
  isValidReference,
  normalizeReference,
  readPendingPayment,
} from "../../utils/pendingPayment";

const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  FAILED: "failed",
};

/**
 * Where the payment gateways send the buyer back to after checkout.
 *
 * A gateway redirect is the only fulfilment trigger we can count on: webhooks
 * need a publicly reachable URL and are silent on localhost, so without this
 * page a successful payment left the shares uncredited. Verification itself is
 * server-side — this page only asks the API to confirm the reference; the
 * backend re-checks with the gateway before crediting anything.
 */
export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [message, setMessage] = useState("Confirming your payment with the gateway…");
  const [result, setResult] = useState(null);

  // Read once: a later clearPendingPayment() must not change what this render
  // pass thinks the reference is. Scoped to the signed-in buyer so a shared
  // browser cannot offer someone else's reference.
  const stored = useMemo(() => readPendingPayment(user?.uid), [user?.uid]);

  /**
   * Only Paystack echoes our reference back (as `reference`, and `trxref`).
   * PayPal returns `token`/`PayerID` and Stripe returns
   * `payment_intent`/`redirect_status` — for those the reference comes from what
   * BuySharesModal stashed before redirecting, because POST /shares/buy will not
   * verify without one.
   */
  const urlReference = normalizeReference(
    searchParams.get("reference") || searchParams.get("trxref") || "",
  );
  const reference = isValidReference(urlReference) ? urlReference : stored?.reference || "";

  // PayPal calls its order id `token`. Optional — the API persists the order id
  // at initiate time — but sending it lets verification work even if that write
  // was lost.
  const orderId = searchParams.get("token") || searchParams.get("orderId") || null;
  const gateway = searchParams.get("gateway") || stored?.gateway || "paystack";
  const redirectStatus = searchParams.get("redirect_status");

  const verify = useCallback(async () => {
    if (!reference) {
      setStatus(STATUS.FAILED);
      setMessage(
        "No payment reference came back from the gateway and none was saved in this tab. If you were charged, open Buy Shares on the dashboard and verify with the reference from your order confirmation.",
      );
      return;
    }

    setStatus(STATUS.VERIFYING);
    setMessage("Confirming your payment with the gateway…");

    try {
      const { data } = await shareAPI.verify({ reference, orderId });

      setResult(data?.data || null);
      setStatus(STATUS.SUCCESS);
      setMessage(data?.message || "Payment verified and shares credited.");

      // Fulfilled — this reference no longer needs recovering.
      clearPendingPayment(reference);
    } catch (err) {
      setStatus(STATUS.FAILED);
      setMessage(
        err.response?.data?.message ||
          err.message ||
          "We could not verify this payment. Please contact support with your reference.",
      );
    }
  }, [reference, orderId]);

  // Guards against React StrictMode double-invoking the effect in dev, which
  // would fire two verify calls for the same reference.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    // Stripe tells us up front when the confirmation failed; there is nothing
    // for the API to confirm in that case.
    if (redirectStatus === "failed") {
      setStatus(STATUS.FAILED);
      setMessage(
        "Stripe reported that the card payment did not go through, so you have not been charged. You can start a new order from the dashboard.",
      );
      return;
    }

    verify();
  }, [verify, redirectStatus]);

  /**
   * Hand the buyer straight to their dashboard once the shares are credited.
   *
   * The confirmation travels with them in router state and is shown there as a
   * toast, so this page never becomes a dead end the buyer has to click out of.
   * `replace` matters: without it Back returns here and re-runs verification,
   * which answers "already processed" and reads like something went wrong.
   */
  useEffect(() => {
    if (status !== STATUS.SUCCESS) return;

    navigate(`${ROUTES.DASHBOARD}?currentTab=dashboard`, {
      replace: true,
      state: { paymentResult: result, paymentGateway: gateway },
    });
  }, [status, result, gateway, navigate]);

  const icon = {
    [STATUS.VERIFYING]: <Loader2 className="w-12 h-12 animate-spin text-amber-400" />,
    [STATUS.SUCCESS]: <CheckCircle2 className="w-12 h-12 text-green-400" />,
    [STATUS.FAILED]: <XCircle className="w-12 h-12 text-red-400" />,
  }[status];

  const heading = {
    [STATUS.VERIFYING]: "Verifying payment",
    [STATUS.SUCCESS]: "Payment confirmed",
    [STATUS.FAILED]: "Verification failed",
  }[status];

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-4">{icon}</div>

        <h1 className="text-xl sm:text-2xl font-bold text-white">{heading}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          {/* Success is a hand-off, not a destination — the effect above is
              already navigating, so say that rather than showing figures the
              buyer has no time to read. They are repeated on the dashboard. */}
          {status === STATUS.SUCCESS ? "Taking you to your dashboard…" : message}
        </p>

        {reference && status !== STATUS.SUCCESS && (
          <p className="mt-4 text-xs text-zinc-500 break-all">
            Reference: <code className="text-zinc-300">{reference}</code>
            <span className="mx-1">·</span>
            <span className="uppercase">{gateway}</span>
          </p>
        )}

        {/* A gateway can still be settling when it bounces the buyer back, so a
            failure here is often just "too early" rather than terminal. */}
        {status === STATUS.FAILED && reference && (
          <button
            onClick={verify}
            className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Check again
          </button>
        )}

        {status === STATUS.FAILED && (
          <Link
            to={`${ROUTES.DASHBOARD}?currentTab=dashboard`}
            className={`mt-3 inline-flex items-center justify-center gap-2 w-full py-3 font-semibold rounded-xl transition-colors ${
              reference
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Go to dashboard <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {status === STATUS.FAILED && reference && (
          <p className="mt-3 text-xs text-zinc-500">
            Still not credited? This reference is saved on this device — open{" "}
            <span className="text-zinc-300">Buy Shares</span> on the dashboard and it
            will be waiting under "Unconfirmed payments".
          </p>
        )}
      </div>
    </div>
  );
}
