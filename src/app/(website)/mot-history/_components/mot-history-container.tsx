"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Search } from "lucide-react";

import MotHistoryHero from "./mot-history-hero";
import MotHistorySkeleton from "./mot-history-skeleton";
import MotHistoryStats from "./mot-history-stats";
import MotHistoryTimeline from "./mot-history-timeline";
import type { MotHistoryPayload } from "./mot-history.types";
import { formatRegistrationNumber } from "./mot-history.utils";
import { MotChatBot } from "@/components/chatbot/mot-chat-bot";

type Props = {
  initialRegistrationNumber?: string;
};

export default function MotHistoryContainer({
  initialRegistrationNumber,
}: Props) {
  const [data, setData] = useState<MotHistoryPayload | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(initialRegistrationNumber));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
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
        const response = await fetch("/api/mot-history", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ registrationNumber }),
        });

        const payload = (await response.json()) as
          | {
              success?: boolean;
              message?: string;
              data?: MotHistoryPayload;
            }
          | undefined;

        if (!response.ok || !payload?.success || !payload?.data) {
          throw new Error(
            payload?.message || "Unable to load MOT history right now.",
          );
        }

        if (isMounted) {
          setData(payload.data);
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
  }, [initialRegistrationNumber]);

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

  console.log("MOT History Data:", data?.motHistory);

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
