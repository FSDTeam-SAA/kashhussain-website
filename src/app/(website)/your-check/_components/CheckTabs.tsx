"use client";

import { ClipboardCheck, ShieldCheck } from "lucide-react";

type CheckTabType = "free" | "purchased";

type CheckTabsProps = {
  activeTab: CheckTabType;
  onChange: (tab: CheckTabType) => void;
};

export default function CheckTabs({
  activeTab,
  onChange,
}: CheckTabsProps) {
  const baseClass =
    "flex h-[42px] w-full items-center justify-center gap-2 border text-[20px] font-medium transition md:w-[350px]";
  const activeClass = "border-[#1E3A8A] bg-[#1E3A8A] text-white";
  const inactiveClass = "border-[#7F96D5] bg-transparent text-[#1E3A8A]";

  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row">
      <button
        type="button"
        onClick={() => onChange("free")}
        className={`${baseClass} ${activeTab === "free" ? activeClass : inactiveClass}`}
      >
        <ClipboardCheck size={16} />
        Free Check
      </button>

      <button
        type="button"
        onClick={() => onChange("purchased")}
        className={`${baseClass} ${activeTab === "purchased" ? activeClass : inactiveClass}`}
      >
        <ShieldCheck size={16} />
        Purchased Checks
      </button>
    </div>
  );
}