import type { ReactNode } from "react";

import {
  Activity,
  ArrowRight,
  BadgeAlert,
  CarFront,
  CheckCircle2,
  Fuel,
  Gauge,
  Leaf,
  ReceiptPoundSterling,
  Ruler,
  ShieldCheck,
  Star,
} from "lucide-react";

import type { VehicleCheckData } from "./vehicle-check.types";
import Link from "next/link";

type Props = {
  vehicle: VehicleCheckData;
};

type DetailRow = {
  label: string;
  value?: string | number | null;
  tone?: "default" | "warning" | "danger" | "success";
};

type ScoreBar = {
  label: string;
  value?: string | number | null;
  colorClass?: string;
};

const FALLBACK_VALUE = "N/A";

function formatValue(value?: string | number | null) {
  if (value === undefined || value === null) {
    return FALLBACK_VALUE;
  }

  const normalized = String(value).trim();
  return normalized || FALLBACK_VALUE;
}

function formatNumber(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return FALLBACK_VALUE;
  }

  return new Intl.NumberFormat("en-GB").format(value);
}

function extractPercentage(value?: string | number | null) {
  const normalized = formatValue(value);

  if (normalized === FALLBACK_VALUE) {
    return null;
  }

  const match = normalized.match(/(\d+(?:\.\d+)?)/);
  return match ? Math.max(0, Math.min(100, Number(match[1]))) : null;
}

function getToneClass(tone: DetailRow["tone"]) {
  switch (tone) {
    case "success":
      return "text-[#0E9F6E]";
    case "warning":
      return "text-[#E58A00]";
    case "danger":
      return "text-[#EF4444]";
    default:
      return "text-[#1F2937]";
  }
}

function getPillClass(tone: DetailRow["tone"]) {
  switch (tone) {
    case "success":
      return "bg-[#E7F8EF] text-[#0E9F6E]";
    case "warning":
      return "bg-[#FFF5E1] text-[#E58A00]";
    case "danger":
      return "bg-[#FFE8E8] text-[#EF4444]";
    default:
      return "bg-[#F3F5F8] text-[#4B5563]";
  }
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[10px] border border-[#E7ECF2] bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:p-4">
      <div className="flex items-center gap-2 border-b border-[#EEF2F6] pb-2.5">
        <span className="flex h-4 w-4 items-center justify-center text-[#5472C8]">{icon}</span>
        <h3 className="text-[11px] font-semibold text-[#1E293B] sm:text-[12px]">{title}</h3>
      </div>
      <div className="pt-1.5">{children}</div>
    </section>
  );
}

