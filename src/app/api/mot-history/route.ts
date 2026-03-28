import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

const VEHICLE_CHECK_TOKEN =
  process.env.VEHICLE_CHECK_BEARER_TOKEN ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YzM1ZDEwMGU2ZTdhYmEzNThiODY5MCIsImVtYWlsIjoia29uZ2tvbjQ1NDVAZ21haWwuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NzQ0MjY2NzYsImV4cCI6MTc3NTAzMTQ3Nn0.tkN30PqxstydqICq8BTDa3NOhXuui9SdnQ8qPG_i5Y8";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { registrationNumber?: string };
    const registrationNumber = body?.registrationNumber?.trim().toUpperCase();

    if (!registrationNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "Registration number is required.",
        },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    const token = session?.user?.accessToken || VEHICLE_CHECK_TOKEN;
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

    const response = await fetch(`${baseUrl}/check-car/mot-history`, {
      method: "POST",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ registrationNumber }),
      cache: "no-store",
    });

    const payload = await response.json();

    if (!response.ok || !payload?.success) {
      return NextResponse.json(
        {
          success: false,
          message: payload?.message || "Failed to fetch MOT history.",
        },
        { status: response.status || 500 },
      );
    }

    return NextResponse.json(payload, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to fetch MOT history.",
      },
      { status: 500 },
    );
  }
}
