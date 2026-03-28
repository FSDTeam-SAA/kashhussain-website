import Image from "next/image";


type StepItem = {
  id: number;
  title: string;
  description: string;
  icon: string;
};

const steps: StepItem[] = [
  {
    id: 1,
    title: "Enter Vehicle Registration",
    description:
      "Simply type in the UK registration number of the vehicle you want to check.",
    icon: "/assets/images/hiw1.png",
  },
  {
    id: 2,
    title: "View Free Vehicle Information",
    description:
      "Instantly see basic vehicle details from DVLA records at no cost.",
    icon: "/assets/images/hiw2.png",
  },
  {
    id: 3,
    title: "Unlock Full History Report",
    description:
      "Choose a plan and get complete vehicle history including theft, finance, and accident checks.",
    icon: "/assets/images/hiw3.png",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full bg-white py-14 md:py-16 lg:py-20">
      <div className="container">
        
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="font-sora text-3xl md:text-4xl lg:text-4xl font-bold text-[#111827] leading-normal">
            How It <span className="text-primary">Works</span>
          </h2>

          <p className="mt-2 text-sm md:text-base text-[#6B7280] leading-normal font-normal">
            A simple, step-by-step process to help families find, connect with,
            and book trusted assisted living facilities with ease.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {steps.map((step) => {

            return (
              <div
                key={step.id}
                className="flex flex-col items-center rounded-xl border border-[#E6E7E6] bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Image
                    src={step.icon}
                    alt={step.title}
                    width={280}
                    height={280}
                    className="h-20 w-20 object-contain"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg md:text-xl leading-normal font-semibold text-[#111827]">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm md:text-base leading-normal text-[#6B7280]">
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
