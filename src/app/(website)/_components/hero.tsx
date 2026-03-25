"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function HeroSection() {
  const router = useRouter();
  const [regNumber, setRegNumber] = useState("");

  const formattedReg = useMemo(() => {
    return regNumber.toUpperCase().replace(/\s+/g, "").trim();
  }, [regNumber]);

  const isValid = formattedReg.length >= 2;

  const handleSearch = () => {
    if (!isValid) return;
    router.push(`/vehicle-check/${formattedReg}`);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src="/assets/images/hero_bg.png"
        alt="Vehicle check hero background"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center py-24 text-center md:py-32">
            <h1 className="font-sora text-3xl md:text-4xl lg:text-[40px] font-bold leading-normal text-[#F8FAFC] ">
              Quick, free vehicle checks for any UK car.
            </h1>

            <p className="mt-2 text-sm md:text-base leading-normal text-[#F4F4F4] font-normal">
              Get comprehensive vehicle history reports before you buy. Trusted by
              thousands of UK car buyers.
            </p>

             {/* Input area */}
            <div className="mt-6 w-full max-w-[620px]">
              <div className="overflow-hidden rounded-[6px] border-2 border-black bg-[#FBBF24] shadow-[0px_25px_50px_-12px_#00000080]">
                <div className="flex h-[64px] w-full items-stretch sm:h-[72px]">
                  {/* GB */}
                  <div className="flex w-[44px] shrink-0 items-center justify-center bg-[#1D4ED8] text-lg font-bold text-white sm:text-xl">
                    GB
                  </div>

                  {/* Input */}
                  <input
                    type="text"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                    placeholder="ENTER REG"
                    className="h-full w-full bg-[#FBBF24] px-2 text-left text-2xl md:text-3xl lg:text-4xl font-bold uppercase tracking-wide leading-normal text-black outline-none placeholder:text-black"
                  />
                </div>
              </div>

              {/* Button show only when user types */}
              {formattedReg && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={handleSearch}
                    className="inline-flex h-[50px] min-w-[170px] items-center justify-center rounded-md bg-[#32C5F4] px-6 text-sm font-bold uppercase tracking-[1px] text-[#0B2D3A] transition hover:scale-[1.02] hover:shadow-lg"
                  >
                    Get Car Check
                  </button>
                </div>
              )}
            </div>

            <p className="mt-2 text-sm md:text-base leading-normal text-[#F4F4F4] font-normal">
              Includes MOT status & history, road tax, mileage, and up-to-date
              DVLA <br /> registration info
            </p>

           
          </div>
        </div>
      </div>
    </section>
  );
}









