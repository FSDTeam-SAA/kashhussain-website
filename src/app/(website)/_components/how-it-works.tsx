import { Search, FileText, Lock } from "lucide-react";

type StepItem = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
};

const steps: StepItem[] = [
  {
    id: 1,
    title: "Enter Vehicle Registration",
    description:
      "Simply type in the UK registration number of the vehicle you want to check.",
    icon: Search,
  },
  {
    id: 2,
    title: "View Free Vehicle Information",
    description:
      "Instantly see basic vehicle details from DVLA records at no cost.",
    icon: FileText,
  },
  {
    id: 3,
    title: "Unlock Full History Report",
    description:
      "Choose a plan and get complete vehicle history including theft, finance, and accident checks.",
    icon: Lock,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-[#f7f7f7] py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-[#111827] sm:text-4xl">
            How It <span className="text-blue-600">Works</span>
          </h2>

          <p className="mt-3 text-sm text-gray-500 sm:text-base">
            A simple, step-by-step process to help families find, connect with,
            and book trusted assisted living facilities with ease.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
                  <Icon className="h-7 w-7 text-blue-600" strokeWidth={2.2} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#111827]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-3 text-sm leading-6 text-gray-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}