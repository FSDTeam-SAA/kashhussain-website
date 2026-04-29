import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import MileageInformationContainer from "./_components/mileage-information-container";
import type { VehicleCheckData } from "@/app/(website)/vehicle-check/[regNumber]/_components/vehicle-check.types";
// import VehicleCheckExtraInformation from "@/app/(website)/vehicle-check/[regNumber]/_components/VehicleCheckExtraInformation";

type PageProps = {
  searchParams: {
    registrationNumber?: string;
  };
};

async function getMileageData(regNumber: string) {
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
    let errorMessage = "";

    if (vehicleRes && vehicleRes.ok) {
      const payload = await vehicleRes.json();
      if (payload?.success) {
        vehicle = payload.data as VehicleCheckData;
      } else {
        errorMessage = payload?.message || "Failed to fetch vehicle details.";
      }
    }

    if (!vehicle && !errorMessage) {
      errorMessage = "Vehicle details not found.";
    }

    return {
      vehicle,
      errorMessage: errorMessage || null,
    };
  } catch (error) {
    return {
      vehicle: null,
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

  const { vehicle, errorMessage } = await getMileageData(regNumber);

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
      <MileageInformationContainer vehicle={vehicle} />
      {/* {vehicle && (
        <VehicleCheckExtraInformation vehicle={vehicle} />
      )} */}
    </div>
  );
}
