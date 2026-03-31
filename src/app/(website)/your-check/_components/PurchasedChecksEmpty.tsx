"use client";

import Image from "next/image";
import Link from "next/link";

export default function PurchasedChecksEmpty() {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="relative h-[110px] w-[110px] sm:h-[170px] sm:w-[250px]">
        <Image
          src="/car.png"
          alt="No purchased checks"
          fill
          className="object-contain"
        />
      </div>

      <p className="mt-6  text-center font-medium text-[16px] text-[#000000] sm:text-[24px]">
        You Have not purchased any checks yet , once4 you have they will appear here.
      </p>

     <Link href="/">
      <button
        type="button"
        className="mt-5 h-[38px] border border-[#7F96D5] px-5 text-[16px] font-medium text-[#27459B] transition hover:bg-[#eef3ff]"
      >
        Click here to get a Check
      </button>
     </Link>
    </div>
  );
}