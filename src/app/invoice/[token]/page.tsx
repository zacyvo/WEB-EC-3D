'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Divider, Paper, Stack, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { formatCurrency, formatDate } from '@/lib/utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios riêng (không dùng interceptor chung) — trang này xác thực bằng
 * khoá mở hoá đơn, không phụ thuộc phiên đăng nhập của user.
 */
const invoiceApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

type LocalStatus = 'ISSUED' | 'CANCELLED' | 'FAILED';

interface InvoiceMeta {
  sellerName: string;
  localStatus: LocalStatus;
  hasInvoiceNo: boolean;
  arisingDate?: string;
}

interface InvoiceItem {
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  total: number;
  vatAmount: number;
  amount: number;
}

interface PublicInvoice {
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
  items: InvoiceItem[];
  totalBeforeTax: number;
  vatAmount: number;
  totalAmount: number;
  paymentMethod: string;
  currencyUnit: string;
  localStatus: LocalStatus;
  easyInvoiceStatus?: number;
  linkView?: string;
  cancelledAt?: string;
  cancelReason?: string;
  note?: string;
}

const EASY_STATUS_LABEL: Record<number, string> = {
  [-1]: 'Hoá đơn trong dải chờ ký',
  0: 'Chưa có chữ ký số',
  1: 'Đã có chữ ký số',
  2: 'Đã khai báo thuế',
  3: 'Bị thay thế',
  4: 'Bị điều chỉnh',
  5: 'Bị huỷ',
  6: 'Đã duyệt',
};

const STATUS_META: Record<LocalStatus, { label: string; color: 'success' | 'error' | 'warning' }> = {
  ISSUED: { label: 'Đã phát hành', color: 'success' },
  CANCELLED: { label: 'Đã huỷ', color: 'error' },
  FAILED: { label: 'Lỗi phát hành', color: 'warning' },
};

function errMsg(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : msg || fallback;
}

export default function InvoiceAccessPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const storageKey = `einvoice_access_${token}`;

  const [mounted, setMounted] = useState(false);
  const [meta, setMeta] = useState<InvoiceMeta | null>(null);
  const [metaError, setMetaError] = useState('');
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [jwt, setJwt] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<PublicInvoice | null>(null);

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [downloading, setDownloading] = useState<'pdf' | 'xml' | null>(null);

  const authHeaders = useMemo(() => (jwt ? { 'X-Einvoice-Access': jwt } : undefined), [jwt]);

  const applyInvoice = useCallback((inv: PublicInvoice) => setInvoice(inv), []);

  // ── Load meta + phiên đã lưu ──
  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    (async () => {
      try {
        const res = await invoiceApi.get(`/einvoices/public/${token}/meta`);
        if (cancelled) return;
        setMeta(res.data.data);

        const savedJwt = sessionStorage.getItem(storageKey);
        if (savedJwt) {
          try {
            const iRes = await invoiceApi.get(`/einvoices/public/${token}`, {
              headers: { 'X-Einvoice-Access': savedJwt },
            });
            if (cancelled) return;
            setJwt(savedJwt);
            applyInvoice(iRes.data.data);
          } catch {
            sessionStorage.removeItem(storageKey);
          }
        }
      } catch (err) {
        if (!cancelled) setMetaError(errMsg(err, 'Liên kết không hợp lệ hoặc đã bị xóa'));
      } finally {
        if (!cancelled) setLoadingMeta(false);
      }
    })();

    return () => { cancelled = true; };
  }, [token, storageKey, applyInvoice]);

  // ── Actions ──
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setVerifying(true);
    try {
      const res = await invoiceApi.post(`/einvoices/public/${token}/verify`, {
        securityCode: code.trim(),
      });
      const { accessJwt, invoice: inv } = res.data.data;
      sessionStorage.setItem(storageKey, accessJwt);
      setJwt(accessJwt);
      applyInvoice(inv);
      toast.success('Mở hoá đơn thành công');
    } catch (err) {
      toast.error(errMsg(err, 'Khoá mở hoá đơn không đúng'));
    } finally {
      setVerifying(false);
    }
  };

  const refresh = async () => {
    if (!jwt) return;
    try {
      const res = await invoiceApi.get(`/einvoices/public/${token}`, { headers: authHeaders });
      applyInvoice(res.data.data);
      toast.success('Đã tải lại hoá đơn');
    } catch (err) {
      toast.error(errMsg(err, 'Phiên hết hạn, vui lòng nhập lại khoá'));
      sessionStorage.removeItem(storageKey);
      setJwt(null);
      setInvoice(null);
    }
  };

  const handleDownload = async (format: 'pdf' | 'xml') => {
    if (!jwt) return;
    setDownloading(format);
    try {
      const res = await fetch(`${API_URL}/einvoices/public/${token}/download?format=${format}`, {
        headers: { 'X-Einvoice-Access': jwt },
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.message || 'Tải hoá đơn thất bại');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hoa-don-${invoice?.invoiceNo || token}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Tải hoá đơn thất bại');
    } finally {
      setDownloading(null);
    }
  };

  // ── Render ──
  if (!mounted || loadingMeta) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <CircularProgress size={28} />
      </Container>
    );
  }

  if (metaError || !meta) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 3 }}>
          {metaError || 'Liên kết không hợp lệ hoặc đã bị xóa'}
        </Alert>
      </Container>
    );
  }

  // ── Màn hình nhập khoá ──
  if (!jwt || !invoice) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#EFF6FF',
            }}>
              <LockOutlinedIcon sx={{ color: '#2563EB' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Hoá đơn điện tử
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {meta.sellerName}
              </Typography>
            </Box>
            <Alert severity="info" sx={{ borderRadius: 3, width: '100%', textAlign: 'left' }}>
              Nhập <b>khoá mở hoá đơn</b> đã được cửa hàng cung cấp để xem và tải hoá đơn điện tử.
              Nếu hoá đơn được lập kèm hợp đồng, khoá mở hoá đơn chính là mã bảo mật của hợp đồng đó.
            </Alert>

            <Box component="form" onSubmit={handleVerify} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="Khoá mở hoá đơn"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: A2B3C4D5"
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 20, style: { letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'monospace' } } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={verifying || code.trim().length < 4}
                  sx={{ borderRadius: 3, py: 1.3, textTransform: 'none', fontWeight: 600 }}
                >
                  {verifying ? 'Đang xác thực...' : 'Mở hoá đơn'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const statusMeta = STATUS_META[invoice.localStatus];

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <ReceiptLongOutlinedIcon sx={{ color: '#2563EB' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Hoá đơn {invoice.invoiceNo ? `số ${invoice.invoiceNo}` : ''}
          </Typography>
          <Chip size="small" color={statusMeta.color} label={statusMeta.label} sx={{ fontWeight: 600 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Button size="small" startIcon={<RefreshOutlinedIcon />} onClick={refresh} sx={{ textTransform: 'none' }}>
            Tải lại
          </Button>
        </Stack>

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
    </Container>
  );
}
