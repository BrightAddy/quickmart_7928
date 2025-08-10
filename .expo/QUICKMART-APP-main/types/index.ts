export type UserRole = 'customer' | 'employee' | 'store_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  createdAt: number;
}

export interface Customer extends User {
  role: 'customer';
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export interface Employee extends User {
  role: 'employee';
  ghanaCardId: string;
  ghanaCardFrontImage?: string;
  ghanaCardBackImage?: string;
  vehicleInfo?: string;
  momoNumber: string;
  rating: number;
  earnings: number;
  nextOfKin: NextOfKin;
  verificationStatus: VerificationStatus;
  lastVerifiedAt?: number;
  verificationHistory?: VerificationRecord[];
}

export interface NextOfKin {
  name: string;
  relationship: string;
  phone: string;
  address?: string;
}

export interface VerificationRecord {
  timestamp: number;
  selfieImage: string;
  status: 'approved' | 'rejected';
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface VerificationStatus {
  isVerified: boolean;
  ghanaCardVerified: boolean;
  selfieVerified: boolean;
  documentationComplete: boolean;
}

export interface StoreOwner extends User {
  role: 'store_owner';
  businessName: string;
  businessAddress: string;
  momoNumber: string;
  storeId: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  details?: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'momo' | 'card';
  name: string;
  details: string;
  isDefault: boolean;
}

export interface Store {
  id: string;
  name: string;
  ownerId: string;
  address: string;
  latitude: number;
  longitude: number;
  logo: string;
  coverImage: string;
  categories: string[];
  rating: number;
  isOpen: boolean;
  openingHours: string;
  closingHours: string;
  distance?: number; // Calculated based on user location
  description?: string; // Added for store settings
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  barcode?: string;
  unit: string;
  quantity: number; // This is used instead of 'stock'
  verified?: boolean; // Added for product verification
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  storeId: string;
  storeName: string;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted' 
  | 'shopping' 
  | 'checkout_complete' 
  | 'in_delivery' 
  | 'delivered' 
  | 'delivered_by_shopper' // New status for shopper confirmation
  | 'confirmed_by_customer' // New status for customer confirmation
  | 'completed' // Final status when both have confirmed
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  employeeId?: string;
  storeId: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  address: Address;
  paymentMethod: PaymentMethod;
  createdAt: number;
  updatedAt: number;
  estimatedDeliveryTime?: number;
  notes?: string;
  shopperConfirmedAt?: number; // Timestamp when shopper confirmed delivery
  customerConfirmedAt?: number; // Timestamp when customer confirmed delivery
  deliveryPhoto?: string; // Optional photo proof of delivery
}

export interface Message {
  id: string;
  orderId: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: number;
}