export interface UserProfileApiResponse {
  status: boolean;
  message: string;
  data: UserProfile;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  gender: string;
  role: "ADMIN" | "USER" | string;
  stripeAccountId: string | null;
  bio: string;
  profileImage: string;
  multiProfileImage: string[];
  pdfFile: string;
  otp: string | null;
  otpExpires: string | null;
  otpVerified: boolean;
  resetExpires: string | null;
  isVerified: boolean;
  refreshToken: string;
  hasActiveSubscription: boolean;
  subscriptionExpireDate: string | null;
  blockedUsers: string[];
  language: string;
  address: Address;
}

export interface Address {
  country: string;
  cityState: string;
  roadArea: string;
  postalCode: string;
  taxId: string;
}