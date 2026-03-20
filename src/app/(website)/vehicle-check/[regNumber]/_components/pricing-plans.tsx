import { CheckCircle2 } from "lucide-react";

export type PricingPlan = {
  id: string;
  name: string;
  price: number;
  currencySymbol: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
};

export const pricingPlans: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic Check",
    price: 4.99,
    currencySymbol: "£",
    features: [
      "DVLA Vehicle Data",
      "MOT Status & History",
      "Tax Status",
      "Vehicle Specifications",
    ],
    buttonText: "Buy Now",
  },
  {
    id: "gold",
    name: "Gold Check",
    price: 9.99,
    currencySymbol: "£",
    features: [
      "Everything in Basic",
      "Finance Check",
      "Mileage Verification",
      "Ownership Records",
    ],
    buttonText: "Buy Now",
    isPopular: true,
  },
  {
    id: "platinum",
    name: "Platinum Check",
    price: 14.99,
    currencySymbol: "£",
    features: [
      "Everything in Gold",
      "Theft Check",
      "Accident History",
      "AI Risk Analysis",
    ],
    buttonText: "Buy Now",
  },
];

export default function PricingSection() {
  return (
    <section className="bg-[#F5F7FB] py-[60px] md:py-[80px]">
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
          {pricingPlans.map((plan) => {
            const isPopular = !!plan.isPopular;

            return (
              <div
                key={plan.id}
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
                  {plan.name}
                </p>

                {/* Price */}
                <h3 className="mt-2 text-[28px] font-bold leading-none tracking-[-0.02em] text-[#2647A5] sm:text-[42px]">
                  {plan.currencySymbol}
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
                    className={[
                      "h-[38px] w-full rounded-[3px] text-[13px] font-medium transition-all duration-200",
                      isPopular
                        ? "bg-gradient-to-b from-[#3978F6] to-[#2148B0] text-white shadow-[0_3px_10px_rgba(33,72,176,0.25)] hover:opacity-95"
                        : "bg-[#EEF1F7] text-[#2647A5] hover:bg-[#E8EDF8]",
                    ].join(" ")}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}