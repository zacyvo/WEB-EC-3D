'use client';

import { useState, type ReactNode } from 'react';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Divider, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import { formatDate } from '@/lib/utils';
import PdfDocumentViewer from '@/components/pdf/PdfDocumentViewer';

export type EInvoiceLocalStatus = 'DRAFT' | 'ISSUED' | 'CANCELLED' | 'FAILED';
export type EInvoiceFileFormat = 'pdf' | 'xml';

export interface PublicEInvoiceItem {
  code?: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountPercent?: number;
  discountAmount?: number;
  /** -1 KCT | -2 KKKNT | -3 Khác (kèm vatRateOther) */
  vatRate: number;
  vatRateOther?: number;
  /** 1 Hàng hoá dịch vụ, 2 Khuyến mại, 3 Chiết khấu, 4 Ghi chú, 5 Hàng hoá đặc trưng */
  feature?: number;
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
  sellerAddress?: string;
  buyerName: string;
  customerName: string;
  customerTaxCode?: string;
  customerAddress?: string;
  items: PublicEInvoiceItem[];
  totalBeforeTax: number;
  vatAmount: number;
  totalAmount: number;
  amountInWords?: string;
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
  DRAFT: { label: 'Bản nháp', color: 'warning' },
  ISSUED: { label: 'Đã phát hành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'error' },
  FAILED: { label: 'Lỗi phát hành', color: 'warning' },
};

/** Ngày lập hoá đơn — chỉ ngày (hoá đơn không in giờ), dd/MM/yyyy */
export function formatInvoiceDate(date?: string): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date));
}

/** Tiêu đề hoá đơn theo ký tự đầu của ký hiệu mẫu số (TT78): 1 = GTGT, 2 = bán hàng */
function invoiceTitle(pattern?: string): string {
  if (pattern?.startsWith('1')) return 'Hoá đơn giá trị gia tăng';
  if (pattern?.startsWith('2')) return 'Hoá đơn bán hàng';
  return 'Hoá đơn điện tử';
}

function invoiceDayLine(date?: string): string {
  if (!date) return '';
  const d = new Date(date);
  return `Ngày ${String(d.getDate()).padStart(2, '0')} tháng ${String(d.getMonth() + 1).padStart(2, '0')} năm ${d.getFullYear()}`;
}

/** Số tiền như trên hoá đơn: phân cách hàng nghìn, không kèm ký hiệu tiền tệ */
const formatNumber = (n?: number) => (n === undefined || n === null ? '' : new Intl.NumberFormat('vi-VN').format(n));

function vatRateLabel(item: Pick<PublicEInvoiceItem, 'vatRate' | 'vatRateOther'>): string {
  if (item.vatRate === -1) return 'KCT';
  if (item.vatRate === -2) return 'KKKNT';
  if (item.vatRate === -3) return item.vatRateOther !== undefined ? `${item.vatRateOther}%` : 'Khác';
  return `${item.vatRate}%`;
}

const FEATURE_SUFFIX: Record<number, string> = { 2: ' (Khuyến mại)', 3: ' (Chiết khấu thương mại)' };

/**
 * Lấy file hoá đơn (PDF/XML) từ endpoint public. Dùng fetch (không dùng axios responseType blob)
 * để đọc được message lỗi JSON khi backend/EasyInvoice từ chối.
 */
export async function fetchEInvoiceFile(url: string, headers: Record<string, string>): Promise<Blob> {
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const errJson = await res.json().catch(() => null);
    throw new Error(errJson?.message || 'Tải hoá đơn thất bại');
  }
  return res.blob();
}

export async function downloadEInvoiceFile(url: string, headers: Record<string, string>, filename: string) {
  const blob = await fetchEInvoiceFile(url, headers);
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(blobUrl);
}

function InfoLine({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Typography variant="body2" sx={{ display: 'flex', gap: 1 }}>
      <Box component="span" sx={{ color: 'text.secondary', flexShrink: 0, minWidth: { sm: 170 } }}>{label}:</Box>
      <Box component="span" sx={{ fontWeight: 500, wordBreak: 'break-word' }}>{children}</Box>
    </Typography>
  );
}

