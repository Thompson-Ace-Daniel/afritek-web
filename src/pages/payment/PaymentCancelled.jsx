import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import { clearPendingPayment } from "../../utils/pendingPayment";

/**
 * PayPal's cancel_url target — the buyer backed out at the gateway.
 *
 * Nothing to verify here: the payment record stays pending and is never
 * fulfilled, so no shares move and no commissions are paid.
 */
export default function PaymentCancelled() {
  // Drop the stashed reference so it cannot be picked up by a later visit to the
  // callback page — this order was abandoned, not paid.
  useEffect(() => {
    clearPendingPayment();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 sm:p-8 text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="w-12 h-12 text-amber-400" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white">Payment cancelled</h1>
        <p className="mt-2 text-sm text-zinc-400">
          You cancelled the checkout, so nothing was charged and no shares were purchased.
          You can start a new order whenever you're ready.
        </p>

        <Link
          to={`${ROUTES.DASHBOARD}?currentTab=dashboard`}
          className="mt-6 inline-flex items-center justify-center gap-2 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
        >
          Back to dashboard <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
