"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";
import { useSession } from "next-auth/react";

import MotHistoryHero from "./mot-history-hero";
import MotHistorySkeleton from "./mot-history-skeleton";
import MotHistoryStats from "./mot-history-stats";
import MotHistoryTimeline from "./mot-history-timeline";
import type { MotHistoryData, MotHistoryPayload } from "./mot-history.types";
import { formatRegistrationNumber } from "./mot-history.utils";
import { MotChatBot } from "@/components/chatbot/mot-chat-bot";

type Props = {
  initialRegistrationNumber?: string;
};

type MotHistoryApiResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: MotHistoryPayload | MotHistoryData;
};

type CarTaxCheckResponse = {
  statusCode?: number;
  success?: boolean;
  message?: string;
  data?: {
    registrationNumber?: string;
    status?: {
      taxDueDate?: string;
      taxDaysLeft?: number;
      motExpiryDate?: string;
      motDaysLeft?: number;
    };
    vehicleDetails?: {
      make?: string;
      model?: string;
      modelVariant?: string;
      colour?: string;
      fuelType?: string;
      engineCapacity?: string;
      yearOfManufacture?: number;
      dateFirstRegistered?: string;
      lastV5cIssueDate?: string;
      wheelPlan?: string;
    };
    vehicleFlags?: {
      exported?: string;
      stolen?: string;
      onFinance?: string;
      keeperPlateChangesImportExportVinLogbookCheck?: string;
      internetHistory?: string;
      salvageHistory?: string;
      damageHistory?: string;
      writtenOff?: string;
      fullServiceHistory?: string;
    };
    rawResponse?: {
      vehicle?: {
        registered_location?: string;
        mot?: {
          test_result?: Array<{
            status?: string;
            test_date?: string;
            expiry_date?: string;
            odometer_reading?: string;
            advisory?: Array<{
              description?: string;
              dangerous?: boolean;
            }>;
          }>;
          test_summary?: {
            test_count?: number;
            pass_count?: number;
            pass_with_advisory_count?: number;
            fail_count?: number;
          };
        };
      };
    };
  };
};

function mapCarTaxPayloadToMotHistory(
  payloadData?: CarTaxCheckResponse["data"],
): MotHistoryPayload | null {
  if (!payloadData || typeof payloadData !== "object") {
    return null;
  }

  const motTests = (payloadData.rawResponse?.vehicle?.mot?.test_result ?? [])
    .map((test) => {
      const comments =
        test.advisory?.map((item) => ({
          text: item.description || null,
          type: "ADVISORY",
          dangerous: item.dangerous ?? null,
        })) ?? [];

      return {
        completedDate: test.test_date || null,
        testResult: test.status || null,
        expiryDate: test.expiry_date || null,
        odometerValue: test.odometer_reading || null,
        odometerUnit: "mi",
        odometerResultType: "PRH",
        rfrAndComments: comments.length ? comments : null,
      };
    })
    .sort((a, b) => {
      const aTime = a.completedDate ? new Date(a.completedDate).getTime() : 0;
      const bTime = b.completedDate ? new Date(b.completedDate).getTime() : 0;
      return bTime - aTime;
    });

  const latestTest = motTests[0];
  const summary = payloadData.rawResponse?.vehicle?.mot?.test_summary;
  const totalPassed =
    (summary?.pass_count ?? 0) + (summary?.pass_with_advisory_count ?? 0);

  return {
    vehicle: {
      registrationNumber: payloadData.registrationNumber || null,
      heroSection: {
        registrationNumber: payloadData.registrationNumber || null,
        vehicleName:
          [payloadData.vehicleDetails?.make, payloadData.vehicleDetails?.model]
            .filter(Boolean)
            .join(" ") || null,
        tax: {
          expiryDate: payloadData.status?.taxDueDate || null,
          daysLeft:
            payloadData.status?.taxDaysLeft !== undefined
              ? String(payloadData.status.taxDaysLeft)
              : null,
        },
        mot: {
          expiryDate: payloadData.status?.motExpiryDate || null,
          daysLeft:
            payloadData.status?.motDaysLeft !== undefined
              ? String(payloadData.status.motDaysLeft)
              : null,
        },
      },
      vehicleDetails: {
        modelVariant: payloadData.vehicleDetails?.modelVariant || null,
        primaryColour: payloadData.vehicleDetails?.colour || null,
        fuelType: payloadData.vehicleDetails?.fuelType || null,
        engine: payloadData.vehicleDetails?.engineCapacity || null,
        yearOfManufacture: payloadData.vehicleDetails?.yearOfManufacture || null,
        registrationDate: payloadData.vehicleDetails?.dateFirstRegistered || null,
        lastV5CIssuedDate: payloadData.vehicleDetails?.lastV5cIssueDate || null,
        wheelPlan: payloadData.vehicleDetails?.wheelPlan || null,
        registrationPlace:
          payloadData.rawResponse?.vehicle?.registered_location || null,
      },
      importantVehicleInformation: {
        exported: payloadData.vehicleFlags?.exported || null,
        stolen: payloadData.vehicleFlags?.stolen || null,
        onFinance: payloadData.vehicleFlags?.onFinance || null,
        keeperPlateChangesImportExportVinLogbookCheck:
          payloadData.vehicleFlags?.keeperPlateChangesImportExportVinLogbookCheck ||
          null,
        internetHistory: payloadData.vehicleFlags?.internetHistory || null,
        salvageHistory: payloadData.vehicleFlags?.salvageHistory || null,
        damageHistory: payloadData.vehicleFlags?.damageHistory || null,
        writtenOff: payloadData.vehicleFlags?.writtenOff || null,
        fullServiceHistory: payloadData.vehicleFlags?.fullServiceHistory || null,
      },
    },
    motHistory: {
      registrationNumber: payloadData.registrationNumber || null,
      make: payloadData.vehicleDetails?.make || null,
      model: payloadData.vehicleDetails?.model || null,
      primaryColour: payloadData.vehicleDetails?.colour || null,
      fuelType: payloadData.vehicleDetails?.fuelType || null,
      firstUsedDate: payloadData.vehicleDetails?.dateFirstRegistered || null,
      engineSize:
        payloadData.vehicleDetails?.engineCapacity?.replace(/[^\d]/g, "") || null,
      motTests,
      totalTests: summary?.test_count ?? motTests.length,
      totalPassed,
      totalFailed: summary?.fail_count ?? 0,
      latestTestResult: latestTest?.testResult || null,
      latestExpiryDate:
        latestTest?.expiryDate || payloadData.status?.motExpiryDate || null,
      lastMileage: latestTest?.odometerValue
        ? Number(String(latestTest.odometerValue).replace(/[^\d]/g, ""))
        : null,
    },
  };
}

