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
          <div className="mx-auto flex max-w-4xl flex-col items-center py-24 text-center md:py-32">
            <h1 className="font-sora text-3xl font-bold leading-tight text-white md:text-4xl lg:text-[44px]">
              Quick, free vehicle checks for any UK car.
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/90 md:text-base">
              Get comprehensive vehicle history reports before you buy. Trusted by
              thousands of UK car buyers.
            </p>

            <p className="mt-2 max-w-xl text-xs leading-5 text-white/85 md:text-sm">
              Includes MOT status & history, road tax, mileage, and up-to-date
              DVLA registration info
            </p>

            {/* Input area */}
            <div className="mt-8 w-full max-w-[620px]">
              <div className="overflow-hidden rounded-md border-2 border-[#1A1A1A] bg-[#F6C433] shadow-[0_12px_30px_rgba(0,0,0,0.25)]">
                <div className="flex h-[64px] w-full items-stretch sm:h-[72px]">
                  {/* GB */}
                  <div className="flex w-[60px] shrink-0 items-center justify-center bg-[#233B8E] text-lg font-bold text-white sm:w-[70px] sm:text-xl">
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
                    className="h-full w-full bg-[#F6C433] px-4 text-center text-2xl font-extrabold uppercase tracking-wide text-black outline-none placeholder:text-black sm:px-6 sm:text-4xl"
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
          </div>
        </div>
      </div>
    </section>
  );
}

















// "use client";

// // import Link from "next/link";
// import Image from "next/image";
// // import { Button } from "@/components/ui/button";
// // import { ArrowRight } from "lucide-react";

// export default function HeroSection() {
//   return (
//     <section className="relative min-h-screen overflow-hidden">
//       {/* Background Image */}
//       <Image
//         src="/assets/images/hero_bg.png"
//         alt="Cinema campaign hero background"
//         fill
//         priority
//         className="object-cover"
//       />

//       {/* Dark overlay for better readability */}
//       <div className="absolute inset-0 bg-black/50" />

//       {/* Optional soft gradient overlay */}
//       {/* <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" /> */}

//       <div className="relative z-10 flex min-h-screen items-center">
//         <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-24 md:py-32">

//             <h1 className="font-sora text-3xl md:text-4xl lg:text-[40px] font-bold leading-normal text-[#F8FAFC] text-center ">
//               Quick, free vehicle checks for any UK car.
//             </h1>

//             <p className="mt-2 leading-normal text-[#F4F4F4] text-sm md:text-base text-center">
//               Get comprehensive vehicle history reports before you buy. Trusted by thousands of UK car buyers.
//             </p>

//              <p className="mt-3 leading-normal text-[#F4F4F4] text-sm md:text-base text-center">
//               Includes MOT status & history, road tax, mileage, and up-to-date DVLA <br /> registration info
//             </p>

//             {/* <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
//               <Button
//                 asChild
//                 size="lg"
//                 className="w-[165px] md:w-auto h-12 rounded-[12px] px-8 text-base font-semibold shadow-lg"
//               >
//                 <Link href="/products">See Products <ArrowRight /></Link>
//               </Button>

//               <Button
//                 asChild
//                 size="lg"
//                 variant="outline"
//                 className="h-12 rounded-[12px] border-primary bg-transparent text-primary px-8 text-base font-semibold hover:bg-white/90"
//               >
//                 <Link href="#">Learn More</Link>
//               </Button> 
//             </div> */}

//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }













