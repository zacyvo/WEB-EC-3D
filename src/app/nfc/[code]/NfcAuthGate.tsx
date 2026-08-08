'use client';

import { useState } from 'react';
import {
  Box, Button, Checkbox, Container, FormControlLabel,
  Link as MuiLink, Paper, Stack, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import toast from 'react-hot-toast';
import { nfcApi, errMsg } from '@/lib/nfc-api';
import type { NfcOwnProfile } from './types';

export default function NfcAuthGate({
  code, mode, onSuccess,
}: {
  code: string;
  mode: 'activate' | 'login';
  onSuccess: (accessJwt: string, profile: NfcOwnProfile) => void;
}) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const path = mode === 'activate' ? 'activate' : 'login';
      const body = mode === 'activate'
        ? { phone: phone.trim(), password, confirmPassword, agreeTerms }
        : { phone: phone.trim(), password };
      const res = await nfcApi.post(`/nfc/public/${code}/${path}`, body);
      const { accessJwt, profile } = res.data.data;
      toast.success(mode === 'activate' ? 'Kích hoạt thành công' : 'Đăng nhập thành công');
      onSuccess(accessJwt, profile);
    } catch (err) {
      toast.error(errMsg(err, mode === 'activate' ? 'Kích hoạt thất bại' : 'Đăng nhập thất bại'));
    } finally {
      setSubmitting(false);
    }
  };

  const canSubmit =
    !submitting && !!phone.trim() && !!password &&
    (mode === 'login' || (!!confirmPassword && agreeTerms));

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
              {mode === 'activate' ? 'Kích hoạt thẻ NFC' : 'Đăng nhập thẻ NFC'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {mode === 'activate'
                ? 'Đây là lần đầu thẻ được sử dụng — thiết lập số điện thoại và mật khẩu để quản lý thông tin liên hệ của bạn.'
                : 'Nhập số điện thoại và mật khẩu đã thiết lập trước đó để quản lý thẻ.'}
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
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
                label="Mật khẩu"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                autoComplete={mode === 'activate' ? 'new-password' : 'current-password'}
                helperText={mode === 'activate' ? '8-32 ký tự, gồm chữ hoa, chữ thường và số' : undefined}
              />
              {mode === 'activate' && (
                <>
                  <TextField
                    label="Nhập lại mật khẩu"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    autoComplete="new-password"
                  />
                  <FormControlLabel
                    sx={{ textAlign: 'left', alignItems: 'flex-start', mr: 0 }}
                    control={
                      <Checkbox
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Tôi đồng ý với{' '}
                        <MuiLink href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                          điều khoản sử dụng
                        </MuiLink>
                      </Typography>
                    }
                  />
                </>
              )}
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!canSubmit}
                sx={{ borderRadius: 3, py: 1.3, textTransform: 'none', fontWeight: 600 }}
              >
                {submitting ? 'Đang xử lý...' : mode === 'activate' ? 'Kích hoạt' : 'Đăng nhập'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
