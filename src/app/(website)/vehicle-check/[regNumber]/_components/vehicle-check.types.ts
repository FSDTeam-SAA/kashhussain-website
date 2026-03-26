export type VehicleCheckResponse = {
  statusCode: number;
  success: boolean;
  message: string;
  data: VehicleCheckData;
};

export type VehiclePlan = {
  name?: string;
  price?: string;
  features?: string[];
  isPopular?: boolean;
};

export type VehicleCheckData = {
  _id?: string;
  user?: string;
  registrationNumber: string;
  __v?: number;
  heroSection?: {
    registrationNumber?: string;
    vehicleName?: string;
    tax?: {
      expiryDate?: string;
      daysLeft?: string;
    };
    mot?: {
      expiryDate?: string;
      daysLeft?: string;
    };
  };
  vehicleDetails?: {
    modelVariant?: string;
    description?: string;
    primaryColour?: string;
    fuelType?: string;
    transmission?: string;
    driveType?: string;
    engine?: string;
    bodyStyle?: string;
    yearOfManufacture?: number;
    euroStatus?: string;
    ulezCompliant?: string;
    vehicleAge?: string;
    registrationPlace?: string;
    registrationDate?: string;
    lastV5CIssuedDate?: string;
    wheelPlan?: string;
  };
  importantVehicleInformation?: {
    exported?: string;
    safetyRecalls?: string;
    damageHistory?: string;
    salvageHistory?: string;
    fullServiceHistory?: string;
    exTaxiNhsPoliceCheck?: string;
    writtenOff?: string;
    internetHistory?: string;
    onFinance?: string;
    keeperPlateChangesImportExportVinLogbookCheck?: string;
    stolen?: string;
  };
  mileageInformation?: {
    lastMotMileage?: number;
    mileageIssues?: string;
    average?: number;
    status?: string;
  };
  motHistorySummary?: {
    totalTests?: number;
    passed?: number;
    failed?: number;
  };
  performance?: {
    power?: string;
    maxSpeed?: string;
    maxTorque?: string;
    zeroToSixty?: string;
  };
  fuelEconomy?: {
    urban?: string;
    extraUrban?: string;
    combined?: string;
  };
  co2EmissionFigures?: {
    value?: string;
    rating?: string;
  };
  safetyRatings?: {
    child?: string;
    adult?: string;
    pedestrian?: string;
  };
  dimensionsAndWeight?: {
    width?: string;
    height?: string;
    length?: string;
    wheelBase?: string;
    kerbWeight?: string;
    maxAllowedWeight?: string;
  };
  roadTax?: {
    tax12MonthsCost?: string;
    tax6MonthsCost?: string;
  };
  pricingPlans?: VehiclePlan[];
  createdAt?: string;
  updatedAt?: string;
};
