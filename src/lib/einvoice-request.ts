import type { EInvoiceRequestInput, EInvoiceRequestStatus } from '@/types';

/** Must match backend/src/orders/einvoice-request.util.ts (EINVOICE_VAT_RATE). */
export const EINVOICE_VAT_RATE = 10;

/** Statuses in which the customer can still ask for an invoice (before the parcel ships). */
export const EINVOICE_REQUESTABLE_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING'];

export const EINVOICE_NOTE =
  'Bạn phải trả thêm 10% VAT cho đơn hàng xuất hóa đơn điện tử. Sau khi thanh toán, email bạn sẽ nhận được hóa đơn điện tử.';

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

/** VAT preview — same split as the backend (discount prorated over lines, VAT rounded per line,
 * shipping fee as its own line), so the amount shown is the amount charged. */
export function estimateVat(items: { unitPrice: number; quantity: number }[], discountAmount = 0, shippingFee = 0): number {
  const subtotals = items.map((i) => i.unitPrice * i.quantity);
  const subtotal = subtotals.reduce((s, v) => s + v, 0);
  const discount = Math.min(Math.max(0, discountAmount), subtotal);
  let left = discount;
  const goodsVat = subtotals.reduce((vat, lineSubtotal, idx) => {
    const share = idx === subtotals.length - 1 ? left : subtotal > 0 ? Math.round((discount * lineSubtotal) / subtotal) : 0;
    const lineDiscount = Math.min(share, lineSubtotal, left);
    left -= lineDiscount;
    return vat + Math.round(((lineSubtotal - lineDiscount) * EINVOICE_VAT_RATE) / 100);
  }, 0);
  return goodsVat + Math.round((Math.max(0, shippingFee) * EINVOICE_VAT_RATE) / 100);
}

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
