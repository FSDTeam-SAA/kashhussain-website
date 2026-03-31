
"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, CheckCircle2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubscribeApiResponse, SubscribePlan } from "./pricing-plan-data-type";
import CheckoutModal from "./CheckoutModal";

// --- UI States Components ---

const PricingSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-[18px]">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="relative flex min-h-[355px] animate-pulse flex-col rounded-[6px] border border-[#E4E8F0] bg-white px-5 pb-5 pt-7 shadow-sm"
      >
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="mt-4 h-10 w-32 rounded bg-gray-200" />
        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4].map((j) => (
            <div key={j} className="flex gap-2">
              <div className="h-4 w-4 rounded-full bg-gray-200" />
              <div className="h-4 w-full rounded bg-gray-200" />
            </div>
          ))}
        </div>
        <div className="mt-auto pt-8">
          <div className="h-[38px] w-full rounded bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);

const ErrorState = ({
  error,
  refetch,
}: {
  error: Error | null;
  refetch: () => void;
}) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-red-100 bg-red-50/30 py-16 text-center backdrop-blur-sm">
    <div className="relative mb-6">
      <div className="absolute inset-0 animate-ping rounded-full bg-red-200 opacity-20" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-red-100/80 text-red-600 shadow-sm">
        <AlertCircle className="h-8 w-8" />
      </div>
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900">Unable to load plans</h3>
    <p className="mb-8 max-w-sm px-4 text-sm text-gray-600">
      {error?.message || "There was an unexpected error fetching the pricing data. Please try again."}
    </p>
    <button
      onClick={() => refetch()}
      className="group flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 transition-all hover:bg-gray-50 hover:shadow-md active:scale-95"
    >
      <RefreshCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
      Retry Again
    </button>
  </div>
);

const NotFoundState = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-blue-50 bg-blue-50/10 py-16 text-center">
    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
      <AlertCircle className="h-8 w-8" />
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900">No Plans Available</h3>
    <p className="max-w-sm px-4 text-sm text-gray-600">
      We couldn&apos;t find any active pricing plans at the moment. Please check back later.
    </p>
  </div>
);

export default function PricingSection() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscribePlan | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data, isLoading, isError, error, refetch } = useQuery<SubscribeApiResponse>({
    queryKey: ["manage-plans"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/subscribe`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!res.ok) {
        throw new Error("Failed to fetch plans");
      }

      return res.json();
    },
    enabled: !!token,
  });

  const allPlans = data?.data?.data ?? [];

  const handleBuyNow = async (plan: SubscribePlan) => {
    // Check if user is logged in
    if (!token) {
      toast.error("Please log in to purchase a plan");
      router.push("/login");
      return;
    }

    setLoadingPlanId(plan._id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/${plan._id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to create payment");
        return;
      }

      // Open checkout modal with clientSecret
      setClientSecret(result.data.clientSecret);
      setSelectedPlan(plan);
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Payment error:", error);
    } finally {
      setLoadingPlanId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setClientSecret(null);
    setSelectedPlan(null);
  };

  return (
    <section id="pricing-section" className="bg-[#F5F7FB] py-[60px] md:py-[80px]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-[520px] text-center">
          <h2 className="text-[28px] font-bold leading-none tracking-[-0.02em] text-[#1D2433] sm:text-[36px]">
            Simple, <span className="text-[#2647A5]">Transparent</span> Pricing
          </h2>
          <p className="mt-3 text-[13px] leading-[18px] text-[#7A8191] sm:text-[14px]">
            Choose the check that&apos;s right for you
          </p>
        </div>

        {/* Content States */}
        <div className="mt-12">
          {isLoading ? (
            <PricingSkeleton />
          ) : isError ? (
            <ErrorState error={error} refetch={refetch} />
          ) : allPlans.length === 0 ? (
            <NotFoundState />
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-[18px]">
              {allPlans.map((plan) => {
                const isPopular = plan.planName.toLowerCase().includes("gold");
                const isLoadingThis = loadingPlanId === plan._id;

                return (
                  <div
                    key={plan._id}
                    className={[
                      "relative flex min-h-[355px] flex-col rounded-[6px] bg-white px-5 pb-5 pt-7",
                      isPopular
                        ? "border border-[#3F61C6] shadow-[0_10px_28px_rgba(36,70,166,0.14)] transition-transform hover:-translate-y-1"
                        : "border border-[#E4E8F0] shadow-none transition-transform hover:-translate-y-1 hover:shadow-lg",
                    ].join(" ")}
                  >
                    {/* Most Popular */}
                    {isPopular && (
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                        <span className="inline-flex h-[24px] items-center rounded-full bg-gradient-to-r from-[#2647A5] to-[#3978F6] px-4 text-[10px] font-semibold text-white shadow-sm">
                          Most Popular
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <p className="text-[18px] font-normal leading-none text-[#8A90A0]">
                      {plan?.planName || "N/A"}
                    </p>

                    {/* Price */}
                    <h3 className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#2647A5] sm:text-[42px]">
                      ${plan.price.toFixed(2)}
                    </h3>

                    {/* Features */}
                    <ul className="mt-6 space-y-[7px]">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-[13px] leading-[18px] text-[#2A3140]"
                        >
                          <CheckCircle2 className="mt-[1px] h-[14px] w-[14px] shrink-0 text-[#65D18A]" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <div className="mt-auto pt-8">
                      <button
                        type="button"
                        onClick={() => handleBuyNow(plan)}
                        disabled={isLoadingThis}
                        className={[
                          "h-[38px] w-full rounded-[3px] text-[13px] font-medium transition-all duration-200 disabled:opacity-60",
                          isPopular
                            ? "bg-gradient-to-b from-[#3978F6] to-[#2148B0] text-white shadow-[0_3px_10px_rgba(33,72,176,0.25)] hover:shadow-[0_5px_15px_rgba(33,72,176,0.4)]"
                            : "bg-[#EEF1F7] text-[#2647A5] hover:bg-[#E8EDF8]",
                        ].join(" ")}
                      >
                        {isLoadingThis ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Processing…
                          </span>
                        ) : (
                          "Buy Now"
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {clientSecret && selectedPlan && (
        <CheckoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          clientSecret={clientSecret}
          planName={selectedPlan.planName}
          amount={selectedPlan.price}
        />
      )}
    </section>
  );
}