'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Box, Typography, TextField, Button, InputAdornment, IconButton,
  Divider, Stack,
} from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store/auth.store';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu tối thiểu 8 ký tự').regex(/[A-Z]/, 'Cần ít nhất 1 chữ hoa').regex(/[0-9]/, 'Cần ít nhất 1 số'),
  phone: z
    .string()
    .refine(
      (val) => !val || /^(0|\+84)(3[2-9]|5[25689]|7[06-9]|8[0-9]|9[0-9])\d{7}$/.test(val),
      'Số điện thoại không hợp lệ (VD: 0912345678)',
    )
    .optional(),
});
type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await api.post('/auth/register', data);
      const { user, accessToken, refreshToken } = res.data.data;
      setAuth(user, { accessToken, refreshToken });
      toast.success('Đăng ký thành công! Chào mừng bạn 🎉');
      router.push('/');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || 'Đăng ký thất bại');
    }
  };

  return (
    <Box sx={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 6 }}>
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg,#007AFF,#0055B3)', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5 }}>
            <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>3D</Typography>
          </Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>Đăng ký</Typography>
          <Typography color="text.secondary">Tạo tài khoản Luxe Glow miễn phí</Typography>
        </Box>

        <Stack component="form" onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
          <TextField label="Họ tên" {...register('name')} error={!!errors.name} helperText={errors.name?.message} fullWidth />
          <TextField label="Email" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} fullWidth />
          <TextField label="Số điện thoại (tuỳ chọn)" type="tel" {...register('phone')} error={!!errors.phone} helperText={errors.phone?.message ?? 'VD: 0912345678'} fullWidth />
          <TextField
            label="Mật khẩu"
            type={showPassword ? 'text' : 'password'}
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
            {isSubmitting ? 'Đang tạo tài khoản...' : 'Đăng ký'}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 3 }}>
          Đã có tài khoản?{' '}
          <Link href="/auth/login" style={{ color: '#007AFF', fontWeight: 600, textDecoration: 'none' }}>Đăng nhập</Link>
        </Typography>
      </Box>
    </Box>
  );
}
