"use client";

import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { ShieldCheck, X, Loader2, CreditCard } from "lucide-react";
import StripeProvider from "@/components/providers/StripeProvider";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientSecret: string;
  planName: string;
  amount: number;
}

function CheckoutForm({
  onClose,
  planName,
  amount,
}: {
  onClose: () => void;
  planName: string;
  amount: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Order Summary */}
      <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100/50 text-blue-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-sm font-medium text-gray-500">Order Summary</span>
          </div>
          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
            Subscription
          </span>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="mb-1 text-sm text-gray-500">Plan</p>
            <p className="text-lg font-semibold text-gray-900">{planName}</p>
          </div>
          <div className="text-right">
            <p className="mb-1 text-sm text-gray-500">Total</p>
            <p className="text-2xl font-bold tracking-tight text-blue-600">
              £{amount.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <div className="space-y-4">
        <div className="mb-2 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <h3 className="text-sm font-medium text-gray-900">Secure Payment Details</h3>
        </div>
        
        <div className="min-h-[200px] rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="px-1">
            <PaymentElement 
              options={{
                layout: "tabs",
              }}
            />
          </div>
        </div>
      </div>

      {/* Error Output */}
      {errorMessage && (
        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-600">
          <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="leading-relaxed">{errorMessage}</p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onClose}
          disabled={isProcessing}
          className="inline-flex h-11 items-center justify-center rounded-lg border border-gray-200 bg-white px-6 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 sm:w-auto"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="relative inline-flex h-11 w-full items-center justify-center overflow-hidden rounded-lg bg-blue-600 px-8 text-sm font-medium text-white transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 sm:w-auto"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing secure payment...
            </>
          ) : (
            <span className="flex items-center gap-2">
              Pay £{amount.toFixed(2)}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </button>
      </div>

      <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        Payments are secure and encrypted via Stripe
      </p>
    </form>
  );
}

export default function CheckoutModal({
  isOpen,
  onClose,
  clientSecret,
  planName,
  amount,
}: CheckoutModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className="relative z-10 flex w-full max-h-[90vh] max-w-[612px] flex-col overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all"
        role="dialog"
        aria-modal="true"
      >
        {/* Header styling */}
        <div className="relative flex-none overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 px-6 pb-16 pt-6 sm:px-8">
          <div className="absolute -right-10 -top-24 h-48 w-48 rounded-full bg-blue-500 opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-blue-400 opacity-20 blur-2xl" />
          
          <div className="relative flex items-center justify-between">
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Complete Checkout
            </h2>
            <button
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="relative mt-2 text-sm text-blue-100">
            Complete your subscription to unlock premium features.
          </p>
        </div>

        {/* Content area that overlaps header */}
        <div className="relative -mt-10 flex-1 overflow-y-auto px-6 pb-8 sm:px-8">
          <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
            <StripeProvider clientSecret={clientSecret}>
              <CheckoutForm
                onClose={onClose}
                planName={planName}
                amount={amount}
              />
            </StripeProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
