"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeAlert,
  Fuel,
  Gauge,
  Leaf,
  ReceiptPoundSterling,
  Ruler,
  ShieldCheck,
  Star,
  FileText,
} from "lucide-react";

import type { VehicleCheckData } from "./vehicle-check.types";
import type { MotHistoryData } from "@/app/(website)/mot-history/_components/mot-history.types";

type Props = {
  vehicle: VehicleCheckData;
  motHistory?: MotHistoryData | null;
};

type DetailRow = {
  label: string;
  subLabel?: string;
  value?: string | number | null;
  tone?: "default" | "warning" | "danger" | "success" | "manual";
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

function getPillClass(tone: DetailRow["tone"]) {
  switch (tone) {
    case "success":
      return "bg-green-50 text-green-700 border border-green-200";
    case "warning":
      return "bg-amber-50 text-amber-600 border border-amber-200";
    case "danger":
      return "bg-red-50 text-red-600 border border-red-200";
    case "manual":
      return "bg-rose-50 text-rose-600 border border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border border-gray-200";
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
    <section className="rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
      <div className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-50">
        <span className="flex items-center justify-center text-gray-400">
          {icon}
        </span>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
      </div>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function TableRows({ rows }: { rows: DetailRow[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((row, i) => {
        const value = formatValue(row.value);
        return (
          <div
            key={row.label}
            className={`flex items-start justify-between gap-4 py-3 ${
              i !== rows.length - 1 ? "border-b border-gray-100/50" : ""
            }`}
          >
            <div className="flex flex-col">
              <span className="text-[13px] font-medium text-gray-600">
                {row.label}
              </span>
              {row.subLabel && (
                <span className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                  {row.subLabel}
                </span>
              )}
            </div>
            <span className="text-right text-[13px] font-semibold text-gray-900 whitespace-nowrap">
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
    <div className="flex flex-col">
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={`flex items-center justify-between gap-4 py-3.5 ${
            i !== rows.length - 1 ? "border-b border-gray-100/50" : ""
          }`}
        >
          <div className="flex flex-col max-w-[80%]">
            <span className="text-[13px] font-bold text-gray-900">
              {row.label}
            </span>
            {row.subLabel && (
              <span className="text-[11px] text-gray-400 mt-1 leading-snug">
                {row.subLabel}
              </span>
            )}
          </div>
          <span
            className={`inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold ${getPillClass(
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

function LinkAction({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="mt-4 inline-flex items-center gap-1 text-[13px] font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
    >
      {label}
      <ArrowRight className="h-4 w-4 ml-1" />
    </button>
  );
}

export default function VehicleCheckExtraInformation({
  vehicle,
  motHistory,
}: Props) {
  const details = vehicle?.vehicleDetails;
  const mileage = vehicle?.mileageInformation;
  const motHistorySummary = vehicle?.motHistorySummary;
  const performance = vehicle?.performance;
  const info = vehicle?.importantVehicleInformation;
  const dimensions = vehicle?.dimensionsAndWeight;
  const fuelEconomy = vehicle?.fuelEconomy;
  const roadTax = vehicle?.roadTax;
  const safetyRatings = vehicle?.safetyRatings;
  const co2 = vehicle?.co2EmissionFigures;

  return (
    <section className="relative z-20 bg-gray-50/50 py-10 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            <Panel
              title="Vehicle Details"
              icon={<FileText className="h-[18px] w-[18px]" />}
            >
              <TableRows
                rows={[
                  { label: "Model Variant", value: details?.modelVariant },
                  { label: "Description", value: details?.description },
                  { label: "Primary Colour", value: details?.primaryColour },
                  { label: "Fuel Type", value: details?.fuelType },
                  { label: "Transmission", value: details?.transmission },
                  { label: "Drive type", value: details?.driveType },
                  { label: "Engine", value: details?.engine },
                  { label: "Body Style", value: details?.bodyStyle },
                  {
                    label: "Year Manufacture",
                    value: details?.registrationDate
                      ? new Date(details.registrationDate).getFullYear()
                      : "N/A",
                  },
                  { label: "Euro Status", value: details?.euroStatus },
                  { label: "ULEZ Compliant", value: "Yes" },
                  { label: "Vehicle Age", value: details?.vehicleAge },
                  {
                    label: "Registration Place",
                    value: details?.registrationPlace,
                  },
                  {
                    label: "Registration Date",
                    value: details?.registrationDate,
                  },
                  {
                    label: "Last V5C Issue Date",
                    value: details?.lastV5CIssuedDate,
                  },
                  { label: "Wheel Plan", value: "2 Axle Rigid Body" },
                ]}
              />
            </Panel>

            <Panel
              title="Performance"
              icon={<Gauge className="h-[18px] w-[18px]" />}
            >
              <div className="grid grid-cols-2 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50/80 p-5">
                  <p className="text-[12px] font-medium text-gray-500">Power</p>
                  <p className="mt-1 text-[13px] font-bold text-gray-900">
                    {formatValue(performance?.power)}
                  </p>
                </div>
                <div className="bg-gray-50/80 p-5">
                  <p className="text-[12px] font-medium text-gray-500">
                    Max Speed
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-gray-900">
                    {formatValue(performance?.maxSpeed)}
                  </p>
                </div>
                <div className="bg-gray-50/80 p-5">
                  <p className="text-[12px] font-medium text-gray-500">
                    Max Torque
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-gray-900">
                    {formatValue(performance?.maxTorque)}
                  </p>
                </div>
                <div className="bg-gray-50/80 p-5">
                  <p className="text-[12px] font-medium text-gray-500">
                    0 to 60 MPH
                  </p>
                  <p className="mt-1 text-[13px] font-bold text-gray-900">
                    {formatValue(performance?.zeroToSixty)}
                  </p>
                </div>
              </div>
            </Panel>

            <Panel
              title="Important Vehicle Information"
              icon={<BadgeAlert className="h-[18px] w-[18px] text-red-500" />}
            >
              <FlagRows
                rows={[
                  {
                    label: "Exported",
                    value: info?.exported ? "Yes" : "NO",
                    tone: info?.exported ? "warning" : "default",
                  },
                  {
                    label: "Safety Recalls",
                    value: info?.safetyRecalls || "Manual",
                    tone:
                      info?.safetyRecalls && info.safetyRecalls !== "Manual"
                        ? "warning"
                        : "manual",
                  },
                  {
                    label: "Damage History",
                    subLabel:
                      "Includes damage locations, cause of damage, insurer name, loss date + more*",
                    value: info?.damageHistory || "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Salvage History",
                    subLabel:
                      "Includes date, Salvage location, auction date and much more*",
                    value: info?.salvageHistory || "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Full Service History",
                    subLabel:
                      "Includes service date, mileage at service, service type, garage name + more*",
                    value: info?.fullServiceHistory || "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Ex-Taxi / NHS / Police Check",
                    subLabel:
                      "Includes taxi/private hire local authority, license start date, license end date, and any NHS or police vehicle history + more*",
                    value: "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Written Off",
                    subLabel:
                      "Includes vehicle damage category, cause of damage, insurer name, loss date + more*",
                    value: info?.writtenOff || "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Internet History",
                    subLabel:
                      "See where in the internet history, including past listings, price changes, and sales type + more*",
                    value: "Manual",
                    tone: "manual",
                  },
                  {
                    label: "On Finance",
                    subLabel:
                      "Includes agreement number, finance company, agreement type, date + more*",
                    value: info?.onFinance || "Manual",
                    tone: "manual",
                  },
                  {
                    label:
                      "Keeper/Plate Changes, Import/Export/VIN/Logbook Check + 80 More Checks*",
                    value:
                      info?.keeperPlateChangesImportExportVinLogbookCheck ||
                      "Manual",
                    tone: "manual",
                  },
                  {
                    label: "Stolen",
                    subLabel: "*Includes Stolen In History",
                    value: info?.stolen || "Manual",
                    tone: "manual",
                  },
                ]}
              />
            </Panel>

            <Panel
              title="Dimensions & Weight"
              icon={<Ruler className="h-[18px] w-[18px]" />}
            >
              <TableRows
                rows={[
                  { label: "Width", value: dimensions?.width },
                  { label: "Height", value: dimensions?.height },
                  { label: "Length", value: dimensions?.length },
                  { label: "Wheel base", value: dimensions?.wheelBase },
                  { label: "Kerb weight", value: dimensions?.kerbWeight },
                  {
                    label: "Max. allowed weight",
                    value: dimensions?.maxAllowedWeight,
                  },
                ]}
              />
            </Panel>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            <Panel
              title="Mileage Information"
              icon={<Activity className="h-[18px] w-[18px]" />}
            >
              <TableRows
                rows={[
                  {
                    label: "Last MOT Mileage",
                    value: mileage?.lastMotMileage
                      ? `${formatNumber(mileage.lastMotMileage)}`
                      : FALLBACK_VALUE,
                  },
                  {
                    label: "Mileage issues",
                    value: mileage?.mileageIssues || "No",
                  },
                  {
                    label: "Average",
                    value: mileage?.average
                      ? formatNumber(mileage.average)
                      : FALLBACK_VALUE,
                  },
                ]}
              />
              <div className="flex items-center justify-between py-4">
                <span className="text-[13px] font-medium text-gray-600">
                  Status
                </span>
                <span className="inline-flex items-center justify-center rounded-full bg-[#FFFBEB] px-3.5 py-1 text-[10px] uppercase font-bold text-amber-600 border border-amber-200">
                  {mileage?.status || "UNSEEN"}
                </span>
              </div>
              <div className="mt-2 text-center pb-2">
                <Link
                  href={`/mileage-information?registrationNumber=${encodeURIComponent(vehicle?.registrationNumber || "")}`}
                >
                  <LinkAction label="View Full Mileage History" />
                </Link>
              </div>
            </Panel>

            <Panel
              title="MOT History Summary"
              icon={<ShieldCheck className="h-[18px] w-[18px]" />}
            >
              <div className="grid grid-cols-3 gap-3 mb-5 px-1 py-1">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center shadow-sm">
                  <p className="text-[11px] font-medium text-gray-500">
                    Total Tests
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {motHistory?.totalTests ??
                      motHistorySummary?.totalTests ??
                      0}
                  </p>
                </div>
                <div className="rounded-2xl border border-green-100 bg-green-50/50 p-4 text-center shadow-sm">
                  <p className="text-[11px] font-medium text-green-700">
                    Passed
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {motHistory?.totalPassed ?? motHistorySummary?.passed ?? 0}
                  </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 text-center shadow-sm">
                  <p className="text-[11px] font-medium text-gray-500">
                    Failed
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {motHistory?.totalFailed ?? motHistorySummary?.failed ?? 0}
                  </p>
                </div>
              </div>
              <div className="text-center pb-2">
                <Link
                  href={`/mot-history?registrationNumber=${encodeURIComponent(vehicle?.registrationNumber || "")}`}
                >
                  <LinkAction label="View Full MOT History" />
                </Link>
              </div>
            </Panel>

            <Panel
              title="Service History Check"
              icon={<Star className="h-[18px] w-[18px] text-gray-400" />}
            >
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="mb-4 inline-flex items-center justify-center rounded-full bg-rose-50 px-3.5 py-1 text-[10px] font-bold tracking-wider text-rose-500 border border-rose-100 uppercase">
                  NEW
                </span>
                <h4 className="text-[15px] font-bold text-gray-900 leading-snug">
                  Check the full service history for{" "}
                  {formatValue(vehicle?.registrationNumber)}
                </h4>
                <p className="mt-2.5 max-w-xs text-[12px] leading-relaxed text-gray-500">
                  We check where, by whom, mileage at each visit, the type of
                  service performed, and details of the work carried out.
                </p>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("pricing-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  type="button"
                  className="mt-6 text-[13px] font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Start Service History Check
                </button>
              </div>
            </Panel>

            <Panel
              title="Fuel Economy"
              icon={<Fuel className="h-[18px] w-[18px]" />}
            >
              <TableRows
                rows={[
                  {
                    label: "Urban",
                    subLabel: "Driving around towns and cities",
                    value: fuelEconomy?.urban,
                  },
                  {
                    label: "Extra Urban",
                    subLabel: "Driving in towns and on faster A-roads",
                    value: fuelEconomy?.extraUrban,
                  },
                  {
                    label: "Combined",
                    subLabel: "A mix of urban and extra urban driving",
                    value: fuelEconomy?.combined,
                  },
                ]}
              />
            </Panel>

            <Panel
              title="CO2 Emission Figures"
              icon={<Leaf className="h-[18px] w-[18px] text-gray-400" />}
            >
              <div className="mb-6 mt-3 text-center">
                <p className="text-[24px] font-bold text-gray-900">
                  {formatValue(co2?.value)} g/km (K)
                </p>
              </div>

              <div className="space-y-3.5 px-3 mb-2">
                {[
                  {
                    range: "0 - 100",
                    letter: "A",
                    color: "bg-[#10B981]",
                    w: "15%",
                  },
                  {
                    range: "101 - 130",
                    letter: "B/C",
                    color: "bg-[#34D399]",
                    w: "30%",
                  },
                  {
                    range: "131 - 140",
                    letter: "D/E",
                    color: "bg-[#A7F3D0]",
                    w: "45%",
                  },
                  {
                    range: "141 - 165",
                    letter: "F/G",
                    color: "bg-[#FBBF24]",
                    w: "60%",
                  },
                  {
                    range: "166 - 225",
                    letter: "H/I/J/K",
                    color: "bg-[#F59E0B]",
                    w: "80%",
                  },
                  {
                    range: "225+",
                    letter: "L/M",
                    color: "bg-[#EF4444]",
                    w: "100%",
                  },
                ].map((band, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 text-[11px]"
                  >
                    <span className="w-16 text-right font-medium text-gray-500 whitespace-nowrap">
                      {band.range}
                    </span>
                    <div className="flex-1 h-3.5 bg-gray-50 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${band.color} rounded-r-full`}
                        style={{ width: band.w }}
                      ></div>
                    </div>
                    <span className="w-8 font-bold text-gray-900">
                      {band.letter}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Safety Ratings"
              icon={<ShieldCheck className="h-[18px] w-[18px]" />}
            >
              <div className="space-y-5 px-1 py-3">
                {[
                  { label: "Child", value: safetyRatings?.child || "80%" },
                  { label: "Adult", value: safetyRatings?.adult || "95%" },
                  {
                    label: "Pedestrian",
                    value: safetyRatings?.pedestrian || "72%",
                  },
                ].map((rating, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2 text-[13px]">
                      <span className="font-semibold text-gray-600">
                        {rating.label}
                      </span>
                      <span className="font-bold text-gray-900">
                        {formatValue(rating.value)}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-800 rounded-full"
                        style={{
                          width: rating.value?.toString().includes("%")
                            ? rating.value.toString()
                            : "85%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="Road Tax"
              icon={<ReceiptPoundSterling className="h-[18px] w-[18px]" />}
            >
              <p className="text-[11px] leading-relaxed text-gray-500 italic mb-5 mt-1 border-b border-gray-100/50 pb-5">
                *Please note that road tax rates are indicative. For
                confirmation of the current rates please refer to the{" "}
                <Link
                  href="https://www.gov.uk/vehicle-tax"
                  target="_blank"
                  className="text-blue-600 hover:underline not-italic font-medium"
                >
                  DVLA
                </Link>
                .
              </p>
              <TableRows
                rows={[
                  {
                    label: "Tax 12 Months Cost",
                    value: roadTax?.tax12MonthsCost,
                  },
                  {
                    label: "Tax 6 Months Cost",
                    value: roadTax?.tax6MonthsCost,
                  },
                ]}
              />
            </Panel>
          </div>
        </div>
      </div>
    </section>
  );
}
