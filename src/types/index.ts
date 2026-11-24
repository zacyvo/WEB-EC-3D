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
  /** Opted in to promotional messages (Zalo/email) — can be withdrawn on the profile page. */
  marketingOptIn?: boolean;
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

/** Price of one color/size combination. */
export interface ProductVariantPrice {
  color?: string;
  size?: string;
  sellingPrice: number;
  finalPrice: number;
  sku?: string;
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
  /** Per color/size prices (giá theo phân loại). Missing/empty = every option sells at finalPrice. */
  variants?: ProductVariantPrice[];
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
  /** Charged shipping fee — already net of shippingDiscount. */
  shippingFee?: number;
  /** Shipping fee waived by a free-shipping code. */
  shippingDiscount?: number;
  appliedCoupons?: AppliedCoupon[];
  /** First time the order was delivered — starts the 7-day return window. */
  deliveredAt?: string;
  returnRequest?: OrderReturnRequest;
  /** VAT added because the customer asked for a VAT e-invoice (0 otherwise). */
  vatAmount?: number;
  einvoiceRequest?: OrderEInvoiceRequest;
  /** Set when the order was synced from a marketplace (returns happen there). */
  externalRef?: { channel: string; code: string };
  /** COD / BANK_TRANSFER — absent on older orders (COD). */
  paymentMethod?: PaymentMethod;
  /** VietQR bank-transfer payment — only when paymentMethod = BANK_TRANSFER. */
  payment?: OrderPayment;
  /** Latest shop-proposed change of the order ("Điều chỉnh đơn hàng"). */
  adjustment?: OrderAdjustment;
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
}

/** Keep in sync with backend orders/schemas/order.schema.ts. */
export type PaymentMethod = 'COD' | 'BANK_TRANSFER';
export type PaymentStatus = 'PENDING_PAYMENT' | 'PAID' | 'REFUNDED';
/** The customer's own "Tôi đã chuyển khoản" claim — never proof of payment. */
export type PaymentVerificationStatus = 'NOT_REPORTED' | 'AWAITING_CONFIRMATION' | 'CONFIRMED';

/** Receiving account chosen at checkout — PERSONAL (default) or BUSINESS (Hộ kinh doanh). */
export type PaymentAccountType = 'PERSONAL' | 'BUSINESS';

export interface BankAccountInfo {
  bankBin: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  /** Absent on orders placed before the choice existed (they went to the Hộ kinh doanh account). */
  accountType?: PaymentAccountType;
}

/** GET /payments/bank-transfer/availability — no account details. */
export interface BankTransferAvailability {
  enabled: boolean;
  accountTypes: PaymentAccountType[];
  defaultAccountType: PaymentAccountType | null;
}

export interface OrderPayment {
  status: PaymentStatus;
  reference: string;
  amount: number;
  currency: string;
  bankAccount: BankAccountInfo;
  verificationStatus: PaymentVerificationStatus;
  customerReportedAt?: string;
  confirmedAt?: string;
}

/** GET /orders/:id/payment — what the payment section renders. */
export interface PaymentAccountQr extends BankAccountInfo {
  qrPayload: string | null;
  qrError?: string;
}

export interface PaymentInstructions {
  orderId: string;
  orderCode: string;
  orderStatus: OrderStatus;
  paymentMethod: 'BANK_TRANSFER';
  paymentStatus: PaymentStatus;
  verificationStatus: PaymentVerificationStatus;
  amount: number;
  currency: string;
  reference: string;
  /** Primary account (default tab; after "Tôi đã chuyển khoản", the one the customer chose). */
  bank: BankAccountInfo;
  /** One QR per receiving account (personal, Hộ kinh doanh), generated together — one tab each.
   * Absent from an older backend → only `bank` / `qrPayload`. */
  accounts?: PaymentAccountQr[];
  payable: boolean;
  /** VietQR payload to render; null when nothing is left to pay or it couldn't be built. */
  qrPayload: string | null;
  qrError?: string;
  customerReportedAt?: string;
  confirmedAt?: string;
  refundAmount?: number;
  refundedAt?: string;
  /** Only on POST /orders/:id/payment/report. */
  alreadyReported?: boolean;
}

export type EInvoiceRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'ISSUED';
export type EInvoiceBuyerType = 'INDIVIDUAL' | 'COMPANY';

/** Buyer details for a VAT e-invoice — what the customer submits. */
export interface EInvoiceRequestInput {
  buyerType: EInvoiceBuyerType;
  buyerName: string;
  companyName?: string;
  taxCode?: string;
  address: string;
  email: string;
  phone?: string;
}

export interface OrderEInvoiceRequest extends EInvoiceRequestInput {
  status: EInvoiceRequestStatus;
  vatRate: number;
  vatAmount: number;
  requestedAt: string;
  decidedAt?: string;
  rejectReason?: string;
  issuedAt?: string;
  invoiceUrl?: string;
  emailSentAt?: string;
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

/** free_shipping waives the shipping fee (whole fee, or up to maxDiscountAmount); `value` is unused. */
export type DiscountType = 'percentage' | 'fixed' | 'free_shipping';

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
  /** 'order' = off the goods; 'shipping' = free-shipping code. Older orders have none ('order'). */
  kind?: 'order' | 'shipping';
}

export interface RejectedCoupon {
  code: string;
  reason: string;
}

export interface ValidateCouponsResponse {
  appliedCoupons: AppliedCoupon[];
  rejectedCoupons: RejectedCoupon[];
  /** Discount on the goods only. */
  totalDiscount: number;
  /** Goods total after totalDiscount (shipping excluded). */
  finalTotal: number;
  /** Shipping fee waived by a free-shipping code. */
  shippingDiscount: number;
  /** Fee the free-shipping code was priced against (null: no address yet). */
  shippingFee: number | null;
}

/** Keep in sync with backend orders/schemas/order.schema.ts (OrderAdjustment). */
export interface OrderAdjustmentSnapshot {
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  shippingDiscount: number;
  total: number;
  customerNote?: string;
}

export interface OrderAdjustment {
  number: number;
  status: 'PROPOSED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
  reason: string;
  proposedAt: string;
  before: OrderAdjustmentSnapshot;
  after: OrderAdjustmentSnapshot;
  paidAmountAtProposal: number;
  /** after.total − paid: < 0 the shop refunds, > 0 the customer pays the rest; 0 when unpaid. */
  balance: number;
  respondedAt?: string;
  rejectReason?: string;
  settlement?: {
    type: 'REFUND' | 'EXTRA_PAYMENT';
    amount: number;
    status: 'PENDING' | 'AWAITING_CONFIRMATION' | 'COMPLETED';
    refundAccount?: { bankName: string; accountNumber: string; accountHolder: string };
    method?: 'COD' | 'BANK_TRANSFER';
    reference?: string;
    customerReportedAt?: string;
    completedAt?: string;
    transferRef?: string;
  };
}

/** GET /orders/:id/adjustment/payment — VietQR for the extra amount of an accepted adjustment. */
export interface AdjustmentPaymentInstructions {
  orderId: string;
  orderCode: string;
  adjustmentNumber: number;
  amount: number;
  reference: string;
  bank: BankAccountInfo;
  status: 'PENDING' | 'AWAITING_CONFIRMATION' | 'COMPLETED';
  payable: boolean;
  qrPayload: string | null;
  qrError?: string;
  customerReportedAt?: string;
  completedAt?: string;
}