export default function MotHistoryContainer({
  initialRegistrationNumber,
}: Props) {
  const session = useSession();
  const token = (session?.data?.user as { accessToken?: string })?.accessToken;

  const [data, setData] = useState<MotHistoryPayload | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(initialRegistrationNumber));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (session.status === "loading") {
      return;
    }

    const registrationNumber = formatRegistrationNumber(initialRegistrationNumber);

    if (!registrationNumber) {
      setIsLoading(false);
      setData(null);
      setErrorMessage(null);
      return;
    }

    let isMounted = true;

    const loadMotHistory = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-tax/check`,
          {
            method: "POST",
            headers: {
              accept: "*/*",
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ vrm: registrationNumber }),
            cache: "no-store",
          },
        );

        const payload = (await response.json()) as
          | CarTaxCheckResponse
          | MotHistoryApiResponse
          | undefined;
        const normalizedData = mapCarTaxPayloadToMotHistory(
          (payload as CarTaxCheckResponse | undefined)?.data,
        );

        if (!response.ok || !payload?.success || !normalizedData) {
          throw new Error(
            payload?.message || "Unable to load MOT history right now.",
          );
        }

        if (isMounted) {
          setData(normalizedData);
        }
      } catch (error) {
        if (isMounted) {
          setData(null);
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load MOT history right now.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMotHistory();

    return () => {
      isMounted = false;
    };
  }, [initialRegistrationNumber, session.status, token]);

  if (!initialRegistrationNumber) {
    return (
      <section className="bg-[linear-gradient(180deg,#081225_0%,#0f172a_55%,#f7f9fc_55%,#f7f9fc_100%)] py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EEF4FF] text-[#3159C8]">
              <Search className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-3xl font-semibold text-[#0F172A]">
              MOT history needs a registration number
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#64748B] sm:text-base">
              Go back to the vehicle check page and choose{" "}
              <span className="font-semibold text-[#0F172A]">
                View MOT History
              </span>{" "}
              for the vehicle you want to inspect.
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#3159C8] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2849a6]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to vehicle search
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-[#F7F9FC]">
      <MotHistoryHero
        registrationNumber={initialRegistrationNumber}
        vehicle={data?.vehicle}
        motHistory={data?.motHistory}
      />

      <section className="relative -mt-12 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <MotHistorySkeleton />
          ) : errorMessage ? (
            <div className="rounded-[30px] border border-[#FECACA] bg-white p-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0F172A]">
                    We couldn&apos;t load the MOT history
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#64748B] sm:text-base">
                    {errorMessage}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <MotHistoryStats motHistory={data?.motHistory} />
              <MotHistoryTimeline motHistory={data?.motHistory} />
            </div>
          )}
        </div>
      </section>

      <MotChatBot data={data?.motHistory} />
    </div>
  );
}
