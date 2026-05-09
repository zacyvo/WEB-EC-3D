export type UserRole = 'user';

export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  provider: string;
  addresses: Address[];
  isBlocked?: boolean;
  dob?: string;
  createdAt: string;
}

export interface Address {
  street: string;
  ward: string;
  district: string;
  city: string;
  isDefault: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  category: Category | string;
  sellingPrice: number;
  discountPercent: number;
  finalPrice: number;
  stock: number;
  eta?: string;
  description?: string;
  shortDescription?: string;
  isActive: boolean;
  viewCount: number;
  orderCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  slug: string;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingInfo {
  recipientName: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  total: number;
  paidAmount?: number;
  status: OrderStatus;
  customerNote?: string;
  csNote?: string;
  cancelReason?: string;
  delivery?: {
    carrierName?: string;
    trackingCode?: string;
    trackingUrl?: string;
    estimatedDeliveryDate?: string;
  };
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export type CustomOrderStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'QUOTED'
  | 'ACCEPTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'CANCELLED';

export interface CustomOrder {
  _id: string;
  userId: string;
  content: string;
  images: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: CustomOrderStatus;
  adminNote?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Promotions ────────────────────────────────────────────────────────────────

export type DiscountType = 'percentage' | 'fixed';

export interface Coupon {
  _id: string;
  code: string;
  programId: string;
  programName: string;
  description?: string;
  type: DiscountType;
  value: number;
  minOrderValue: number;
  maxDiscountAmount: number;
  perUserUsageLimit: number;
  startDate: string;
  endDate: string;
}

export interface AppliedCoupon {
  code: string;
  name: string;
  discountAmount: number;
}

export interface ValidateCouponsResponse {
  appliedCoupons: AppliedCoupon[];
  totalDiscount: number;
  finalTotal: number;
}
