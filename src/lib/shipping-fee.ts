/** Flat shipping fee until a carrier integration quotes real rates — mirrors
 * backend/src/orders/shipping-fee.util.ts (the backend is authoritative; this is the preview). */
export const SHIPPING_FEE_HCM = 22_000;
export const SHIPPING_FEE_OTHER = 27_000;

/** True for TP. Hồ Chí Minh in any common spelling (post-2025-merger boundary). */
export function isHoChiMinhCity(city?: string | null): boolean {
  const normalized = (city ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
  return /hochiminh|hcm|saigon/.test(normalized);
}

export function computeShippingFee(city?: string | null): number {
  return isHoChiMinhCity(city) ? SHIPPING_FEE_HCM : SHIPPING_FEE_OTHER;
}
