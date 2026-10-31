import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; chipSx: Record<string, string> }> = {
  PENDING:    { label: 'Chờ xác nhận', color: 'text-yellow-600 bg-yellow-50', chipSx: { bgcolor: '#FEF9C3', color: '#92400E', borderColor: '#FDE68A', fontWeight: '600' } },
  CONFIRMED:  { label: 'Đã xác nhận',  color: 'text-blue-600 bg-blue-50',   chipSx: { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: '600' } },
  PROCESSING: { label: 'Đang xử lý',  color: 'text-purple-600 bg-purple-50', chipSx: { bgcolor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF', fontWeight: '600' } },
  SHIPPED:    { label: 'Đang giao',    color: 'text-indigo-600 bg-indigo-50', chipSx: { bgcolor: '#E0E7FF', color: '#4338CA', borderColor: '#C7D2FE', fontWeight: '600' } },
  DELIVERED:  { label: 'Đã giao',      color: 'text-green-600 bg-green-50',  chipSx: { bgcolor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  CANCELLED:  { label: 'Đã hủy',       color: 'text-red-600 bg-red-50',    chipSx: { bgcolor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', fontWeight: '600' } },
};

/** Keep in sync with backend ReturnStatus (orders/schemas/order.schema.ts). */
export const RETURN_STATUS_MAP: Record<string, { label: string; chipSx: Record<string, string> }> = {
  REQUESTED:     { label: 'Chờ shop duyệt',     chipSx: { bgcolor: '#FEF9C3', color: '#92400E', borderColor: '#FDE68A', fontWeight: '600' } },
  APPROVED:      { label: 'Chờ gửi hàng trả',   chipSx: { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: '600' } },
  SHIPPING_BACK: { label: 'Đang gửi trả',       chipSx: { bgcolor: '#E0E7FF', color: '#4338CA', borderColor: '#C7D2FE', fontWeight: '600' } },
  RECEIVED:      { label: 'Shop đang kiểm hàng', chipSx: { bgcolor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF', fontWeight: '600' } },
  REFUNDING:     { label: 'Đang hoàn tiền',     chipSx: { bgcolor: '#ECFDF5', color: '#047857', borderColor: '#A7F3D0', fontWeight: '600' } },
  COMPLETED:     { label: 'Trả hàng thành công', chipSx: { bgcolor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  REJECTED:      { label: 'Bị từ chối',         chipSx: { bgcolor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', fontWeight: '600' } },
  CANCELLED:     { label: 'Đã hủy yêu cầu',     chipSx: { bgcolor: '#F3F4F6', color: '#4B5563', borderColor: '#E5E7EB', fontWeight: '600' } },
};

export const RETURN_REASON_OPTIONS: { value: string; label: string; hint?: string }[] = [
  { value: 'DAMAGED', label: 'Hàng bị vỡ/hư hỏng khi vận chuyển' },
  { value: 'DEFECTIVE', label: 'Sản phẩm lỗi (không sáng, chập chờn...)' },
  { value: 'WRONG_ITEM', label: 'Giao sai sản phẩm/màu/size' },
  { value: 'MISSING_PARTS', label: 'Thiếu phụ kiện/sản phẩm' },
  { value: 'NOT_AS_DESCRIBED', label: 'Khác với mô tả' },
  { value: 'CHANGED_MIND', label: 'Đổi ý (không còn nhu cầu)', hint: 'Bạn chịu phí vận chuyển gửi trả; sản phẩm phải còn nguyên vẹn, đủ bao bì' },
];

export const RETURN_REASON_LABELS: Record<string, string> = Object.fromEntries(
  RETURN_REASON_OPTIONS.map((o) => [o.value, o.label]),
);

/** Same rule as the backend (order-return.constants.ts). */
export const RETURN_WINDOW_DAYS = 7;

export const CUSTOM_ORDER_STATUS_MAP: Record<string, { label: string; chipSx: Record<string, string> }> = {
  PENDING:    { label: 'Chờ xem xét',    chipSx: { bgcolor: '#FEF9C3', color: '#92400E', borderColor: '#FDE68A', fontWeight: '600' } },
  REVIEWING:  { label: 'Đang xem xét',   chipSx: { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: '600' } },
  QUOTED:     { label: 'Đã báo giá',     chipSx: { bgcolor: '#E0E7FF', color: '#4338CA', borderColor: '#C7D2FE', fontWeight: '600' } },
  ACCEPTED:   { label: 'Đã chấp nhận',   chipSx: { bgcolor: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  PROCESSING: { label: 'Đang sản xuất',  chipSx: { bgcolor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF', fontWeight: '600' } },
  COMPLETED:  { label: 'Hoàn thành',     chipSx: { bgcolor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  CANCELLED:  { label: 'Đã hủy',         chipSx: { bgcolor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', fontWeight: '600' } },
};
