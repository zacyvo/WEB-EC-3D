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

export const CUSTOM_ORDER_STATUS_MAP: Record<string, { label: string; chipSx: Record<string, string> }> = {
  PENDING:    { label: 'Chờ xem xét',    chipSx: { bgcolor: '#FEF9C3', color: '#92400E', borderColor: '#FDE68A', fontWeight: '600' } },
  REVIEWING:  { label: 'Đang xem xét',   chipSx: { bgcolor: '#DBEAFE', color: '#1D4ED8', borderColor: '#BFDBFE', fontWeight: '600' } },
  QUOTED:     { label: 'Đã báo giá',     chipSx: { bgcolor: '#E0E7FF', color: '#4338CA', borderColor: '#C7D2FE', fontWeight: '600' } },
  ACCEPTED:   { label: 'Đã chấp nhận',   chipSx: { bgcolor: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  PROCESSING: { label: 'Đang sản xuất',  chipSx: { bgcolor: '#F3E8FF', color: '#7E22CE', borderColor: '#E9D5FF', fontWeight: '600' } },
  COMPLETED:  { label: 'Hoàn thành',     chipSx: { bgcolor: '#D1FAE5', color: '#065F46', borderColor: '#A7F3D0', fontWeight: '600' } },
  CANCELLED:  { label: 'Đã hủy',         chipSx: { bgcolor: '#FEE2E2', color: '#991B1B', borderColor: '#FECACA', fontWeight: '600' } },
};
