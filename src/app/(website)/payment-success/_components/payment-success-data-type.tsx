export interface BillingAddress {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
  companyName: string;
}

export interface Tournament {
  billingAddress: BillingAddress;
  _id: string;
  orderId: string;
  tournamentName: string;
  sportName: string;
  drawFormat: string;
  format: string;
  drawSize: number;
  price: string;
  paymentStatus: string;
  numberOfSeeds: number;
  status: string;
  rules: string[];
  totalParticipants: number;
  registeredPlayers: string; // you can replace `any` with a proper type if known
  totalRounds: number;
  rememberEmail: number;
  knockoutStage: string | null; // null or a specific type if known
  createdBy: string;
  entryConditions: string[];
  range: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  paymentMethod: string;
}

export interface PaymentData {
  _id: string;
  tournamentId: Tournament;
  amount: string;
  cardNumber: string;
  cardName: string;
  transactionId: string;
  stripePaymentIntentId: string;
  stripeSessionId: string;
  status: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaymentSuccessApiResponse {
  success: boolean;
  data: PaymentData;
}