function TableRows({
  rows,
  emphasizeValue = false,
}: {
  rows: DetailRow[];
  emphasizeValue?: boolean;
}) {
  return (
    <div>
      {rows.map((row) => {
        const value = formatValue(row.value);

        return (
          <div
            key={row.label}
            className="flex items-start justify-between gap-3 border-b border-[#EEF2F6] py-2 last:border-b-0 last:pb-0"
          >
            <span className="max-w-[58%] text-[10px] leading-4 text-[#7C8798] sm:text-[11px]">
              {row.label}
            </span>
            <span
              className={`text-right text-[10px] leading-4 sm:text-[11px] ${
                emphasizeValue ? "font-semibold" : "font-medium"
              } ${getToneClass(row.tone)}`}
            >
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function FlagRows({ rows }: { rows: DetailRow[] }) {
  return (
    <div>
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-start justify-between gap-3 border-b border-[#EEF2F6] py-2 last:border-b-0 last:pb-0"
        >
          <span className="max-w-[70%] text-[10px] leading-4 text-[#7C8798] sm:text-[11px]">
            {row.label}
          </span>
          <span
            className={`inline-flex min-h-[18px] items-center rounded-full px-2 py-0.5 text-[9px] font-semibold sm:text-[10px] ${getPillClass(
              row.tone,
            )}`}
          >
            {formatValue(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatBox({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value?: string | number | null;
  tone?: DetailRow["tone"];
}) {
  return (
    <div className="rounded-[8px] bg-[#F8FAFC] px-2.5 py-3 text-center">
      <p className="text-[9px] uppercase tracking-[0.1em] text-[#8D97A8]">{label}</p>
      <p className={`mt-1.5 text-[22px] font-semibold ${getToneClass(tone)}`}>
        {formatValue(value)}
      </p>
    </div>
  );
}

function LinkAction({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#3E9B71] transition-colors hover:text-[#237451] sm:text-[11px]"
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5" />
    </button>
  );
}

function ScoreBars({ items }: { items: ScoreBar[] }) {
  return (
    <div className="space-y-2.5">
      {items.map((item) => {
        const percent = extractPercentage(item.value);

        return (
          <div key={item.label}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-[10px] text-[#64748B] sm:text-[11px]">{item.label}</span>
              <span className="text-[10px] font-semibold text-[#111827] sm:text-[11px]">
                {formatValue(item.value)}
              </span>
            </div>
            <div className="h-[7px] overflow-hidden rounded-full bg-[#EEF2F6]">
              <div
                className={`h-full rounded-full ${item.colorClass || "bg-[#84CC16]"}`}
                style={{ width: `${percent ?? 18}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VehicleCheckExtraInformation({ vehicle }: Props) {
  const details = vehicle.vehicleDetails;
  const mileage = vehicle.mileageInformation;
  const motHistory = vehicle.motHistorySummary;
  const performance = vehicle.performance;
  const info = vehicle.importantVehicleInformation;
  const dimensions = vehicle.dimensionsAndWeight;
  const fuelEconomy = vehicle.fuelEconomy;
  const roadTax = vehicle.roadTax;
  const safetyRatings = vehicle.safetyRatings;
  const co2 = vehicle.co2EmissionFigures;

  return (
    <section className="relative z-20 bg-[#F6F7F9] py-10 md:py-14">
      <div className="container">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.62fr)_minmax(250px,0.82fr)] lg:gap-3">
          <div className="space-y-3">
            <Panel title="Vehicle Details" icon={<CarFront className="h-3.5 w-3.5" />}>
              <TableRows
                emphasizeValue
                rows={[
                  { label: "Vehicle Make", value: details?.description?.split(" ")[0] || details?.modelVariant },
                  { label: "Registration Year", value: details?.registrationDate },
                  { label: "Fuel Type", value: details?.fuelType },
                  { label: "Transmission", value: details?.transmission },
                  { label: "Drive With", value: details?.driveType },
                  { label: "Engine", value: details?.engine },
                  { label: "Body Style", value: details?.bodyStyle },
                  { label: "Primary Colour", value: details?.primaryColour },
                  { label: "Euro Status", value: details?.euroStatus },
                  { label: "Last MOT Expires", value: vehicle.heroSection?.mot?.expiryDate },
                  { label: "Tax Status", value: vehicle.heroSection?.tax?.daysLeft },
                  { label: "Registration Place", value: details?.registrationPlace },
                  { label: "Last V5C Issue Date", value: details?.lastV5CIssuedDate },
                  { label: "Vehicle Age", value: details?.vehicleAge },
                ]}
              />
            </Panel>

            <Panel title="Performance" icon={<Gauge className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#8D97A8]">Power</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    {formatValue(performance?.power)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#8D97A8]">Max Speed</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    {formatValue(performance?.maxSpeed)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#8D97A8]">Max Torque</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    {formatValue(performance?.maxTorque)}
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-[0.08em] text-[#8D97A8]">0-60 MPH</p>
                  <p className="mt-1 text-[11px] font-semibold text-[#111827] sm:text-[12px]">
                    {formatValue(performance?.zeroToSixty)}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel title="Important Vehicle Information" icon={<BadgeAlert className="h-3.5 w-3.5" />}>
              <FlagRows
                rows={[
                  { label: "Exported", value: info?.exported, tone: "warning" },
                  { label: "Safety Recalls", value: info?.safetyRecalls, tone: "danger" },
                  { label: "Damage History", value: info?.damageHistory, tone: "danger" },
                  { label: "Salvage History", value: info?.salvageHistory, tone: "danger" },
                  { label: "Full Service History", value: info?.fullServiceHistory, tone: "danger" },
                  { label: "Written Off / Write Down", value: info?.writtenOff, tone: "danger" },
                  { label: "Stolen", value: info?.stolen, tone: "danger" },
                  { label: "On Finance", value: info?.onFinance, tone: "danger" },
                  {
                    label: "Import / Export / VIN / Logbook",
                    value: info?.keeperPlateChangesImportExportVinLogbookCheck,
                    tone: "danger",
                  },
                ]}
              />
            </Panel>

            <Panel title="Dimensions & Weight" icon={<Ruler className="h-3.5 w-3.5" />}>
              <TableRows
                emphasizeValue
                rows={[
                  { label: "Width", value: dimensions?.width },
                  { label: "Length", value: dimensions?.length },
                  { label: "Height", value: dimensions?.height },
                  { label: "Wheel Base", value: dimensions?.wheelBase },
                  { label: "Kerb Weight", value: dimensions?.kerbWeight },
                  { label: "Max Allowed Weight", value: dimensions?.maxAllowedWeight },
                ]}
              />
            </Panel>
          </div>

          <div className="space-y-3">
            <Panel title="Mileage Information" icon={<Activity className="h-3.5 w-3.5" />}>
              <TableRows
                emphasizeValue
                rows={[
                  { label: "Last MOT Mileage", value: formatNumber(mileage?.lastMotMileage) },
                  { label: "Mileage Issues", value: mileage?.mileageIssues },
                  { label: "Average", value: formatNumber(mileage?.average) },
                  { label: "Status", value: mileage?.status, tone: "warning" },
                ]}
              />
              <LinkAction label="View Full Mileage History" />
            </Panel>

            <Panel title="MOT History Summary" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
              <div className="grid grid-cols-3 gap-2">
                <StatBox label="Total" value={motHistory?.totalTests ?? 0} />
                <StatBox label="Passed" value={motHistory?.passed ?? 0} tone="success" />
                <StatBox label="Failed" value={motHistory?.failed ?? 0} tone="default" />
              </div>
             <Link
               href={`/mot-history?registrationNumber=${encodeURIComponent(
                 vehicle.registrationNumber,
               )}`}
             >
              <LinkAction label="View MOT History" />
             </Link>
            </Panel>

            <Panel title="Service/Identity Check" icon={<Star className="h-3.5 w-3.5" />}>
              <p className="text-[10px] leading-5 text-[#6B7280] sm:text-[11px]">
                Check the full vehicle history for {formatValue(vehicle.registrationNumber)}.
              </p>
              <div className="mt-3 rounded-[8px] bg-[#F8FAFC] px-3 py-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#3159C8]" />
                  <p className="text-[10px] font-medium text-[#475569] sm:text-[11px]">
                    Run premium ownership and history checks
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("pricing-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                type="button"
                className="mt-3 text-[10px] font-semibold text-[#4E67CF] transition-colors hover:text-[#3346A8] sm:text-[11px]"
              >
                Run Service/History Check
              </button>
            </Panel>

            <Panel title="Fuel Economy" icon={<Fuel className="h-3.5 w-3.5" />}>
              <TableRows
                emphasizeValue
                rows={[
                  { label: "Urban", value: fuelEconomy?.urban },
                  { label: "Extra Urban", value: fuelEconomy?.extraUrban },
                  { label: "Combined", value: fuelEconomy?.combined },
                ]}
              />
            </Panel>

            <Panel title="CO2 Emission Figures" icon={<Leaf className="h-3.5 w-3.5" />}>
              <div className="border-b border-[#EEF2F6] pb-3">
                <p className="text-center text-[20px] font-semibold text-[#1F2937] sm:text-[22px]">
                  {formatValue(co2?.value)}
                </p>
                <p className="mt-1 text-center text-[10px] text-[#7C8798] sm:text-[11px]">
                  D - F rated
                </p>
              </div>

              <div className="pt-3">
                <ScoreBars
                  items={[
                    { label: "0 - 100", value: "0", colorClass: "bg-[#16A34A]" },
                    { label: "101 - 110", value: "0", colorClass: "bg-[#65A30D]" },
                    { label: "111 - 120", value: "0", colorClass: "bg-[#A3E635]" },
                    { label: "121 - 130", value: "0", colorClass: "bg-[#FACC15]" },
                    { label: "131 - 140", value: "0", colorClass: "bg-[#FB923C]" },
                    { label: "141+", value: formatValue(co2?.value), colorClass: "bg-[#EF4444]" },
                  ]}
                />
              </div>
            </Panel>

            <Panel title="Safety Ratings" icon={<ShieldCheck className="h-3.5 w-3.5" />}>
              <ScoreBars
                items={[
                  { label: "Child", value: safetyRatings?.child, colorClass: "bg-[#1E3A8A]" },
                  { label: "Adult", value: safetyRatings?.adult, colorClass: "bg-[#1E3A8A]" },
                  { label: "Pedestrian", value: safetyRatings?.pedestrian, colorClass: "bg-[#1E3A8A]" },
                ]}
              />
            </Panel>

            <Panel title="Road Tax" icon={<ReceiptPoundSterling className="h-3.5 w-3.5" />}>
              <TableRows
                emphasizeValue
                rows={[
                  { label: "Tax 12 Months Cost", value: roadTax?.tax12MonthsCost },
                  { label: "Tax 6 Months Cost", value: roadTax?.tax6MonthsCost },
                ]}
              />
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
