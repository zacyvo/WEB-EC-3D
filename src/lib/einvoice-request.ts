import type { EInvoiceRequestInput, EInvoiceRequestStatus } from '@/types';

/** Statuses in which the customer can ask for an invoice — any order that isn't cancelled (must
 * match backend/src/orders/einvoice-request.util.ts). */
export const EINVOICE_REQUESTABLE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export const EINVOICE_NOTE =
  'Shop sẽ xử lý yêu cầu và gửi hóa đơn điện tử tới email của bạn sau khi đơn hàng được thanh toán.';

export const EINVOICE_STATUS_MAP: Record<EInvoiceRequestStatus, { label: string; color: 'warning' | 'info' | 'error' | 'success' }> = {
  PENDING: { label: 'Chờ shop xác nhận', color: 'warning' },
  APPROVED: { label: 'Đã chấp nhận', color: 'info' },
  REJECTED: { label: 'Bị từ chối', color: 'error' },
  ISSUED: { label: 'Đã xuất hoá đơn', color: 'success' },
};

export const EMPTY_EINVOICE_REQUEST: EInvoiceRequestInput = {
  buyerType: 'INDIVIDUAL',
  buyerName: '',
  companyName: '',
  taxCode: '',
  address: '',
  email: '',
};

const COMPANY_TAX_CODE = /^\d{10}(-\d{3})?$/;
const PERSONAL_TAX_CODE = /^(\d{10}|\d{12})$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type EInvoiceRequestErrors = Partial<Record<keyof EInvoiceRequestInput, string>>;

/** Same rules as the backend DTO — empty object means valid. */
export function validateEInvoiceRequest(v: EInvoiceRequestInput): EInvoiceRequestErrors {
  const errors: EInvoiceRequestErrors = {};
  const isCompany = v.buyerType === 'COMPANY';
  const taxCode = v.taxCode?.trim() ?? '';
  if (!v.buyerName.trim()) errors.buyerName = 'Vui lòng nhập họ tên người mua hàng';
  if (isCompany && !v.companyName?.trim()) errors.companyName = 'Vui lòng nhập tên công ty/đơn vị';
  if (isCompany && !COMPANY_TAX_CODE.test(taxCode)) {
    errors.taxCode = 'Mã số thuế công ty không hợp lệ (10 số, chi nhánh: 10 số-3 số)';
  }
  if (!isCompany && taxCode && !PERSONAL_TAX_CODE.test(taxCode)) errors.taxCode = 'Mã số thuế/CCCD không hợp lệ (10 hoặc 12 số)';
  if (!v.address.trim()) errors.address = 'Vui lòng nhập địa chỉ xuất hoá đơn';
  if (!EMAIL.test(v.email.trim())) errors.email = 'Email nhận hoá đơn không hợp lệ';
  return errors;
}

/** Payload for the API — trimmed, without fields that don't apply to the buyer type. */
export function toEInvoiceRequestPayload(v: EInvoiceRequestInput): EInvoiceRequestInput {
  const isCompany = v.buyerType === 'COMPANY';
  return {
    buyerType: v.buyerType,
    buyerName: v.buyerName.trim(),
    ...(isCompany ? { companyName: v.companyName?.trim() } : {}),
    ...(v.taxCode?.trim() ? { taxCode: v.taxCode.trim() } : {}),
    address: v.address.trim(),
    email: v.email.trim(),
    ...(v.phone?.trim() ? { phone: v.phone.trim() } : {}),
  };
}
