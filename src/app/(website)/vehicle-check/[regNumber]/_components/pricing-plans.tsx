
"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SubscribeApiResponse, SubscribePlan } from "./pricing-plan-data-type";
import CheckoutModal from "./CheckoutModal";

export default function PricingSection() {
  const { data: session } = useSession();
  const token = (session?.user as { accessToken?: string })?.accessToken;
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscribePlan | null>(null);
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const { data } = useQuery<SubscribeApiResponse>({
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

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 xl:gap-[18px]">
          {allPlans?.map((plan) => {
            const isPopular = plan.planName.toLowerCase().includes("gold");
            const isLoadingThis = loadingPlanId === plan._id;

            return (
              <div
                key={plan._id}
                className={[
                  "relative flex min-h-[355px] flex-col rounded-[6px] bg-white px-5 pb-5 pt-7",
                  isPopular
                    ? "border border-[#3F61C6] shadow-[0_10px_28px_rgba(36,70,166,0.14)]"
                    : "border border-[#E4E8F0] shadow-none",
                ].join(" ")}
              >
                {/* Most Popular */}
                {isPopular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex h-[24px] items-center rounded-full bg-[#2647A5] px-4 text-[10px] font-semibold text-white shadow-sm">
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
                  $
                  {plan.price.toFixed(2)}
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
                        ? "bg-gradient-to-b from-[#3978F6] to-[#2148B0] text-white shadow-[0_3px_10px_rgba(33,72,176,0.25)] hover:opacity-95"
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