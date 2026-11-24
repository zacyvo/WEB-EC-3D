import axios from 'axios';
import type { OrderStatus } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios riêng (không dùng interceptor chung) cho "Link xem đơn" / "Tra cứu đơn hàng" / mua không
 * cần đăng nhập — xác thực bằng SĐT + mã bảo mật (hoặc địa chỉ) của đơn, không phụ thuộc phiên
 * đăng nhập (interceptor chung sẽ chuyển sang trang đăng nhập khi gặp 401).
 */
export const orderApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function orderAccessHeaders(jwt: string) {
  return { headers: { 'X-Order-Access': jwt } };
}

export function errMsg(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : msg || fallback;
}

// ─── Phiên xem đơn (theo tab) ──────────────────────────────────────────────────

const sessionKey = (token: string) => `order-access:${token}`;

export function saveOrderSession(token: string, jwt: string): void {
  try { sessionStorage.setItem(sessionKey(token), jwt); } catch { /* storage unavailable */ }
}

export function loadOrderSession(token: string): string | null {
  try { return sessionStorage.getItem(sessionKey(token)); } catch { return null; }
}

export function clearOrderSession(token: string): void {
  try { sessionStorage.removeItem(sessionKey(token)); } catch { /* storage unavailable */ }
}

// ─── Đơn đã đặt trên thiết bị này (không lưu mã bảo mật) ─────────────────────────

export interface DeviceOrder {
  token: string;
  orderCode: string;
  total: number;
  createdAt: string;
}

const DEVICE_ORDERS_KEY = 'guest-orders';
const DEVICE_ORDERS_MAX = 20;

export function loadDeviceOrders(): DeviceOrder[] {
  try {
    const raw = JSON.parse(localStorage.getItem(DEVICE_ORDERS_KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((o) => o && typeof o.token === 'string') : [];
  } catch {
    return [];
  }
}

export function rememberDeviceOrder(order: DeviceOrder): void {
  try {
    const rest = loadDeviceOrders().filter((o) => o.token !== order.token);
    localStorage.setItem(DEVICE_ORDERS_KEY, JSON.stringify([order, ...rest].slice(0, DEVICE_ORDERS_MAX)));
  } catch { /* storage unavailable */ }
}

export function forgetDeviceOrder(token: string): void {
  try {
    localStorage.setItem(DEVICE_ORDERS_KEY, JSON.stringify(loadDeviceOrders().filter((o) => o.token !== token)));
  } catch { /* storage unavailable */ }
}

/** Đường dẫn trong site của "Link xem đơn" (publicUrl đầy đủ do backend trả về). */
export function orderLinkPath(token: string): string {
  return `/order/${token}`;
}

/** Mirrors backend LookedUpOrder (orders/order-public-access.service.ts). */
export interface LookedUpOrder {
  token: string;
  accessJwt: string;
  orderCode: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  firstItemName: string;
  createdAt: string;
}

/** Response of POST /orders/guest-checkout. */
export interface GuestCheckoutResult {
  order: { orderCode: string; total: number; paymentMethod: 'COD' | 'BANK_TRANSFER'; createdAt: string };
  publicAccess: { token: string; publicUrl: string; securityCode: string; phone: string; accessJwt: string };
}
