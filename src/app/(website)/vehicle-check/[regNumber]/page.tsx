import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

import VehicleCheckDetails from "./_components/VehicleCheckDetails";
import type { VehicleCheckResponse } from "./_components/vehicle-check.types";

type PageProps = {
  params: {
    regNumber: string;
  };
};

const VEHICLE_CHECK_TOKEN =
  process.env.VEHICLE_CHECK_BEARER_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzM1ZDEwMGU2ZTdhYmEzNThiODY5MCIsImVtYWlsIjoia29uZ2tvbjQ1NDVAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzQ0MjY2NzYsImV4cCI6MTc3NTAzMTQ3Nn0.tkN30PqxstydqICq8BTDa3NOhXuui9SdnQ8qPG_i5Y8";

async function getVehicleCheck(regNumber: string) {
  const session = await getServerSession(authOptions);
  const token = session?.user?.accessToken || VEHICLE_CHECK_TOKEN;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

  try {
    const response = await fetch(`${baseUrl}/check-car`, {
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

  return (
    <div >
      <VehicleCheckDetails
        regNumber={regNumber}
        vehicle={data}
        errorMessage={errorMessage}
      />
    </div>
  );
}
