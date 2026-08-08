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
  const data = (err as { response?: { data?: { message?: string; errors?: string[] } } })?.response?.data;
  if (!data) return fallback;
  // Lỗi validate (class-validator): BE trả message="Validation failed" chung chung kèm
  // mảng errors chứa lý do cụ thể — ưu tiên hiển thị lý do cụ thể đó thay vì câu chung chung.
  if (Array.isArray(data.errors) && data.errors.length > 0) return data.errors[0];
  return data.message || fallback;
}
