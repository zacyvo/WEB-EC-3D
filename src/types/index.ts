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

export interface ProductColor {
  name: string;
  hexCode?: string;
  /** Images shown when this color is selected. Empty = falls back to the product's default images. */
  images: string[];
}

export type SocialPlatform = 'SHOPEE' | 'THREADS' | 'FACEBOOK' | 'TIKTOK' | 'OTHER';

export interface ProductSocial {
  name: SocialPlatform;
  id?: string;
  link?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  /** Optional product video URL (e.g. synced from Shopee). */
  video?: string;
  /** Selectable color variants. Empty = product has no color options. */
  colors: ProductColor[];
  /** Selectable size labels. Empty = product has no size options. */
  sizes: string[];
  /** Linked social/marketplace channels for this product. */
  socials: ProductSocial[];
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
  color?: string;
  size?: string;
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
  color?: string;
  size?: string;
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
  /** Set once the customer asked the shop to cancel a processing order. */
  cancelRequest?: {
    requestedAt: string;
    reason?: string;
  };
  delivery?: {
    carrierName?: string;
    trackingCode?: string;
    trackingUrl?: string;
    estimatedDeliveryDate?: string;
  };
  subtotal?: number;
  discountAmount?: number;
  shippingFee?: number;
  /** First time the order was delivered — starts the 7-day return window. */
  deliveredAt?: string;
  returnRequest?: OrderReturnRequest;
  /** Set when the order was synced from a marketplace (returns happen there). */
  externalRef?: { channel: string; code: string };
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

export type ReturnStatus =
  | 'REQUESTED'
  | 'APPROVED'
  | 'SHIPPING_BACK'
  | 'RECEIVED'
  | 'REFUNDING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'CANCELLED';

export type ReturnReason =
  | 'DAMAGED'
  | 'DEFECTIVE'
  | 'WRONG_ITEM'
  | 'MISSING_PARTS'
  | 'NOT_AS_DESCRIBED'
  | 'CHANGED_MIND';

export interface OrderReturnRequest {
  status: ReturnStatus;
  items: {
    itemIndex: number;
    productName: string;
    productImage?: string;
    color?: string;
    size?: string;
    quantity: number;
    unitPrice: number;
  }[];
  reason: ReturnReason;
  description: string;
  images: string[];
  refundAccount?: { bankName: string; accountNumber: string; accountHolder: string };
  requestedAt: string;
  estimatedRefund: number;
  shopNote?: string;
  rejectReason?: string;
  rejectedAt?: 'REQUEST' | 'INSPECTION';
  shipment?: { carrierName?: string; trackingCode: string; shippedAt: string };
  receivedAt?: string;
  inspectionNote?: string;
  refundAmount?: number;
  returnShippingRefund?: number;
  refundedAt?: string;
  refundTransferRef?: string;
  history: { status: ReturnStatus; at: string; byType: 'user' | 'staff'; note?: string }[];
}

export interface ReturnEligibility {
  eligible: boolean;
  reason?: string;
  deliveredAt?: string;
  deadline?: string;
  requiresRefundAccount: boolean;
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
