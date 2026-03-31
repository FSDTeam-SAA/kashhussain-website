"use client";

import { useState } from "react";
import CheckTabs from "./CheckTabs";
import FreeCheckTable from "./FreeCheckTable";
import PurchasedChecksEmpty from "./PurchasedChecksEmpty";


type CheckTabType = "free" | "purchased";

export default function YourCarCheckContainer() {
  const [activeTab, setActiveTab] = useState<CheckTabType>("free");

  return (
    <section className=" px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto container">
        <div className="flex justify-center">
          <CheckTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === "free" ? (
            <FreeCheckTable />
          ) : (
            <PurchasedChecksEmpty/>
          )}
        </div>
      </div>
    </section>
  );
}