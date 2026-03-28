import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, CalendarDays, CarFront, Fuel, Gauge } from "lucide-react";

import type {
  MotHistoryData,
  MotHistoryVehicle,
} from "./mot-history.types";
import MotHistoryDownloadButton from "./mot-history-download-button";
import {
  formatDate,
  formatRegistrationNumber,
  formatValue,
} from "./mot-history.utils";

type Props = {
  registrationNumber?: string;
  vehicle?: MotHistoryVehicle | null;
  motHistory?: MotHistoryData | null;
};

function InfoPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/70">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-white sm:text-base">
        {formatValue(value)}
      </p>
    </div>
  );
}

export default function MotHistoryHero({
  registrationNumber,
  vehicle,
  motHistory,
}: Props) {
  const plateNumber =
    vehicle?.heroSection?.registrationNumber ||
    motHistory?.registrationNumber ||
    registrationNumber;
  const vehicleTitle =
    [motHistory?.make, motHistory?.model].filter(Boolean).join(" ") ||
    vehicle?.heroSection?.vehicleName ||
    vehicle?.vehicleDetails?.modelVariant ||
    "Vehicle record";
  const vehicleCheckHref = plateNumber
    ? `/vehicle-check/${encodeURIComponent(formatRegistrationNumber(plateNumber))}`
    : "/";

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/mot_history_hero.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10">
        <div className="container mx-auto px-4 pb-24 pt-8 sm:px-6 lg:px-8 lg:pb-28">
          <Link
            href={vehicleCheckHref}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vehicle check
          </Link>

          <div className="mt-12 max-w-3xl text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/65">
              MOT history and inspection timeline
            </p>
            <h1 className="mt-4 text-3xl font-semibold sm:text-4xl lg:text-5xl">
              {vehicleTitle}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">
              A clean timeline view of the latest MOT outcome, mileage records,
              expiry details, and the key vehicle information we could match for
              this registration.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="inline-flex min-h-[56px] items-center rounded-[18px] border border-white/15 bg-[#0C1528]/70 px-5 py-3 text-white shadow-[0_18px_40px_rgba(2,6,23,0.2)] backdrop-blur-sm">
              <span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[#FFD54F]">
                UK
              </span>
              <span className="ml-3 border-l border-white/15 pl-3 text-xl font-extrabold tracking-[0.22em] sm:text-2xl">
                {formatRegistrationNumber(plateNumber) || "N/A"}
              </span>
            </div>

            <MotHistoryDownloadButton
              registrationNumber={registrationNumber}
              vehicle={vehicle}
              motHistory={motHistory}
            />
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <InfoPill
              icon={<CarFront className="h-4 w-4" />}
              label="Colour"
              value={motHistory?.primaryColour || vehicle?.vehicleDetails?.primaryColour}
            />
            <InfoPill
              icon={<Fuel className="h-4 w-4" />}
              label="Fuel"
              value={motHistory?.fuelType || vehicle?.vehicleDetails?.fuelType}
            />
            <InfoPill
              icon={<Gauge className="h-4 w-4" />}
              label="Engine"
              value={
                motHistory?.engineSize
                  ? `${motHistory.engineSize} cc`
                  : vehicle?.vehicleDetails?.engine
              }
            />
            <InfoPill
              icon={<CalendarDays className="h-4 w-4" />}
              label="First used"
              value={formatDate(motHistory?.firstUsedDate)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
