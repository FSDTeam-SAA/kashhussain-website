"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, ShieldAlert } from "lucide-react";

import RegistrationPlate from "./RegistrationPlate";
import VehicleCheckExtraInformation from "./VehicleCheckExtraInformation";
import type { VehicleCheckData } from "./vehicle-check.types";

type Props = {
  regNumber: string;
  vehicle?: VehicleCheckData | null;
  errorMessage?: string | null;
};

const FALLBACK_VALUE = "Not available";

const formatDate = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const getDaysLeft = (value?: string) => {
  if (!value) {
    return null;
  }

  const expiry = new Date(value);
  const today = new Date();

  expiry.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(expiry.getTime())) {
    return null;
  }

  return Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
};

const formatDaysLeft = (value?: string) => {
  const daysLeft = getDaysLeft(value);

  if (daysLeft === null) {
    return "Expiry unavailable";
  }

  if (daysLeft < 0) {
    return `Expired ${Math.abs(daysLeft)} days ago`;
  }

  if (daysLeft === 0) {
    return "Expires today";
  }

  if (daysLeft === 1) {
    return "1 day left";
  }

  return `${daysLeft} days left`;
};

function StatusCard({
  title,
  status,
  expiryDate,
  daysLeft,
}: {
  title: string;
  status?: string;
  expiryDate?: string;
  daysLeft?: number;
}) {
  const resolvedDaysLeft =
    typeof daysLeft === "number" ? daysLeft : getDaysLeft(expiryDate);
  const normalizedStatus = status?.toLowerCase();
  const isHealthy =
    normalizedStatus === "taxed" ||
    normalizedStatus === "valid" ||
    (normalizedStatus ? false : resolvedDaysLeft === null ? false : resolvedDaysLeft >= 0);

  return (
    <div className="rounded-[28px] bg-white p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#111827]">
            {title}
          </p>
          <p
            className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isHealthy
                ? "bg-[#DCFCE7] text-[#166534]"
                : "bg-[#FEE2E2] text-[#991B1B]"
            }`}
          >
            {status || FALLBACK_VALUE}
          </p>
          <p className="mt-3 text-sm text-[#4B5563]">
            Expires: {formatDate(expiryDate)}
          </p>
          <p
            className={`mt-2 text-sm font-semibold ${
              isHealthy ? "text-[#16A34A]" : "text-[#DC2626]"
            }`}
          >
            {typeof resolvedDaysLeft === "number"
              ? resolvedDaysLeft < 0
                ? `Expired ${Math.abs(resolvedDaysLeft)} days ago`
                : resolvedDaysLeft === 0
                  ? "Expires today"
                  : resolvedDaysLeft === 1
                    ? "1 day left"
                    : `${resolvedDaysLeft} days left`
              : formatDaysLeft(expiryDate)}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-full ${
            isHealthy ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEE2E2] text-[#DC2626]"
          }`}
        >
          {isHealthy ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <ShieldAlert className="h-5 w-5" />
          )}
        </div>
      </div>
    </div>
  );
}

export default function VehicleCheckDetails({
  regNumber,
  vehicle,
  errorMessage,
}: Props) {
  const vehicleDetails = vehicle?.vehicleDetails;
  const status = vehicle?.status;
  const normalizedReg = vehicle?.registrationNumber || regNumber;
  const vehicleName =
    [vehicleDetails?.make, vehicleDetails?.model, vehicleDetails?.modelVariant]
      .filter(Boolean)
      .join(" ") || "Vehicle details unavailable";
  const vehicleType =
    vehicleDetails?.bodyStyle ||
    vehicleDetails?.modelVariant ||
    FALLBACK_VALUE;

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/assets/videos/home_hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72)_0%,rgba(2,6,23,0.52)_45%,rgba(2,6,23,0.78)_100%)]" />

        <div className="relative z-10 flex min-h-screen items-center justify-center py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl text-center text-white">
              <div className="flex justify-center">
                <RegistrationPlate
                  value={normalizedReg}
                  className="mx-auto h-[76px] max-w-[360px] sm:h-[90px] sm:max-w-[460px]"
                />
              </div>

              <h2 className="mt-8 text-3xl font-bold sm:text-5xl">
                {vehicleName}
              </h2>

              <p className="mt-3 text-sm text-white/90 sm:text-base">
                Not The Right Vehicle?{" "}
                <Link
                  href="/"
                  className="font-semibold text-[#7DD3FC] underline underline-offset-4"
                >
                  Check again
                </Link>
              </p>

              {errorMessage ? (
                <div className="mx-auto mt-10 max-w-2xl rounded-[28px] border border-[#FECACA] bg-white/95 p-6 text-left shadow-[0_20px_60px_rgba(15,23,42,0.14)]">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">
                        We couldn&apos;t load this vehicle check
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[#4B5563]">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                  <StatusCard
                    title="Tax"
                    status={status?.taxStatus}
                    expiryDate={status?.taxDueDate}
                    daysLeft={status?.taxDaysLeft}
                  />
                  <StatusCard
                    title="MOT"
                    status={status?.motStatus}
                    expiryDate={status?.motExpiryDate}
                    daysLeft={status?.motDaysLeft}
                  />
                </div>
              )}

              <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 rounded-[32px] border border-white/15 bg-white/10 p-5 text-left backdrop-blur-sm sm:grid-cols-3">
                <div className="rounded-[24px] bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Registration
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {normalizedReg}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Last checked
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-lg font-semibold text-white">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(vehicle?.updatedAt)}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white/10 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/65">
                    Vehicle type
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {vehicleType}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {vehicle ? <VehicleCheckExtraInformation vehicle={vehicle} /> : null}
    </>
  );
}