const headCellSx = { fontWeight: 700, fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap', px: 1, py: 1 } as const;
const cellSx = { fontSize: 13, px: 1, py: 1 } as const;
const numCellSx = { ...cellSx, textAlign: 'right', whiteSpace: 'nowrap' } as const;

/** Nội dung hoá đơn (cùng nguồn XmlData gửi EasyInvoice) — dự phòng khi không tải được file PDF */
function InvoiceInfoSheet({ invoice }: { invoice: PublicEInvoice }) {
  const hasDiscount = invoice.items.some((i) => (i.discountAmount ?? 0) > 0);
  const rates = new Set(invoice.items.filter((i) => i.feature !== 4).map((i) => vatRateLabel(i)));
  const uniformRate = rates.size === 1 ? [...rates][0] : undefined;
  const isDraft = invoice.localStatus === 'DRAFT';

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, md: 3.5 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
      <Stack spacing={2.5}>
        {/* Tiêu đề + ký hiệu, số */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}>
          <Box sx={{ textAlign: { xs: 'left', md: 'center' }, flex: 1 }}>
            <Typography sx={{ fontWeight: 800, fontSize: { xs: 18, md: 22 }, textTransform: 'uppercase', color: '#1E3A8A', letterSpacing: 0.5 }}>
              {invoiceTitle(invoice.pattern)}
            </Typography>
            {isDraft && (
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.dark' }}>(BẢN NHÁP)</Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 0.5 }}>
              {invoiceDayLine(invoice.arisingDate)}
            </Typography>
          </Box>
          <Stack spacing={0.5} sx={{ minWidth: { md: 200 } }}>
            {invoice.pattern && <InfoLine label="Ký hiệu">{invoice.pattern}{invoice.serial}</InfoLine>}
            <InfoLine label="Số">
              {invoice.invoiceNo
                ? <Box component="span" sx={{ color: 'error.main', fontWeight: 700 }}>{invoice.invoiceNo}</Box>
                : <Box component="span" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>(chưa cấp số)</Box>}
            </InfoLine>
            {invoice.lookupCode && <InfoLine label="Mã tra cứu">{invoice.lookupCode}</InfoLine>}
          </Stack>
        </Stack>

        <Divider />

        {/* Người bán */}
        <Stack spacing={0.75}>
          <InfoLine label="Đơn vị bán hàng"><b>{invoice.sellerName}</b></InfoLine>
          <InfoLine label="Mã số thuế">{invoice.sellerTaxCode}</InfoLine>
          <InfoLine label="Địa chỉ">{invoice.sellerAddress}</InfoLine>
        </Stack>

        <Divider />

        {/* Người mua */}
        <Stack spacing={0.75}>
          <InfoLine label="Họ tên người mua hàng">{invoice.buyerName}</InfoLine>
          <InfoLine label="Tên đơn vị">{invoice.customerName}</InfoLine>
          <InfoLine label="Mã số thuế">{invoice.customerTaxCode}</InfoLine>
          <InfoLine label="Địa chỉ">{invoice.customerAddress}</InfoLine>
          <InfoLine label="Hình thức thanh toán">{invoice.paymentMethod}</InfoLine>
          <InfoLine label="Đồng tiền thanh toán">{invoice.currencyUnit}</InfoLine>
        </Stack>

        {/* Hàng hoá, dịch vụ */}
        <TableContainer sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
          <Table size="small" sx={{ minWidth: hasDiscount ? 820 : 720 }}>
            <TableHead sx={{ backgroundColor: 'grey.50' }}>
              <TableRow>
                <TableCell sx={{ ...headCellSx, textAlign: 'center' }}>STT</TableCell>
                <TableCell sx={headCellSx}>Tên hàng hoá, dịch vụ</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'center' }}>ĐVT</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Số lượng</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Đơn giá</TableCell>
                {hasDiscount && <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Chiết khấu</TableCell>}
                <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Thành tiền chưa thuế</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'center' }}>Thuế suất</TableCell>
                <TableCell sx={{ ...headCellSx, textAlign: 'right' }}>Tiền thuế GTGT</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoice.items.map((item, i) =>
                item.feature === 4 ? (
                  <TableRow key={i}>
                    <TableCell sx={{ ...cellSx, textAlign: 'center' }}>{i + 1}</TableCell>
                    <TableCell sx={{ ...cellSx, fontStyle: 'italic' }} colSpan={hasDiscount ? 8 : 7}>{item.name}</TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={i}>
                    <TableCell sx={{ ...cellSx, textAlign: 'center' }}>{i + 1}</TableCell>
                    <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{item.name}{FEATURE_SUFFIX[item.feature ?? 1] ?? ''}</TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: 'center' }}>{item.unit}</TableCell>
                    <TableCell sx={numCellSx}>{formatNumber(item.quantity)}</TableCell>
                    <TableCell sx={numCellSx}>{formatNumber(item.unitPrice)}</TableCell>
                    {hasDiscount && (
                      <TableCell sx={numCellSx}>
                        {item.discountAmount ? formatNumber(item.discountAmount) : ''}
                        {item.discountPercent ? ` (${item.discountPercent}%)` : ''}
                      </TableCell>
                    )}
                    <TableCell sx={numCellSx}>{formatNumber(item.total)}</TableCell>
                    <TableCell sx={{ ...cellSx, textAlign: 'center' }}>{vatRateLabel(item)}</TableCell>
                    <TableCell sx={numCellSx}>{formatNumber(item.vatAmount)}</TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Tổng tiền */}
        <Stack spacing={0.75} sx={{ alignSelf: { md: 'flex-end' }, width: { xs: '100%', md: 420 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Cộng tiền hàng</Typography>
            <Typography variant="body2">{formatNumber(invoice.totalBeforeTax)}</Typography>
          </Stack>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Tiền thuế GTGT{uniformRate ? ` (${uniformRate})` : ''}
            </Typography>
            <Typography variant="body2">{formatNumber(invoice.vatAmount)}</Typography>
          </Stack>
          <Divider />
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography sx={{ fontWeight: 700 }}>Tổng tiền thanh toán</Typography>
            <Typography sx={{ fontWeight: 800, color: '#2563EB', fontSize: 18 }}>
              {formatNumber(invoice.totalAmount)} <Box component="span" sx={{ fontSize: 13, fontWeight: 600 }}>{invoice.currencyUnit}</Box>
            </Typography>
          </Stack>
        </Stack>
        {invoice.amountInWords && (
          <Typography variant="body2">
            <Box component="span" sx={{ color: 'text.secondary' }}>Số tiền viết bằng chữ: </Box>
            <Box component="span" sx={{ fontStyle: 'italic', fontWeight: 600 }}>{invoice.amountInWords}</Box>
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

/**
 * Chi tiết 1 hoá đơn điện tử: trạng thái + file PDF hoá đơn (bản do EasyInvoice phát hành) để khách
 * xem trực tiếp, kèm nút tải PDF/XML. Không tải được PDF thì hiện nội dung hoá đơn thay thế.
 */
export default function EInvoiceDetailView({
  invoice,
  loadPdf,
  onDownload,
}: {
  invoice: PublicEInvoice;
  loadPdf: () => Promise<Blob>;
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

  const isDraft = invoice.localStatus === 'DRAFT';

  return (
    <Stack spacing={3}>
      {isDraft && (
        <Alert severity="warning" sx={{ borderRadius: 3 }}>
          Đây là <b>bản nháp</b> hoá đơn để bạn xem trước — chưa ký số, chưa có số hoá đơn và
          <b> chưa có giá trị pháp lý</b>. Nội dung có thể được cửa hàng điều chỉnh trước khi phát hành chính thức.
        </Alert>
      )}
      {invoice.localStatus === 'CANCELLED' && (
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          Hoá đơn này <b>đã bị huỷ</b>{invoice.cancelReason ? ` — lý do: ${invoice.cancelReason}` : ''}
          {invoice.cancelledAt ? ` (lúc ${formatDate(invoice.cancelledAt)})` : ''}. Theo quy định, hoá đơn đã
          ký số hợp lệ được thay thế bằng hoá đơn 0 đồng thay vì xoá bỏ hoàn toàn.
        </Alert>
      )}
      {!isDraft && invoice.easyInvoiceStatus !== undefined && EASY_STATUS_LABEL[invoice.easyInvoiceStatus] && (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          Trạng thái tại cơ quan thuế: <b>{EASY_STATUS_LABEL[invoice.easyInvoiceStatus]}</b>
        </Alert>
      )}

      <Box sx={{ bgcolor: 'grey.100', borderRadius: 3, p: { xs: 1, md: 2 } }}>
        <PdfDocumentViewer
          load={loadPdf}
          reloadKey={`${invoice.invoiceNo ?? ''}|${invoice.localStatus}|${invoice.easyInvoiceStatus ?? ''}`}
          title={`Hoá đơn ${invoice.invoiceNo ?? ''}`.trim()}
          openLabel="Mở hoá đơn trong tab mới"
          fallback={
            <Stack spacing={2}>
              <Alert severity="warning" sx={{ borderRadius: 3 }}>
                Chưa hiển thị được file PDF hoá đơn — dưới đây là nội dung hoá đơn. Vui lòng thử lại sau ít phút.
              </Alert>
              <InvoiceInfoSheet invoice={invoice} />
            </Stack>
          }
        />
      </Box>

      {/* Tải hoá đơn */}
      <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<DownloadOutlinedIcon />}
          disabled={downloading !== null}
          onClick={() => handleDownload('pdf')}
          sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
        >
          {downloading === 'pdf' ? 'Đang tải...' : isDraft ? 'Tải PDF bản nháp' : 'Tải PDF'}
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
