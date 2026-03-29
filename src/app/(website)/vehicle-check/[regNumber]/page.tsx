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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-car/free`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registrationNumber: regNumber,
      }),
      cache: "no-store",
    });

    const payload = (await response.json()) as VehicleCheckResponse;

    if (!response.ok || !payload?.success) {
      return {
        data: null,
        errorMessage: payload?.message || "Vehicle check request failed.",
      };
    }

    return {
      data: payload.data,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage:
        error instanceof Error
          ? error.message
          : "Unable to connect to the vehicle check service.",
    };
  }
}

export default async function VehicleCheckPage({ params }: PageProps) {
  const regNumber = decodeURIComponent(params.regNumber);
  const { data, errorMessage } = await getVehicleCheck(regNumber);

  console.log("data : ----------------------", data)

  return (
    <div >
      <VehicleCheckDetails
        regNumber={regNumber}
        vehicle={data}
        errorMessage={errorMessage}
      />
      <PricingSection/>
      <ChatBot data={data} />
    </div>
  );
}
