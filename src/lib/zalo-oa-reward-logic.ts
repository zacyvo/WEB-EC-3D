/**
 * Pure (framework-free) logic of the Zalo OA reward modal. Kept free of imports and of
 * non-erasable TS syntax so `node --test scripts/zalo-oa-reward-logic.test.mjs` can run it
 * directly. The backend is authoritative: these helpers only map its state to UI.
 */

export type RewardState =
  | 'ELIGIBLE'
  | 'AWAITING_ZALO'
  | 'IDENTITY_PENDING'
  | 'FOLLOW_PENDING'
  | 'LINKED'
  | 'REWARD_PROCESSING'
  | 'REWARD_ASSIGNED'
  | 'ALREADY_CLAIMED'
  | 'NOT_ELIGIBLE'
  | 'UNSUPPORTED_LINKING'
  | 'EXPIRED'
  | 'ERROR';

export interface RewardStatus {
  enabled: boolean;
  state: RewardState;
  reason?: string;
  errorCode?: string;
  offer?: { discountPercent: number; minOrderValue: number; maxDiscountAmount: number; endDate: string };
  oa?: { name: string; url: string };
  linkMode?: 'social_login' | 'mini_app';
  linkExpiresAt?: string;
  couponCode?: string;
  recipient?: { isOrderAccount: boolean; phoneMasked?: string };
  hasRewardPhone?: boolean;
}

export type RewardPhase =
  | 'offer'
  | 'connecting'
  | 'confirming'
  | 'success'
  | 'claimed'
  | 'expired'
  | 'unsupported'
  | 'ineligible'
  | 'error';

/** First-time flow only: an account that already has the reward (or no offer) sees nothing. */
export function shouldOpenModal(status: RewardStatus | null | undefined): boolean {
  if (!status || !status.enabled) return false;
  return ['ELIGIBLE', 'AWAITING_ZALO', 'IDENTITY_PENDING', 'FOLLOW_PENDING', 'LINKED', 'REWARD_PROCESSING', 'EXPIRED'].includes(status.state);
}

/** `opened` = the customer pressed the Zalo button in this tab (backend still AWAITING_ZALO
 * until Zalo actually loads the link). */
export function phaseOf(state: RewardState, opened: boolean): RewardPhase {
  switch (state) {
    case 'ELIGIBLE':
      return 'offer';
    case 'AWAITING_ZALO':
      return opened ? 'connecting' : 'offer';
    case 'IDENTITY_PENDING':
      return 'connecting';
    case 'FOLLOW_PENDING':
    case 'LINKED':
    case 'REWARD_PROCESSING':
      return 'confirming';
    case 'REWARD_ASSIGNED':
      return 'success';
    case 'ALREADY_CLAIMED':
      return 'claimed';
    case 'EXPIRED':
      return 'expired';
    case 'UNSUPPORTED_LINKING':
      return 'unsupported';
    case 'NOT_ELIGIBLE':
      return 'ineligible';
    default:
      return 'error';
  }
}

/** Poll while an external Zalo interaction can still move the state (a desktop QR can be
 * scanned without any click here, so AWAITING_ZALO is polled too). */
export function shouldPoll(state: RewardState | undefined): boolean {
  return !!state && ['AWAITING_ZALO', 'IDENTITY_PENDING', 'FOLLOW_PENDING', 'LINKED', 'REWARD_PROCESSING'].includes(state);
}

export const POLL_INTERVAL_MS = 3000;
export const POLL_HIDDEN_INTERVAL_MS = 10000;
/** Give up polling after this long (the backend keeps its own state; reopening resumes). */
export const POLL_MAX_DURATION_MS = 20 * 60_000;

/** Accepts the formats the backend accepts; anything else is flagged before sending.
 * Format check only — there is no ownership verification (by design, no OTP). */
export function isPlausibleVnPhone(raw: string): boolean {
  const s = raw.trim();
  if (!s) return true; // optional
  const digits = s.replace(/[\s.\-()]/g, '');
  return /^(0|\+?84)(3[2-9]|5[25689]|7[06-9]|8[0-9]|9[0-9])\d{7}$/.test(digits);
}

export interface ConfettiPiece {
  id: number;
  x: number; // vw offset from center, -50..50
  y: number; // vh fall distance
  rotate: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  round: boolean;
}

export const CONFETTI_COLORS = ['#F7B6CB', '#F48FB1', '#FFFFFF', '#E8C77A', '#D4AF37', '#FADADD'];

