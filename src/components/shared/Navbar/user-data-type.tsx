export type UserRole = "admin" | "player" | "gk";
export type AuthProvider = "credentials" | "google";


export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
  role: UserRole;
  provider: AuthProvider;

  profileImage: string
  verified: boolean

  socialMedia: string[]
  playingVideo: string[]

  isSubscription: boolean
  subscription: string | null
  subscriptionExpiry?: string

  accessLavel: string[]

  createdAt: string
  updatedAt: string
  lastLogin?: string

  // Optional profile fields (player/admin specific)
  agent?: string
  birthdayPlace?: string
  citizenship?: string
  currentClub?: string
  dob?: string
  foot?: string
  gender?: string
  hight?: string
  weight?: string
  phone?: string
  nationality?: string
  league?: string | null
  category?: string | null
  position?: string[]

  inSchoolOrCollege?: boolean
  institute?: string
  gpa?: string
  satAct?: string
  age?:number;

    team?: string;
  numberOfGame?: number;

  __v?: number
}

export interface Meta {
  total: number
  page: number
  limit: number
}

export interface UsersApiResponse {
  statusCode: number
  success: boolean
  message: string
  meta: Meta
  data: User[]
}


// export interface UsersApiResponse<T> {
//   statusCode: number
//   success: boolean
//   message: string
//   meta: Meta
//   data: T[]
// }




