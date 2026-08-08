import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios riêng (không dùng interceptor chung của lib/api.ts) — trang NFC xác thực
 * bằng SĐT + mật khẩu riêng của chủ thẻ, không phụ thuộc phiên đăng nhập User thường.
 */
export const nfcApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function errMsg(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : msg || fallback;
}
