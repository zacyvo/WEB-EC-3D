'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Alert, Box, Button, Chip, CircularProgress, Container, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Divider, Paper, Stack, TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { formatCurrency } from '@/lib/utils';
import ContractDocument, {
  type ContractParty,
  type PublicContract,
} from './ContractDocument';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Axios riêng (không dùng interceptor chung) — trang này xác thực bằng
 * mã bảo mật hợp đồng, không phụ thuộc phiên đăng nhập của user.
 */
const contractApi = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

interface ContractMeta {
  contractNo: string;
  status: PublicContract['status'];
  maskedPhone: string;
  companyName: string;
}

const STATUS_META: Record<
  PublicContract['status'],
  { label: string; chipColor: 'default' | 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error' }
> = {
  NEW:     { label: 'Chờ điền thông tin', chipColor: 'warning' },
  REVIEW:  { label: 'Đang được review',   chipColor: 'info' },
  DRAFT:   { label: 'Bản nháp',           chipColor: 'secondary' },
  FINAL:   { label: 'Bản chính thức',     chipColor: 'primary' },
  SUCCESS: { label: 'Đã hoàn tất',        chipColor: 'success' },
  CLOSED:  { label: 'Đã hủy',             chipColor: 'error' },
};

const EMPTY_PARTY: ContractParty = {
  name: '', address: '', representative: '', position: '', phone: '', email: '', taxCode: '',
};

function errMsg(err: unknown, fallback: string): string {
  const msg = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
  return Array.isArray(msg) ? msg[0] : msg || fallback;
}

export default function ContractAccessPage({ params }: { params: { token: string } }) {
  const token = params.token;
  const storageKey = `contract_access_${token}`;

  const [mounted, setMounted] = useState(false);
  const [meta, setMeta] = useState<ContractMeta | null>(null);
  const [metaError, setMetaError] = useState('');
  const [loadingMeta, setLoadingMeta] = useState(true);

  const [jwt, setJwt] = useState<string | null>(null);
  const [contract, setContract] = useState<PublicContract | null>(null);

  // Unlock form
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);

  // Party A form (trạng thái NEW)
  const [partyA, setPartyA] = useState<ContractParty>(EMPTY_PARTY);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [userNote, setUserNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const authHeaders = useMemo(
    () => (jwt ? { 'X-Contract-Access': jwt } : undefined),
    [jwt],
  );

  const applyContract = useCallback((c: PublicContract) => {
    setContract(c);
    setPartyA({ ...EMPTY_PARTY, ...c.partyA });
    setDeliveryAddress(c.deliveryAddress ?? '');
    setUserNote(c.userNote ?? '');
  }, []);

  // ── Load meta + phiên đã lưu ──
  useEffect(() => {
    setMounted(true);
    let cancelled = false;

    (async () => {
      try {
        const res = await contractApi.get(`/contracts/public/${token}/meta`);
        if (cancelled) return;
        setMeta(res.data.data);

        const savedJwt = sessionStorage.getItem(storageKey);
        if (savedJwt) {
          try {
            const cRes = await contractApi.get(`/contracts/public/${token}`, {
              headers: { 'X-Contract-Access': savedJwt },
            });
            if (cancelled) return;
            setJwt(savedJwt);
            applyContract(cRes.data.data);
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
  }, [token, storageKey, applyContract]);

  // ── Actions ──
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !code.trim()) return;
    setVerifying(true);
    try {
      const res = await contractApi.post(`/contracts/public/${token}/verify`, {
        phone: phone.trim(),
        securityCode: code.trim(),
      });
      const { accessJwt, contract: c } = res.data.data;
      sessionStorage.setItem(storageKey, accessJwt);
      setJwt(accessJwt);
      applyContract(c);
      toast.success('Xác thực thành công');
    } catch (err) {
      toast.error(errMsg(err, 'Xác thực thất bại'));
    } finally {
      setVerifying(false);
    }
  };

  const refresh = async () => {
    if (!jwt) return;
    try {
      const res = await contractApi.get(`/contracts/public/${token}`, { headers: authHeaders });
      applyContract(res.data.data);
      toast.success('Đã tải lại hợp đồng');
    } catch (err) {
      toast.error(errMsg(err, 'Phiên hết hạn, vui lòng xác thực lại'));
      sessionStorage.removeItem(storageKey);
      setJwt(null);
      setContract(null);
    }
  };

  const saveInfo = async (silent = false): Promise<boolean> => {
    if (!jwt) return false;
    setSaving(true);
    try {
      const res = await contractApi.patch(
        `/contracts/public/${token}/party-a`,
        { partyA, deliveryAddress, userNote },
        { headers: authHeaders },
      );
      applyContract(res.data.data);
      if (!silent) toast.success('Đã lưu thông tin');
      return true;
    } catch (err) {
      toast.error(errMsg(err, 'Lưu thông tin thất bại'));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!partyA.name.trim() || !partyA.address.trim() || !partyA.phone.trim()) {
      toast.error('Vui lòng điền đầy đủ Tên, Địa chỉ và Số điện thoại');
      setConfirmOpen(false);
      return;
    }
    setSubmitting(true);
    try {
      const saved = await saveInfo(true);
      if (!saved) return;
      const res = await contractApi.post(
        `/contracts/public/${token}/submit`,
        {},
        { headers: authHeaders },
      );
      applyContract(res.data.data);
      setConfirmOpen(false);
      toast.success('Đã gửi yêu cầu! Cửa hàng sẽ review và phản hồi sớm.');
    } catch (err) {
      toast.error(errMsg(err, 'Gửi yêu cầu thất bại'));
    } finally {
      setSubmitting(false);
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

  // ── Màn hình xác thực ──
  if (!jwt || !contract) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Stack spacing={2.5} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '50%', bgcolor: 'primary.50',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: '#EFF6FF',
            }}>
              <LockOutlinedIcon sx={{ color: '#2563EB' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Hợp đồng {meta.contractNo}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {meta.companyName}
              </Typography>
            </Box>
            <Alert severity="info" sx={{ borderRadius: 3, width: '100%', textAlign: 'left' }}>
              Nhập số điện thoại <b>{meta.maskedPhone}</b> và mã bảo mật 8 ký tự do cửa hàng
              cung cấp để xem hợp đồng.
            </Alert>

            <Box component="form" onSubmit={handleVerify} sx={{ width: '100%' }}>
              <Stack spacing={2}>
                <TextField
                  label="Số điện thoại"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="VD: 0909064680"
                  fullWidth
                  autoComplete="tel"
                />
                <TextField
                  label="Mã bảo mật (8 ký tự)"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="VD: A2B3C4D5"
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 8, style: { letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'monospace' } } }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={verifying || !phone.trim() || code.trim().length < 8}
                  sx={{ borderRadius: 3, py: 1.3, textTransform: 'none', fontWeight: 600 }}
                >
                  {verifying ? 'Đang xác thực...' : 'Mở hợp đồng'}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  }

  const statusMeta = STATUS_META[contract.status];
  const isNew = contract.status === 'NEW';
  const watermark =
    contract.status === 'CLOSED' ? 'ĐÃ HỦY'
    : ['FINAL', 'SUCCESS'].includes(contract.status) ? undefined
    : 'BẢN NHÁP';

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      {/* CSS in ấn: chỉ in phần văn bản hợp đồng */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #contract-print-area, #contract-print-area * { visibility: visible !important; }
          #contract-print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <DescriptionOutlinedIcon sx={{ color: '#2563EB' }} />
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Hợp đồng {contract.contractNo}
          </Typography>
          <Chip size="small" color={statusMeta.chipColor} label={statusMeta.label} sx={{ fontWeight: 600 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            size="small"
            startIcon={<RefreshOutlinedIcon />}
            onClick={refresh}
            sx={{ textTransform: 'none' }}
          >
            Tải lại
          </Button>
          {!isNew && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => window.print()}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              In / Lưu PDF
            </Button>
          )}
        </Stack>

        {/* Banner theo trạng thái */}
        {isNew && (
          <Alert severity="warning" sx={{ borderRadius: 3 }}>
            Vui lòng điền thông tin <b>Bên A (bên đặt hàng)</b> bên dưới rồi bấm{' '}
            <b>Gửi yêu cầu</b>. Sau khi gửi, cửa hàng sẽ review và lập bản hợp đồng.
          </Alert>
        )}
        {contract.status === 'REVIEW' && (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Yêu cầu của bạn đã được gửi{contract.submittedAt ? ` lúc ${new Date(contract.submittedAt).toLocaleString('vi-VN')}` : ''}.
            Cửa hàng đang review — bạn sẽ xem được bản nháp/bản chính thức tại chính link này.
          </Alert>
        )}
        {contract.status === 'DRAFT' && (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Đây là <b>bản nháp</b> hợp đồng để bạn xem trước. Nếu cần chỉnh sửa, vui lòng liên hệ
            cửa hàng ({contract.partyB?.phone || ''}). Bản chính thức sẽ được cập nhật tại link này.
          </Alert>
        )}
        {contract.status === 'FINAL' && (
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            Đây là <b>bản hợp đồng chính thức</b>{contract.finalizedAt ? ` (chốt ngày ${new Date(contract.finalizedAt).toLocaleDateString('vi-VN')})` : ''}.
            Nội dung không thể chỉnh sửa. Bạn có thể In / Lưu PDF để lưu trữ.
          </Alert>
        )}
        {contract.status === 'SUCCESS' && (
          <Alert severity="success" sx={{ borderRadius: 3 }}>
            Hợp đồng đã <b>hoàn tất</b>. Cảm ơn bạn đã tin tưởng {contract.partyB?.name || 'chúng tôi'}!
          </Alert>
        )}
        {contract.status === 'CLOSED' && (
          <Alert severity="error" sx={{ borderRadius: 3 }}>
            Hợp đồng này <b>đã bị hủy</b>{contract.closeReason ? ` — lý do: ${contract.closeReason}` : ''}.
            Liên hệ cửa hàng nếu bạn cần hỗ trợ thêm.
          </Alert>
        )}

        {/* Tóm tắt sản phẩm */}
        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Sản phẩm trong hợp đồng</Typography>
          <Stack divider={<Divider flexItem />} spacing={1.2}>
            {contract.items.map((item, i) => (
              <Stack key={`${item.productId}-${i}`} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ width: 20 }}>{i + 1}.</Typography>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{item.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Mã {item.productCode} · SL {item.quantity} × {formatCurrency(item.unitPrice)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {formatCurrency(item.subtotal)}
                </Typography>
              </Stack>
            ))}
            <Stack direction="row" sx={{ justifyContent: 'space-between', pt: 0.5 }}>
              <Typography sx={{ fontWeight: 700 }}>Tổng giá trị</Typography>
              <Typography sx={{ fontWeight: 800, color: '#2563EB' }}>{formatCurrency(contract.totalAmount)}</Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Form Bên A (chỉ khi NEW) */}
        {isNew && (
          <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
            <Typography sx={{ fontWeight: 700, mb: 2 }}>Thông tin Bên A (bên đặt hàng)</Typography>
            <Stack spacing={2}>
              <TextField
                label="Tên tổ chức / cá nhân *"
                value={partyA.name}
                onChange={(e) => setPartyA((p) => ({ ...p, name: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Địa chỉ *"
                value={partyA.address}
                onChange={(e) => setPartyA((p) => ({ ...p, address: e.target.value }))}
                fullWidth
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Người đại diện"
                  value={partyA.representative}
                  onChange={(e) => setPartyA((p) => ({ ...p, representative: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Chức vụ"
                  value={partyA.position}
                  onChange={(e) => setPartyA((p) => ({ ...p, position: e.target.value }))}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Số điện thoại *"
                  value={partyA.phone}
                  onChange={(e) => setPartyA((p) => ({ ...p, phone: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={partyA.email}
                  onChange={(e) => setPartyA((p) => ({ ...p, email: e.target.value }))}
                  fullWidth
                />
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Mã số thuế / CCCD"
                  value={partyA.taxCode}
                  onChange={(e) => setPartyA((p) => ({ ...p, taxCode: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Địa điểm giao hàng"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  fullWidth
                />
              </Stack>
              <TextField
                label="Ghi chú thêm cho cửa hàng"
                value={userNote}
                onChange={(e) => setUserNote(e.target.value)}
                multiline
                minRows={2}
                fullWidth
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<SaveOutlinedIcon />}
                  onClick={() => saveInfo()}
                  disabled={saving || submitting}
                  sx={{ textTransform: 'none', borderRadius: 3 }}
                >
                  {saving ? 'Đang lưu...' : 'Lưu thông tin'}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<SendOutlinedIcon />}
                  onClick={() => setConfirmOpen(true)}
                  disabled={saving || submitting}
                  sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}
                >
                  Gửi yêu cầu
                </Button>
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* Văn bản hợp đồng */}
        <Paper elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'grey.200', overflow: 'hidden' }}>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, borderBottom: '1px solid', borderColor: 'grey.200', bgcolor: 'grey.50' }}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {isNew ? 'Xem trước văn bản hợp đồng (tự cập nhật theo thông tin bạn điền)' : 'Văn bản hợp đồng'}
            </Typography>
          </Box>
          <Box sx={{ overflowX: 'auto', bgcolor: 'grey.100', p: { xs: 1, md: 2 } }}>
            <Box id="contract-print-area" sx={{ boxShadow: 3, mx: 'auto', maxWidth: 794 }}>
              <ContractDocument
                data={isNew ? { ...contract, partyA, deliveryAddress } : contract}
                watermark={watermark}
              />
            </Box>
          </Box>
        </Paper>
      </Stack>

      {/* Dialog xác nhận gửi */}
      <Dialog open={confirmOpen} onClose={() => !submitting && setConfirmOpen(false)}>
        <DialogTitle>Gửi yêu cầu hợp đồng?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sau khi gửi, bạn sẽ <b>không thể chỉnh sửa</b> thông tin nữa. Cửa hàng sẽ review
            và cập nhật bản nháp / bản chính thức tại chính link này.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} disabled={submitting} sx={{ textTransform: 'none' }}>
            Xem lại
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={submitting}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {submitting ? 'Đang gửi...' : 'Xác nhận gửi'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
