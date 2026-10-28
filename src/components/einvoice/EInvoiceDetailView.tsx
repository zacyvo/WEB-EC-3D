'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Alert, Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { formatCurrency, formatDate } from '@/lib/utils';

export type EInvoiceLocalStatus = 'ISSUED' | 'CANCELLED' | 'FAILED';
export type EInvoiceFileFormat = 'pdf' | 'xml';

export interface PublicEInvoiceItem {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
  vatAmount: number;
  amount: number;
}

/** Hoá đơn đã lọc dữ liệu nội bộ — trả về từ /einvoices/public/:token và /contracts/public/:token/einvoices */
export interface PublicEInvoice {
  invoiceNo?: string;
  pattern?: string;
  serial?: string;
  lookupCode?: string;
  issueDate?: string;
  arisingDate?: string;
  sellerName: string;
  sellerTaxCode?: string;
  buyerName: string;
  customerName: string;
  customerTaxCode?: string;
  customerAddress?: string;
  items: PublicEInvoiceItem[];
  totalBeforeTax: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod: string;
  currencyUnit: string;
  localStatus: EInvoiceLocalStatus;
  easyInvoiceStatus?: number;
  linkView?: string;
  cancelledAt?: string;
  cancelReason?: string;
  note?: string;
}

export const EASY_STATUS_LABEL: Record<number, string> = {
  [-1]: 'Hoá đơn trong dải chờ ký',
  0: 'Chưa có chữ ký số',
  1: 'Đã có chữ ký số',
  2: 'Đã khai báo thuế',
  3: 'Bị thay thế',
  4: 'Bị điều chỉnh',
  5: 'Bị huỷ',
  6: 'Đã duyệt',
};

export const EINVOICE_STATUS_META: Record<EInvoiceLocalStatus, { label: string; color: 'success' | 'error' | 'warning' }> = {
  ISSUED: { label: 'Đã phát hành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'error' },
  FAILED: { label: 'Lỗi phát hành', color: 'warning' },
};

/**
 * Tải file hoá đơn từ endpoint public. Dùng fetch (không dùng axios responseType blob)
 * để đọc được message lỗi JSON khi backend/EasyInvoice từ chối.
 */
export async function downloadEInvoiceFile(url: string, headers: Record<string, string>, filename: string) {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || 'Tải hoá đơn thất bại');
  }
  const blob = await res.blob();
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

/** Chi tiết 1 hoá đơn điện tử: trạng thái, người mua/bán, sản phẩm, tổng tiền, nút tải PDF/XML */
export default function EInvoiceDetailView({
  invoice,
  onDownload,
}: {
  invoice: PublicEInvoice;
  onDownload: (format: EInvoiceFileFormat) => Promise<void>;
}) {
  const [downloading, setDownloading] = useState<EInvoiceFileFormat | null>(null);

  const handleDownload = async (format: EInvoiceFileFormat) => {
    setDownloading(format);
    try {
      await onDownload(format);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Tải hoá đơn thất bại');
    } finally {
      setDownloading(null);
    }
  };

  return (
    <Stack spacing={3}>
      {invoice.pattern && (
        <Typography variant="body2" color="text.secondary">
          Mẫu số: {invoice.pattern} {invoice.serial ? `— Ký hiệu: ${invoice.serial}` : ''}
          {invoice.lookupCode ? ` — Mã tra cứu: ${invoice.lookupCode}` : ''}
        </Typography>
      )}

      {invoice.localStatus === 'CANCELLED' && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Hoá đơn này <b>đã bị huỷ</b>{invoice.cancelReason ? ` — lý do: ${invoice.cancelReason}` : ''}
          {invoice.cancelledAt ? ` (lúc ${formatDate(invoice.cancelledAt)})` : ''}. Theo quy định, hoá đơn đã
          ký số hợp lệ được thay thế bằng hoá đơn 0 đồng thay vì xoá bỏ hoàn toàn.
        </Alert>
      )}
      {invoice.easyInvoiceStatus !== undefined && EASY_STATUS_LABEL[invoice.easyInvoiceStatus] && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Trạng thái tại cơ quan thuế: <b>{EASY_STATUS_LABEL[invoice.easyInvoiceStatus]}</b>
        </Alert>
      )}

      {/* Thông tin người mua/bán */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Stack spacing={1.5}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">Người bán</Typography>
              <Typography sx={{ fontWeight: 600 }}>{invoice.sellerName}</Typography>
              {invoice.sellerTaxCode && (
                <Typography variant="body2" color="text.secondary">MST: {invoice.sellerTaxCode}</Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary">Người mua</Typography>
              <Typography sx={{ fontWeight: 600 }}>{invoice.customerName || invoice.buyerName}</Typography>
              {invoice.customerTaxCode && (
                <Typography variant="body2" color="text.secondary">MST: {invoice.customerTaxCode}</Typography>
              )}
              {invoice.customerAddress && (
                <Typography variant="body2" color="text.secondary">{invoice.customerAddress}</Typography>
              )}
            </Box>
          </Stack>
          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Ngày lập: {invoice.arisingDate ? formatDate(invoice.arisingDate) : '—'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Hình thức thanh toán: {invoice.paymentMethod}
            </Typography>
          </Stack>
        </Stack>
      </Paper>

      {/* Sản phẩm */}
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Sản phẩm / dịch vụ</Typography>
        <Stack divider={<Divider flexItem />} spacing={1.2}>
          {invoice.items.map((item, i) => (
            <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ width: 20 }}>{i + 1}.</Typography>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  SL {item.quantity} {item.unit} × {formatCurrency(item.unitPrice)}
                  {item.vatRate >= 0 ? ` · Thuế ${item.vatRate}%` : ''}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                {formatCurrency(item.amount)}
              </Typography>
            </Stack>
          ))}
          <Stack sx={{ pt: 0.5 }} spacing={0.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Tiền hàng</Typography>
              <Typography variant="body2">{formatCurrency(invoice.totalBeforeTax)}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">Thuế GTGT</Typography>
              <Typography variant="body2">{formatCurrency(invoice.vatAmount)}</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 700 }}>Tổng cộng</Typography>
              <Typography sx={{ fontWeight: 800, color: '#2563EB' }}>{formatCurrency(invoice.totalAmount)}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Tải hoá đơn */}
      <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          disabled={downloading !== null}
          onClick={() => handleDownload('pdf')}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
        >
          {downloading === 'pdf' ? 'Đang tải...' : 'Tải PDF'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadOutlinedIcon />}
          disabled={downloading !== null}
          onClick={() => handleDownload('xml')}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
        >
          {downloading === 'xml' ? 'Đang tải...' : 'Tải XML'}
        </Button>
      </Stack>
    </Stack>
  );
}
