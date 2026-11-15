import type { Coupon } from '@/types';

/** Coupon codes are stored upper-case and trimmed by the backend; match that before comparing. */
export function normalizeCouponCode(raw: string): string {
  return raw.trim().toUpperCase();
}

function shortVnd(amount: number): string {
  return amount >= 1000 && amount % 1000 === 0 ? `${amount / 1000}k` : `${amount.toLocaleString('vi-VN')}₫`;
}

/** "-10% · Giảm tối đa 50k" / "-30.000₫" / "Miễn phí vận chuyển · tối đa 15k" */
export function describeCoupon(c: Pick<Coupon, 'type' | 'value' | 'maxDiscountAmount'>): string {
  if (c.type === 'free_shipping') {
    return c.maxDiscountAmount > 0 ? `Miễn phí vận chuyển · tối đa ${shortVnd(c.maxDiscountAmount)}` : 'Miễn phí vận chuyển';
  }
  if (c.type === 'percentage') {
    return `-${c.value}%${c.maxDiscountAmount > 0 ? ` · Giảm tối đa ${shortVnd(c.maxDiscountAmount)}` : ''}`;
  }
  return `-${c.value.toLocaleString('vi-VN')}₫`;
}
