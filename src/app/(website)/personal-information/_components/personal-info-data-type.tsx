


export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "user" | "admin" | string;
  createdAt: string;
  updatedAt: string;
  __v: number;

  address?: string;
  city?: string;
  country?: string;
  gender?: "male" | "female" | "other" | string;

  otp?: string;
  otpExpiry?: string;

  phoneNumber?: string;
  profilePicture?: string;

  verifiedForget?: boolean;
}

export interface UserApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: User;
}