import type { ReactNode } from "react";

import {
  AlertTriangle,
  CalendarDays,
  CarFront,
  Cloud,
  Factory,
  FileText,
  Fuel,
  Gauge,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type { VehicleCheckData } from "./vehicle-check.types";

type Props = {
  vehicle: VehicleCheckData;
};

const formatValue = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return "Not available";
  }

  return String(value);
};

type DetailRow = {
  label: string;
  value: string;
};

function InfoCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon: ReactNode;
  rows: DetailRow[];
}) {
  return (
    <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EEF4FF] text-[#1D4ED8]">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#111827]">{title}</h3>
          <p className="text-sm text-[#6B7280]">Live details from your vehicle check</p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between gap-4 rounded-2xl bg-[#F8FAFC] px-4 py-3"
          >
            <span className="text-sm font-medium text-[#475569]">{row.label}</span>
            <span className="text-right text-sm font-semibold text-[#0F172A]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VehicleCheckExtraInformation({ vehicle }: Props) {
  const vehicleDetails = vehicle.vehicleDetails;
  const vehicleInfo = vehicle.importantVehicleInformation;
  const co2Value = vehicle.co2EmissionFigures?.value;

  return (
    <section className="bg-[#F8FAFC] py-14 sm:py-16">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex rounded-full bg-[#DBEAFE] px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#1D4ED8]">
            Extra information
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
            Vehicle profile at a glance
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#475569] sm:text-base">
            A clean summary of the data returned from your latest vehicle check.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <InfoCard
              title="Vehicle details"
              icon={<CarFront className="h-5 w-5" />}
              rows={[
                {
                  label: "Model / Variant",
                  value: formatValue(vehicleDetails?.modelVariant),
                },
                {
                  label: "Primary colour",
                  value: formatValue(vehicleDetails?.primaryColour),
                },
                {
                  label: "Fuel type",
                  value: formatValue(vehicleDetails?.fuelType),
                },
                {
                  label: "Engine",
                  value: formatValue(vehicleDetails?.engine),
                },
              ]}
            />

            <InfoCard
              title="Registration facts"
              icon={<CalendarDays className="h-5 w-5" />}
              rows={[
                {
                  label: "Year of manufacture",
                  value: formatValue(vehicleDetails?.yearOfManufacture),
                },
                {
                  label: "Registration date",
                  value: formatValue(vehicleDetails?.registrationDate),
                },
                {
                  label: "Last V5C issued",
                  value: formatValue(vehicleDetails?.lastV5CIssuedDate),
                },
                {
                  label: "Wheel plan",
                  value: formatValue(vehicleDetails?.wheelPlan),
                },
              ]}
            />
          </div>

          <div className="rounded-[28px] border border-[#DBEAFE] bg-[linear-gradient(180deg,#EFF6FF_0%,#FFFFFF_100%)] p-6 shadow-[0_18px_50px_rgba(29,78,216,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1D4ED8] text-white">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#0F172A]">Important vehicle information</h3>
                <p className="text-sm text-[#475569]">Key flags and emissions summary</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                  <p className="text-sm font-medium text-[#64748B]">Exported status</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-[#0F172A]">
                  {formatValue(vehicleInfo?.exported)}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <Cloud className="h-5 w-5 text-[#10B981]" />
                  <p className="text-sm font-medium text-[#64748B]">CO2 emissions figure</p>
                </div>
                <p className="mt-3 text-2xl font-bold text-[#0F172A]">
                  {co2Value ? `${co2Value} g/km` : "Not available"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-[#0F172A] p-5 text-white">
                  <Factory className="h-5 w-5 text-[#60A5FA]" />
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/70">
                    Euro status
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatValue(vehicleDetails?.euroStatus)}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#1E293B] p-5 text-white">
                  <Gauge className="h-5 w-5 text-[#34D399]" />
                  <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/70">
                    Fuel / engine
                  </p>
                  <p className="mt-2 text-sm font-semibold">
                    {formatValue(vehicleDetails?.fuelType)}
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    {formatValue(vehicleDetails?.engine)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3 text-[#1D4ED8]">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-[#111827]">Quick summary</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#475569]">
              {formatValue(vehicle.heroSection?.vehicleName)} in{" "}
              {formatValue(vehicleDetails?.primaryColour)} with{" "}
              {formatValue(vehicleDetails?.fuelType).toLowerCase()} power and{" "}
              {formatValue(vehicleDetails?.euroStatus)} compliance.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3 text-[#0F766E]">
              <Fuel className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-[#111827]">Ownership-ready facts</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#475569]">
              Registration date: {formatValue(vehicleDetails?.registrationDate)}. Last
              V5C issued: {formatValue(vehicleDetails?.lastV5CIssuedDate)}.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3 text-[#7C3AED]">
              <FileText className="h-5 w-5" />
              <h3 className="text-lg font-semibold text-[#111827]">Check snapshot</h3>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#475569]">
              Created at {formatValue(vehicle.createdAt)} and updated at{" "}
              {formatValue(vehicle.updatedAt)}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
