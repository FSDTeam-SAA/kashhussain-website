import type { ReactNode } from "react";
import {
  Calendar,
  CalendarClock,
  CircleAlert,
  Flag,
  Gauge,
} from "lucide-react";

import type { MotTest } from "./mot-history.types";
import {
  FALLBACK_VALUE,
  formatDate,
  formatMileage,
  formatValue,
  getResultTone,
} from "./mot-history.utils";

type Props = {
  test: MotTest;
  isLast?: boolean;
};

function TimelineMeta({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-medium text-[#0F172A] sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}

export default function MotHistoryTimelineItem({ test, isLast = false }: Props) {
  const tone = getResultTone(test.testResult);
  const comments = test.rfrAndComments?.filter((comment) => Boolean(comment?.text));

  return (
    <article className="relative pl-10">
      {!isLast ? (
        <div className="absolute bottom-[-34px] left-[7px] top-8 w-px bg-[#D7E2EE]" />
      ) : null}
      <div
        className={`absolute left-0 top-7 h-4 w-4 rounded-full border-4 border-white ${tone.accentClassName}`}
      />

      <div
        className={`rounded-[28px] border bg-white p-5 ${tone.cardClassName} sm:p-6`}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${tone.labelClassName} ${tone.borderClassName}`}
            >
              {formatValue(test.testResult)}
            </span>
            <p className="mt-3 text-lg font-semibold text-[#0F172A]">
              Test completed on {formatDate(test.completedDate)}
            </p>
            <p className="mt-2 text-sm text-[#64748B]">
              Result type: {formatValue(test.odometerResultType)}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F8FAFC] px-4 py-3 text-sm text-[#475569]">
            <p className="font-semibold text-[#0F172A]">Test outcome</p>
            <p className="mt-1">{formatValue(test.testResult)}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <TimelineMeta
            icon={<Calendar className="h-4 w-4 text-[#3159C8]" />}
            label="Date"
            value={formatDate(test.completedDate)}
          />
          <TimelineMeta
            icon={<Gauge className="h-4 w-4 text-[#A855F7]" />}
            label="Mileage"
            value={formatMileage(
              test.odometerValue,
              test.odometerUnit,
              test.odometerResultType,
            )}
          />
          <TimelineMeta
            icon={<CalendarClock className="h-4 w-4 text-[#16A34A]" />}
            label="Expiry"
            value={formatDate(test.expiryDate)}
          />
        </div>

        <div className="mt-5 rounded-2xl border border-[#EDF2F7] bg-[#FCFDFE] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            <Flag className="h-4 w-4 text-[#3159C8]" />
            Refusals, advisories and notes
          </div>

          {comments?.length ? (
            <div className="mt-3 space-y-2">
              {comments.map((comment, index) => (
                <div
                  key={`${comment.type || "comment"}-${index}`}
                  className="rounded-2xl border border-[#FDE68A] bg-[#FFF9E6] px-4 py-3 text-sm text-[#7C5B00]"
                >
                  <p className="font-semibold">{formatValue(comment.type)}</p>
                  <p className="mt-1 leading-6">{formatValue(comment.text)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
              <CircleAlert className="h-4 w-4 text-[#94A3B8]" />
              <span>{FALLBACK_VALUE}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
