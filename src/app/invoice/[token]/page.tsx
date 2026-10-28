'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Paper, Stack, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import EInvoiceDetailView, {
  EINVOICE_STATUS_META,
  downloadEInvoiceFile,
  type EInvoiceFileFormat,
  type EInvoiceLocalStatus,
  type PublicEInvoice,
} from '@/components/einvoice/EInvoiceDetailView';

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

interface InvoiceMeta {
  sellerName: string;
  localStatus: EInvoiceLocalStatus;
  hasInvoiceNo: boolean;
  arisingDate?: string;
}

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
  const [invoice, setInvoice] = useState<PublicEInvoice | null>(null);

  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  const authHeaders = useMemo(() => (jwt ? { 'X-Einvoice-Access': jwt } : undefined), [jwt]);

  const applyInvoice = useCallback((inv: PublicEInvoice) => setInvoice(inv), []);

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

  const handleDownload = async (format: EInvoiceFileFormat) => {
    if (!jwt) return;
    await downloadEInvoiceFile(
      `${API_URL}/einvoices/public/${token}/download?format=${format}`,
      { 'X-Einvoice-Access': jwt },
      `hoa-don-${invoice?.invoiceNo || token}.${format}`,
    );
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

  const statusMeta = EINVOICE_STATUS_META[invoice.localStatus];

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

        <EInvoiceDetailView invoice={invoice} onDownload={handleDownload} />
      </Stack>
    </Container>
  );
}
