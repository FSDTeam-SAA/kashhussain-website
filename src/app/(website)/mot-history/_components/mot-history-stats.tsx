import type { ReactNode } from "react";
import { BadgeCheck, CircleX, History, TimerReset } from "lucide-react";

import type { MotHistoryData } from "./mot-history.types";
import {
  formatDate,
  formatMileage,
  formatValue,
  getLatestTest,
} from "./mot-history.utils";

type Props = {
  motHistory?: MotHistoryData | null;
};

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[26px] border border-[#E7ECF4] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold text-[#0F172A]">{value}</p>
          <p className="mt-2 text-sm text-[#64748B]">{hint}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF4FF] text-[#3159C8]">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function MotHistoryStats({ motHistory }: Props) {
  const latestTest = getLatestTest(motHistory?.motTests);

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-4">
      <StatCard
        label="MOT Tests"
        value={formatValue(motHistory?.totalTests)}
        hint="Total recorded MOT inspections"
        icon={<History className="h-5 w-5" />}
      />
      <StatCard
        label="Passed"
        value={formatValue(motHistory?.totalPassed)}
        hint={`Latest result: ${formatValue(motHistory?.latestTestResult)}`}
        icon={<BadgeCheck className="h-5 w-5" />}
      />
      <StatCard
        label="Failed"
        value={formatValue(motHistory?.totalFailed)}
        hint={`Last expiry: ${formatDate(motHistory?.latestExpiryDate)}`}
        icon={<CircleX className="h-5 w-5" />}
      />
      <StatCard
        label="Last Mileage"
        value={formatMileage(
          latestTest?.odometerValue ?? motHistory?.lastMileage,
          latestTest?.odometerUnit,
          latestTest?.odometerResultType,
        )}
        hint="Latest recorded odometer reading"
        icon={<TimerReset className="h-5 w-5" />}
      />
    </section>
  );
}
