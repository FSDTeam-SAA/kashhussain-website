"use client";


import Link from "next/link";

type Props = {
  regNumber?: string;
};

export default function VehicleCheckDetails({ regNumber }: Props) {
  const vehicleName = "Aston Martin";

  console.log(regNumber)

  return (
    <section className="relative min-h-screen overflow-hidden">
     <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute inset-0 h-full w-full object-cover"
>
  <source src="/assets/videos/home_hero.mp4" type="video/mp4" />
</video>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center text-white">
            {/* Reg plate */}
            <div className="mx-auto flex h-[72px] w-full max-w-[330px] overflow-hidden rounded-md border-2 border-[#1A1A1A] bg-[#F6C433] shadow-[0_12px_30px_rgba(0,0,0,0.25)] sm:h-[88px] sm:max-w-[420px]">
              <div className="flex w-[60px] items-center justify-center bg-[#233B8E] text-xl font-bold text-white sm:w-[80px] sm:text-2xl">
                GB
              </div>
              <div className="flex flex-1 items-center justify-center px-4 text-3xl font-extrabold uppercase tracking-wide text-black sm:text-5xl">
                {regNumber}
              </div>
            </div>

            {/* Title */}
            <h2 className="mt-8 text-3xl font-bold sm:text-5xl">{vehicleName}</h2>

            <p className="mt-3 text-sm text-white/90 sm:text-base">
              Not The Right Vehicle?{" "}
              <Link href="/" className="font-semibold text-[#3B82F6] underline underline-offset-4">
                Check again
              </Link>
            </p>

            {/* Info boxes */}
            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-2xl bg-white p-6 text-left shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase text-[#111827]">Tax</p>
                    <p className="mt-3 text-sm text-[#4B5563]">
                      Expires: 01 May 2026
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#16A34A]">
                      47 days left
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    ✓
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 text-left shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold uppercase text-[#111827]">MOT</p>
                    <p className="mt-3 text-sm text-[#4B5563]">
                      Expires: 06 May 2026
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#16A34A]">
                      53 days left
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}