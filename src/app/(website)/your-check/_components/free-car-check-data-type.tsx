

// Root Response Type
export interface CarChecksApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  meta: Meta;
  data: CarCheck[];
}

// Meta তথ্য
export interface Meta {
  page: number;
  limit: number;
  total: number;
}

// Main Car Check টাইপ
export interface CarCheck {
  _id: string;
  user: string;
  registrationNumber: string;
  heroSection: HeroSection;
  vehicleDetails: VehicleDetails;
  importantVehicleInformation: ImportantVehicleInformation;
  co2EmissionFigures: Co2EmissionFigures;
//   pricingPlans: any[]; 
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Hero Section
export interface HeroSection {
  registrationNumber: string;
  vehicleName: string;
  tax: TaxOrMot;
  mot: TaxOrMot;
}

// Tax & MOT
export interface TaxOrMot {
  expiryDate: string;
  daysLeft: string;
}

// Vehicle Details
export interface VehicleDetails {
  modelVariant: string;
  primaryColour: string;
  fuelType: string;
  engine: string;
  yearOfManufacture: number;
  registrationDate: string;
  lastV5CIssuedDate: string;
  wheelPlan: string;
}

// Important Info
export interface ImportantVehicleInformation {
  exported: string;
}

// CO2
export interface Co2EmissionFigures {
  value: string;
}