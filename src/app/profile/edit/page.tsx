'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Box, Container, Typography, Avatar, Card, CardContent,
  TextField, Button, Stack, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  InputAdornment, IconButton, Alert, Chip,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { ApiResponse, User } from '@/types';

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const maskedLocal =
    local.length <= 3
      ? local[0] + '...'
      : local.slice(0, 2) + '...' + local.slice(-2);
  const dotIdx = domain.lastIndexOf('.');
  const domainName = dotIdx > 0 ? domain.slice(0, dotIdx) : domain;
  const tld = dotIdx > 0 ? domain.slice(dotIdx) : '';
  const maskedDomain =
    domainName.length <= 2
      ? domainName[0] + '...'
      : domainName[0] + '...' + domainName.slice(-2);
  return `${maskedLocal}@${maskedDomain}${tld}`;
}

// ── Profanity guard (basic Vietnamese + common offensive words) ────────────────
const BANNED_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|cunt|dick|pussy)\b/i,
  /(đ[uú]|đ[ìí]t|l[oô]n|cu|buồi|đ[aâ]m|ch[eê]t|đ[ốổ]|đụ|dụ|dâm|khốn|mẹ\s?kiếp|mẹ\s?mày|thằng\s?chó|con\s?đĩ|điếm|ngu\s?như)/i,
];

function containsBannedWords(text: string): boolean {
  return BANNED_PATTERNS.some((re) => re.test(text));
}

// ── Age validation ─────────────────────────────────────────────────────────────
function validateAge(dateStr: string): string | null {
  if (!dateStr) return null;
  const dob = new Date(dateStr);
  if (isNaN(dob.getTime())) return 'Ngày sinh không hợp lệ';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  if (age < 16) return 'Bạn phải đủ 16 tuổi';
  if (age > 85) return 'Ngày sinh không hợp lệ';
  return null;
}

function maxDobDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 16);
  return d.toISOString().split('T')[0];
}

