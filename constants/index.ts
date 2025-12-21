export interface UserProfile {
  id: string;
  appId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  sex: string;
  age: string;
  nationality: string;
  phone: string;
  email: string;
  city: string;
  country: string;
  address: string;
  occupation: string;
  addrCode: string;
  dobFull: string;
  nidNumber: string;
  nidType: string;
  nidExpirationDate: string;
  lang: string;
  appVersion: string;
  osVersion: string;
  secret_key: string;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: string;
  date: string;
  bankReference: string;
  status: string;
  currency: string;
}

export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string;
  imageUrl: string;
  rating: number;
}

export interface PaymentSuccessData {
  transactionId: string;
  debitAmount: string;
  debitCcy: string;
}

export interface StatusSuccess {
  transactionId: string;
  debitAmount: string | number;
  debitCcy: string;
  orderRef: string;
  transactionDate: string;
  remark: string;
  secretKey: string;
}
