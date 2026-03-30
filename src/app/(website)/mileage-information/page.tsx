import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MileageInformationContainer from "./_components/mileage-information-container";
import type { MotHistoryData } from "@/app/(website)/mot-history/_components/mot-history.types";
import type { VehicleCheckData } from "@/app/(website)/vehicle-check/[regNumber]/_components/vehicle-check.types";

type PageProps = {
  searchParams: {
    registrationNumber?: string;
  };
};

async function getMileageData(regNumber: string) {
  const session = await getServerSession(authOptions);
  const token = (session?.user as { accessToken?: string })?.accessToken;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/check-car/mot-history`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationNumber: regNumber }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok || !payload?.success) {
      return { vehicle: null, motHistory: null, errorMessage: payload?.message || "Failed to fetch mileage data." };
    }

    return {
      vehicle: payload?.data?.vehicle as VehicleCheckData,
      motHistory: payload?.data?.motHistory as MotHistoryData,
      errorMessage: null,
    };
  } catch (error) {
    return {
      vehicle: null,
      motHistory: null,
      errorMessage: error instanceof Error ? error.message : "Unable to connect to the mileage service.",
    };
  }
}

export default async function MileageInformationPage({ searchParams }: PageProps) {
  const regNumber = searchParams.registrationNumber || "";
  
  if (!regNumber) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">Registration number is required.</p>
      </div>
    );
  }

  const { vehicle, motHistory, errorMessage } = await getMileageData(regNumber);

  if (errorMessage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-semibold text-[15px]">{errorMessage}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <MileageInformationContainer vehicle={vehicle} motHistory={motHistory} />
    </div>
  );
}