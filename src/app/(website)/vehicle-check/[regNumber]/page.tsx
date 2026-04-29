import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import VehicleCheckDetails from "./_components/VehicleCheckDetails";
import type { VehicleCheckResponse } from "./_components/vehicle-check.types";
import PricingSection from "./_components/pricing-plans";
import { ChatBot } from "@/components/chatbot/chat-bot";

type PageProps = {
  params: {
    regNumber: string;
  };
};

async function getVehicleCheck(regNumber: string) {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { accessToken?: string })?.accessToken;

  try {
    const vehicleRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/car-tax/check`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vrm: regNumber }),
        cache: "no-store",
      },
    ).catch(() => null);

    let vehicle = null;
    let errorMessage = "Vehicle check request failed.";
    if (vehicleRes && vehicleRes.ok) {
      const payload = (await vehicleRes.json()) as VehicleCheckResponse;
      if (payload?.success) {
        vehicle = payload.data;
        errorMessage = "";
      } else {
        errorMessage = payload?.message || errorMessage;
      }
    }

    return {
      vehicle,
      errorMessage: errorMessage || null,
    };
  } catch (error) {
    return {
      vehicle: null,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unable to connect to the vehicle check service.",
    };
  }
}

export default async function VehicleCheckPage({ params }: PageProps) {
  const regNumber = decodeURIComponent(params.regNumber);
  const { vehicle, errorMessage } = await getVehicleCheck(regNumber);

  return (
    <div >
      <VehicleCheckDetails
        regNumber={regNumber}
        vehicle={vehicle}
        errorMessage={errorMessage}
      />
      <PricingSection/>
      <ChatBot data={vehicle} motHistory={vehicle?.motHistory ?? null} />
    </div>
  );
}