function minDobDate(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 85);
  return d.toISOString().split('T')[0];
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function EditProfilePage() {
  const { user, isAuthenticated, clearAuth, updateUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/auth/login?redirect=/profile/edit');
  }, [isAuthenticated, router]);

  // ── Name ──────────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  // ── Phone ─────────────────────────────────────────────────────────────────
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [phoneConfirmOpen, setPhoneConfirmOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<{ name?: string; dob?: string; phone?: string } | null>(null);

  // ── Date of birth ─────────────────────────────────────────────────────────
  const [dob, setDob] = useState('');
  const [dobError, setDobError] = useState('');

  // ── Password ──────────────────────────────────────────────────────────────
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Delete account dialog (2-step) ────────────────────────────────────────
  // step 1 = pre-send, step 2 = enter code
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [deleteCode, setDeleteCode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [countdown, setCountdown] = useState(0); // seconds remaining
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    setCountdown(300); // 5 minutes
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup timer on unmount
  useEffect(() => () => { if (countdownRef.current) clearInterval(countdownRef.current); }, []);

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeleteStep(1);
    setDeleteCode('');
    setDeleteError('');
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(0);
  };

  // Prefill from store
  useEffect(() => {
    if (user) {
      setName(user.name ?? '');
      setDob(user.dob ? user.dob.split('T')[0] : '');
      setPhone(user.phone ?? '');
    }
  }, [user]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const profileMut = useMutation({
    mutationFn: (data: { name?: string; dob?: string; phone?: string }) =>
      api.patch<ApiResponse<User>>('/users/me', data),
    onSuccess: (res) => {
      if (res.data.data) updateUser(res.data.data);
      toast.success('Đã cập nhật hồ sơ');
    },
    onError: () => toast.error('Không thể cập nhật hồ sơ'),
  });

  const passwordMut = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      api.post('/users/me/change-password', data),
    onSuccess: () => {
      toast.success('Đã đổi mật khẩu thành công');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err?.response?.data?.message ?? 'Không thể đổi mật khẩu';
      setPwError(msg);
    },
  });

  const requestDeleteMut = useMutation({
    mutationFn: () => api.post('/users/me/delete-account/request'),
    onSuccess: () => {
      setDeleteStep(2);
      startCountdown();
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err?.response?.data?.message ?? 'Không thể gửi mã. Vui lòng thử lại.';
      toast.error(msg);
    },
  });

  const confirmDeleteMut = useMutation({
    mutationFn: (code: string) =>
      api.post('/users/me/delete-account/confirm', { code: code.toUpperCase() }),
    onSuccess: () => {
      clearAuth();
      closeDeleteDialog();
      toast.success('Tài khoản đã được xóa vĩnh viễn');
      router.replace('/');
    },
    onError: (err: { response?: { data?: { message?: string } } }) => {
      const msg = err?.response?.data?.message ?? 'Mã không đúng. Vui lòng thử lại.';
      setDeleteError(msg);
    },
  });

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Tên không được để trống');
      hasError = true;
    } else if (name.trim().length < 2) {
      setNameError('Tên phải có ít nhất 2 ký tự');
      hasError = true;
    } else if (containsBannedWords(name)) {
      setNameError('Tên chứa từ ngữ không phù hợp');
      hasError = true;
    } else {
      setNameError('');
    }

    if (dob) {
      const ageErr = validateAge(dob);
      if (ageErr) { setDobError(ageErr); hasError = true; }
      else setDobError('');
    } else {
      setDobError('');
    }

    // Phone validation (only when user has no phone yet)
    const isAddingPhone = !user?.phone && phone.trim();
    if (isAddingPhone) {
      const phoneDigits = phone.replace(/\D/g, '');
      if (phoneDigits.length < 9 || phoneDigits.length > 11) {
        setPhoneError('Số điện thoại không hợp lệ (9-11 chữ số)');
        hasError = true;
      } else {
        setPhoneError('');
      }
    }

    if (hasError) return;

    const payload: { name?: string; dob?: string; phone?: string } = {};
    if (name.trim() !== user?.name) payload.name = name.trim();
    if (dob !== (user?.dob ? user.dob.split('T')[0] : '')) payload.dob = dob || undefined;
    if (isAddingPhone) payload.phone = phone.trim();

    if (Object.keys(payload).length === 0) {
      toast('Không có thay đổi nào để lưu', { icon: 'ℹ️' });
      return;
    }

    // If phone is being set for the first time, show confirmation modal
    if (payload.phone) {
      setPendingPayload(payload);
      setPhoneConfirmOpen(true);
      return;
    }

    profileMut.mutate(payload);
  };

  const handleConfirmPhoneSave = () => {
    if (pendingPayload) profileMut.mutate(pendingPayload);
    setPhoneConfirmOpen(false);
    setPendingPayload(null);
  };

  const handleCancelPhoneSave = () => {
    setPhoneConfirmOpen(false);
    setPendingPayload(null);
  };

  const handleChangePassword = () => {
    setPwError('');
    if (!currentPw) { setPwError('Vui lòng nhập mật khẩu hiện tại'); return; }
    if (newPw.length < 6) { setPwError('Mật khẩu mới phải có ít nhất 6 ký tự'); return; }
    if (newPw !== confirmPw) { setPwError('Mật khẩu xác nhận không khớp'); return; }
    if (newPw === currentPw) { setPwError('Mật khẩu mới phải khác mật khẩu hiện tại'); return; }
    passwordMut.mutate({ currentPassword: currentPw, newPassword: newPw });
  };

  const handleConfirmDelete = () => {
    if (deleteCode.length !== 6) { setDeleteError('Mã gồm 6 ký tự'); return; }
    confirmDeleteMut.mutate(deleteCode);
  };

  if (!user) return null;

  const isLocalProvider = user.provider === 'local';

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <IconButton onClick={() => router.back()} size="small" sx={{ color: 'text.secondary' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Chỉnh sửa hồ sơ</Typography>
      </Box>

      {/* ── Avatar ───────────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Avatar sx={{ width: 96, height: 96, fontSize: 36, bgcolor: 'primary.main' }}>
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} fill style={{ objectFit: 'cover' }} sizes="96px" />
          ) : (
            user.name?.charAt(0).toUpperCase()
          )}
        </Avatar>
      </Box>

      {/* ── Basic info ───────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
            <EditOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Thông tin cá nhân</Typography>
          </Box>

          <Stack spacing={2.5}>
            <TextField
              label="Email"
              value={maskEmail(user.email)}
              disabled
              fullWidth
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <Chip label="Không thể thay đổi" size="small" sx={{ fontSize: '0.68rem', height: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
            {user.phone ? (
              <TextField
                label="Số điện thoại"
                value={user.phone}
                disabled
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Chip label="Không thể thay đổi" size="small" sx={{ fontSize: '0.68rem', height: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            ) : (
              <TextField
                label="Số điện thoại"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); if (phoneError) setPhoneError(''); }}
                fullWidth
                placeholder="Nhập số điện thoại"
                error={!!phoneError}
                helperText={phoneError || 'Số điện thoại chỉ có thể đặt một lần và không thể thay đổi sau này'}
                slotProps={{ htmlInput: { maxLength: 15 } }}
              />
            )}
            <TextField
              label="Họ và tên"
              value={name}
              onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
              fullWidth
              required
              error={!!nameError}
              helperText={nameError || 'Tên hiển thị của bạn trên hệ thống'}
              slotProps={{ htmlInput: { maxLength: 64 } }}
            />
            <TextField
              label="Ngày sinh"
              type="date"
              value={dob}
              onChange={(e) => { setDob(e.target.value); if (dobError) setDobError(''); }}
              fullWidth
              error={!!dobError}
              helperText={dobError || 'Từ 16 đến 85 tuổi'}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { min: minDobDate(), max: maxDobDate() },
              }}
            />
          </Stack>

          <Button
            variant="contained"
            fullWidth
            onClick={handleSaveProfile}
            disabled={profileMut.isPending}
            startIcon={profileMut.isPending ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{ mt: 3, py: 1.25, borderRadius: 2 }}
          >
            Lưu thay đổi
          </Button>
        </CardContent>
      </Card>

      {/* ── Change Password (local only) ──────────────────────────────────── */}
      {isLocalProvider && (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
              <LockOutlinedIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Đổi mật khẩu</Typography>
            </Box>

            <Stack spacing={2.5}>
              <TextField
                label="Mật khẩu hiện tại"
                type={showCurrent ? 'text' : 'password'}
                value={currentPw}
                onChange={(e) => { setCurrentPw(e.target.value); if (pwError) setPwError(''); }}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowCurrent((s) => !s)}>
                          {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Mật khẩu mới"
                type={showNew ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => { setNewPw(e.target.value); if (pwError) setPwError(''); }}
                fullWidth
                helperText="Ít nhất 6 ký tự"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowNew((s) => !s)}>
                          {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Xác nhận mật khẩu mới"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPw}
                onChange={(e) => { setConfirmPw(e.target.value); if (pwError) setPwError(''); }}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowConfirm((s) => !s)}>
                          {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              {pwError && <Alert severity="error" sx={{ py: 0.5 }}>{pwError}</Alert>}
            </Stack>

            <Button
              variant="outlined"
              fullWidth
              onClick={handleChangePassword}
              disabled={passwordMut.isPending}
              startIcon={passwordMut.isPending ? <CircularProgress size={16} color="inherit" /> : null}
              sx={{ mt: 3, py: 1.25, borderRadius: 2 }}
            >
              Đổi mật khẩu
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Delete account ────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 3, borderColor: 'error.light' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <DeleteForeverOutlinedIcon sx={{ color: 'error.main', fontSize: 20 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main' }}>
              Xóa tài khoản
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Hành động này không thể khôi phục. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
          </Typography>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={() => setDeleteOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Xóa tài khoản của tôi
          </Button>
        </CardContent>
      </Card>

      {/* ── Phone number confirmation dialog ───────────────────────────────── */}
      <Dialog
        open={phoneConfirmOpen}
        onClose={handleCancelPhoneSave}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Xác nhận số điện thoại
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
            Số điện thoại <strong>{pendingPayload?.phone}</strong> sẽ <strong>không thể thay đổi</strong> sau khi lưu. Bạn có chắc chắn muốn tiếp tục?
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={handleCancelPhoneSave} color="inherit">Hủy</Button>
          <Button
            variant="contained"
            onClick={handleConfirmPhoneSave}
            disabled={profileMut.isPending}
            startIcon={profileMut.isPending ? <CircularProgress size={16} color="inherit" /> : null}
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete account dialog (2-step) ─────────────────────────────────── */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        {/* Step 1 — confirm intent & send code */}
        {deleteStep === 1 && (
          <>
            <DialogTitle sx={{ fontWeight: 700, color: 'error.main', pb: 1 }}>
              Xác nhận xóa tài khoản
            </DialogTitle>
            <DialogContent>
              <Alert severity="warning" sx={{ mb: 2, borderRadius: 2 }}>
                Hành động này <strong>không thể hoàn tác</strong>. Tài khoản và toàn bộ dữ liệu của bạn sẽ bị xóa vĩnh viễn.
              </Alert>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: 'grey.50', borderRadius: 2, p: 2 }}>
                <MarkEmailReadOutlinedIcon sx={{ color: 'text.secondary', flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary">
                  Chúng tôi sẽ gửi mã xác nhận đến email{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>{maskEmail(user.email)}</Box>.
                  Mã có hiệu lực trong <strong>5 phút</strong>.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={closeDeleteDialog} color="inherit">Hủy</Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => requestDeleteMut.mutate()}
                disabled={requestDeleteMut.isPending}
                startIcon={requestDeleteMut.isPending ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Gửi mã xác nhận
              </Button>
            </DialogActions>
          </>
        )}

        {/* Step 2 — enter code */}
        {deleteStep === 2 && (
          <>
            <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Nhập mã xác nhận</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Mã xác nhận đã được gửi đến{' '}
                <Box component="span" sx={{ fontWeight: 600, color: 'text.primary' }}>{maskEmail(user.email)}</Box>.
              </Typography>

              <TextField
                fullWidth
                label="Mã xác nhận (6 ký tự)"
                value={deleteCode}
                onChange={(e) => {
                  setDeleteCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
                  if (deleteError) setDeleteError('');
                }}
                placeholder="VD: A3BX9K"
                error={!!deleteError}
                helperText={deleteError}
                slotProps={{ htmlInput: { maxLength: 6, style: { letterSpacing: '0.25em', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'monospace' } } }}
                autoFocus
              />

              {/* Countdown */}
              <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                {countdown > 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Mã hết hạn sau{' '}
                    <Box component="span" sx={{ fontWeight: 700, color: countdown < 60 ? 'error.main' : 'text.primary' }}>
                      {formatCountdown(countdown)}
                    </Box>
                  </Typography>
                ) : (
                  <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                    Mã đã hết hạn
                  </Typography>
                )}
                <Button
                  size="small"
                  onClick={() => requestDeleteMut.mutate()}
                  disabled={requestDeleteMut.isPending || countdown > 4 * 60}
                  sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                >
                  {requestDeleteMut.isPending ? <CircularProgress size={12} /> : 'Gửi lại mã'}
                </Button>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
              <Button onClick={closeDeleteDialog} color="inherit">Hủy</Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                disabled={deleteCode.length !== 6 || confirmDeleteMut.isPending || countdown === 0}
                startIcon={confirmDeleteMut.isPending ? <CircularProgress size={16} color="inherit" /> : null}
              >
                Xóa tài khoản
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
