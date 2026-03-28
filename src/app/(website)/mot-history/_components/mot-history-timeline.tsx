import { ClipboardList } from "lucide-react";

import type { MotHistoryData } from "./mot-history.types";
import MotHistoryTimelineItem from "./mot-history-timeline-item";

type Props = {
  motHistory?: MotHistoryData | null;
};

export default function MotHistoryTimeline({ motHistory }: Props) {
  const tests = motHistory?.motTests ?? [];

  return (
    <section className="rounded-[32px] bg-white p-6 shadow-[0_18px_56px_rgba(15,23,42,0.06)] sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF4FF] text-[#3159C8]">
          <ClipboardList className="h-6 w-6" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#0F172A]">
            MOT History Timeline
          </h2>
          <p className="mt-1 text-sm text-[#64748B]">
            Each test is shown in date order with mileage, expiry, and any
            inspection comments.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {tests.length ? (
          tests.map((test, index) => (
            <MotHistoryTimelineItem
              key={`${test.completedDate || "mot-test"}-${index}`}
              isLast={index === tests.length - 1}
              test={test}
            />
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center text-sm text-[#64748B]">
            No MOT tests were returned for this vehicle.
          </div>
        )}
      </div>
    </section>
  );
}
