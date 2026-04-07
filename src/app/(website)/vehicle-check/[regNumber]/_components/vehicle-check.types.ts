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
  reportType?: string;
  __v?: number;
  status?: {
    taxStatus?: string;
    taxDueDate?: string;
    taxDaysLeft?: number;
    motStatus?: string;
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
    bodyStyle?: string;
    yearOfManufacture?: number;
    dateFirstRegistered?: string;
    lastV5cIssueDate?: string;
    ulezCompliant?: string;
    typeApproval?: string;
    wheelPlan?: string;
    vehicleAge?: string;
  };
  vehicleFlags?: {
    exported?: string;
    safetyRecalls?: string;
    damageHistory?: string;
    salvageHistory?: string;
    fullServiceHistory?: string;
    writtenOff?: string;
    onFinance?: string;
    keeperPlateChangesImportExportVinLogbookCheck?: string;
    stolen?: string;
    internetHistory?: string;
  };
  mileage?: {
    lastMotMileage?: string;
    mileageIssues?: string;
    averageMileage?: string;
    mileageStatus?: string;
    estimatedCurrentMileage?: string;
  };
  motHistory?: {
    totalTests?: number;
    passed?: number;
    failed?: number;
    passRate?: string;
  };
  roadTax?: {
    cost12Months?: string;
    cost6Months?: string;
    co2Emissions?: string;
    co2EmissionBand?: string;
  };
  rawResponse?: Record<string, unknown>;
  pricingPlans?: VehiclePlan[];
  createdAt?: string;
  updatedAt?: string;
};
