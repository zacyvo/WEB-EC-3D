export const MAINTENANCE_COOKIE_NAME = 'lg_mnt_bypass';
export const MAINTENANCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

export function isMaintenanceModeOn(): boolean {
  return process.env.MAINTENANCE_MODE === 'true';
}

/**
 * Token = SHA-256(ID:PW) tính từ env server-side, dùng làm giá trị cookie bypass.
 * Không lưu ID/PW trực tiếp vào cookie và không so sánh chuỗi tĩnh, tránh việc
 * client tự set cookie giả mạo nếu không biết ID/PW thật trong .env.
 */
export async function getMaintenanceBypassToken(): Promise<string | null> {
  const id = process.env.MAINTENANCE_BYPASS_ID;
  const pw = process.env.MAINTENANCE_BYPASS_PW;
  if (!id || !pw) return null;

  const data = new TextEncoder().encode(`${id}:${pw}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyMaintenanceCredentials(id: string, pw: string): Promise<boolean> {
  const expectedId = process.env.MAINTENANCE_BYPASS_ID;
  const expectedPw = process.env.MAINTENANCE_BYPASS_PW;
  if (!expectedId || !expectedPw) return false;
  return id === expectedId && pw === expectedPw;
}
