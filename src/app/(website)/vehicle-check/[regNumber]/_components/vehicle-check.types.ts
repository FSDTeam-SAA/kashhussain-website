export type VehicleCheckResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: VehicleCheckData;
};

export type VehicleCheckData = {
  user: string;
  registrationNumber: string;
  heroSection?: {
    registrationNumber?: string;
    vehicleName?: string;
    tax?: {
      expiryDate?: string;
    };
    mot?: {
      expiryDate?: string;
    };
  };
  vehicleDetails?: {
    modelVariant?: string;
    primaryColour?: string;
    fuelType?: string;
    engine?: string;
    yearOfManufacture?: number;
    euroStatus?: string;
    registrationDate?: string;
    lastV5CIssuedDate?: string;
    wheelPlan?: string;
  };
  importantVehicleInformation?: {
    exported?: string;
  };
  co2EmissionFigures?: {
    value?: string;
  };
  pricingPlans?: unknown[];
  createdAt?: string;
  updatedAt?: string;
};
