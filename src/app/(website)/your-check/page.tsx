"use client";

import { useState } from "react";
import CheckTabs from "./_components/CheckTabs";
import FreeCheckTable from "./_components/FreeCheckTable";
import PurchasedChecksEmpty from "./_components/PurchasedChecksEmpty";

type CheckTabType = "free" | "purchased";

const freeChecksData = [
  {
    id: 1,
    regNumber: "KSHHV",
    vehicleName: "Porsche Cayenne",
  },
  {
    id: 2,
    regNumber: "KSHHV",
    vehicleName: "Porsche Cayenne",
  },
  {
    id: 3,
    regNumber: "KSHHV",
    vehicleName: "Porsche Cayenne",
  },
];

export default function VehicleChecksSection() {
  const [activeTab, setActiveTab] = useState<CheckTabType>("free");

  return (
    <section className=" px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto container">
        <div className="flex justify-center">
          <CheckTabs activeTab={activeTab} onChange={setActiveTab} />
        </div>

        <div className="mt-6">
          {activeTab === "free" ? (
            <FreeCheckTable data={freeChecksData} />
          ) : (
            <PurchasedChecksEmpty/>
          )}
        </div>
      </div>
    </section>
  );
}