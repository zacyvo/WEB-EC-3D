import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios riêng (không dùng interceptor chung) — trang hợp đồng xác thực bằng
 * mã bảo mật hợp đồng, không phụ thuộc phiên đăng nhập của user.
 */
export const contractApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

export function errMsg(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : msg || fallback;
}

export async function downloadBlob(
  url: string,
  filename: string,
  headers: Record<string, string> | undefined,
) {
  const res = await contractApi.get(url, { headers, responseType: 'blob' });
  const blobUrl = window.URL.createObjectURL(res.data as Blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}
