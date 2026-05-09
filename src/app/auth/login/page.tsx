'use client';

import { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box, Container, Typography, TextField, Button, InputAdornment, IconButton,
  Divider, Paper, Stack, alpha, Alert,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth.store';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  identifier: z.string().min(3, 'Vui lòng nhập email hoặc số điện thoại'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
});
type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const errorParam = searchParams.get('error');
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await api.post('/auth/login', data);
      const { user, accessToken, refreshToken } = res.data.data ?? {};
      if (user?.isBlocked) {
        toast.error('Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ để được mở khóa.');
        return;
      }
      setAuth(user, { accessToken, refreshToken });
      toast.success('Đăng nhập thành công!');
      router.push(redirect);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Đăng nhập thất bại');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg,#007AFF,#0055B3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>3D</Typography>
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Đăng nhập</Typography>
          <Typography color="text.secondary">Chào mừng bạn trở lại Luxe Glow</Typography>
        </Box>

        {errorParam === 'account_blocked' && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
            Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ để được mở khóa.
          </Alert>
        )}

        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
          <TextField
            label="Email hoặc số điện thoại" type="text" autoComplete="username"
            {...register('identifier')}
            error={!!errors.identifier} helperText={errors.identifier?.message}
            fullWidth
          />
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            {...register('password')}
            error={!!errors.password} helperText={errors.password?.message}
            fullWidth
            slotProps={{ input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            } }}
          />
          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={{ py: 1.6, fontWeight: 600 }}>
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Stack>

        <Divider sx={{ my: 3 }}><Typography variant="caption" color="text.disabled">hoặc</Typography></Divider>

        <Button
          fullWidth variant="outlined" size="large"
          component="a" href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          sx={{ py: 1.4, gap: 1.5 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Tiếp tục với Google
        </Button>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" style={{ color: '#007AFF', fontWeight: 600, textDecoration: 'none' }}>Đăng ký ngay</Link>
        </Typography>
      </Box>
    </Box>
  );
}
