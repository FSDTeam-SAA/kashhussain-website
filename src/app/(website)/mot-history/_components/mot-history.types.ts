export type MotHistoryComment = {
  text?: string | null;
  type?: string | null;
  dangerous?: boolean | null;
};

export type MotTest = {
  completedDate?: string | null;
  testResult?: string | null;
  expiryDate?: string | null;
  odometerValue?: string | null;
  odometerUnit?: string | null;
  odometerResultType?: string | null;
  rfrAndComments?: MotHistoryComment[] | null;
};

export type MotHistoryVehicle = {
  registrationNumber?: string | null;
  heroSection?: {
    registrationNumber?: string | null;
    vehicleName?: string | null;
    tax?: {
      expiryDate?: string | null;
      daysLeft?: string | null;
    } | null;
    mot?: {
      expiryDate?: string | null;
      daysLeft?: string | null;
    } | null;
  } | null;
  vehicleDetails?: {
    modelVariant?: string | null;
    primaryColour?: string | null;
    fuelType?: string | null;
    engine?: string | null;
    yearOfManufacture?: number | null;
    registrationDate?: string | null;
    lastV5CIssuedDate?: string | null;
    wheelPlan?: string | null;
  } | null;
  importantVehicleInformation?: {
    exported?: string | null;
  } | null;
  co2EmissionFigures?: {
    value?: string | null;
  } | null;
};

export type MotHistoryData = {
  registrationNumber?: string | null;
  make?: string | null;
  model?: string | null;
  primaryColour?: string | null;
  fuelType?: string | null;
  firstUsedDate?: string | null;
  engineSize?: string | null;
  motTests?: MotTest[] | null;
  totalTests?: number | null;
  totalPassed?: number | null;
  totalFailed?: number | null;
  latestTestResult?: string | null;
  latestExpiryDate?: string | null;
  lastMileage?: number | null;
};

export type MotHistoryPayload = {
  vehicle?: MotHistoryVehicle | null;
  motHistory?: MotHistoryData | null;
};