/** Deterministic for a given seed (stable across re-renders, testable). */
export function makeConfetti(count: number, seed = 1): ConfettiPiece[] {
  let s = seed >>> 0 || 1;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0x100000000;
  };
  return Array.from({ length: Math.max(0, Math.floor(count)) }, (_, id) => ({
    id,
    x: (rnd() - 0.5) * 100,
    y: 60 + rnd() * 50,
    rotate: (rnd() - 0.5) * 720,
    delay: rnd() * 0.25,
    duration: 1.6 + rnd() * 1.2,
    size: 6 + rnd() * 7,
    color: CONFETTI_COLORS[Math.floor(rnd() * CONFETTI_COLORS.length)],
    round: rnd() > 0.6,
  }));
}

/** How long a confetti burst lives before it must be removed from the DOM. */
export function confettiLifetimeMs(pieces: ConfettiPiece[]): number {
  return Math.ceil(Math.max(0, ...pieces.map((p) => (p.delay + p.duration) * 1000))) + 100;
}

export function formatVnd(n: number): string {
  return `${new Intl.NumberFormat('vi-VN').format(Math.round(n))}đ`;
}

export function formatDateVi(iso: string | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Asia/Ho_Chi_Minh' });
}

/** Human-readable conditions from the DB offer (never hard-coded numbers). */
export function offerConditions(offer: RewardStatus['offer']): string[] {
  if (!offer) return [];
  const out: string[] = [];
  if (offer.minOrderValue > 0) out.push(`Áp dụng cho đơn từ ${formatVnd(offer.minOrderValue)}`);
  if (offer.maxDiscountAmount > 0) out.push(`Giảm tối đa ${formatVnd(offer.maxDiscountAmount)}`);
  const end = formatDateVi(offer.endDate);
  if (end) out.push(`Hạn sử dụng đến ${end}`);
  out.push('Mỗi tài khoản dùng 1 lần, áp dụng cho lần mua tiếp theo');
  return out;
}

const RESULT_MESSAGES: Record<string, { title: string; body: string; tone: 'ok' | 'info' | 'warn' }> = {
  done: { title: 'Đã nhận ưu đãi!', body: 'Mã giảm giá 20% đã được gán cho tài khoản của bạn. Quay lại trang Luxe Glow để xem và sao chép mã.', tone: 'ok' },
  claimed: { title: 'Ưu đãi đã được nhận trước đó', body: 'Tài khoản Zalo này đã nhận ưu đãi chào mừng của Luxe Glow.', tone: 'info' },
  processing: { title: 'Đang xác nhận ưu đãi…', body: 'Bạn có thể quay lại trang Luxe Glow, ưu đãi sẽ hiển thị khi xác nhận xong.', tone: 'info' },
  denied: { title: 'Chưa kết nối Zalo', body: 'Bạn đã từ chối cấp quyền. Bạn có thể quay lại trang Luxe Glow và thử lại bất cứ lúc nào.', tone: 'warn' },
  expired: { title: 'Liên kết đã hết hạn', body: 'Vui lòng quay lại trang Luxe Glow để tạo mã QR mới.', tone: 'warn' },
  invalid: { title: 'Liên kết không hợp lệ', body: 'Liên kết này đã được thay thế hoặc không còn hiệu lực. Vui lòng dùng mã QR mới nhất trên trang Luxe Glow.', tone: 'warn' },
  ineligible: { title: 'Không đủ điều kiện', body: 'Đơn hàng này hiện không đủ điều kiện nhận ưu đãi Zalo OA.', tone: 'warn' },
  unsupported: { title: 'Chưa thể tự động xác nhận', body: 'Hệ thống chưa nhận được xác nhận quan tâm OA từ Zalo. Nếu bạn đã quan tâm Luxe Glow từ trước, ưu đãi chào mừng không thể tự động xác nhận — vui lòng liên hệ CSKH.', tone: 'warn' },
  conflict: { title: 'Đã liên kết tài khoản Zalo khác', body: 'Phiên nhận quà này đã được liên kết với một tài khoản Zalo khác.', tone: 'warn' },
  unavailable: { title: 'Chương trình chưa sẵn sàng', body: 'Ưu đãi Zalo OA hiện chưa được kích hoạt.', tone: 'warn' },
  error: { title: 'Có lỗi xảy ra', body: 'Không thể kết nối Zalo lúc này. Vui lòng quay lại trang Luxe Glow và thử lại.', tone: 'warn' },
};

export function resultMessage(result: string | null | undefined) {
  return RESULT_MESSAGES[result ?? ''] ?? RESULT_MESSAGES.error;
}
