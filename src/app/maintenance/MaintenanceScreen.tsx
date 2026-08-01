'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import {
  Box, Container, Typography, Dialog, DialogContent, TextField,
  Button, IconButton, InputAdornment, Alert, Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const CLICKS_TO_UNLOCK = 5;
const CLICK_WINDOW_MS = 2000;

export function MaintenanceScreen() {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const clickCount = useRef(0);
  const lastClickTime = useRef(0);

  const handleLogoClick = () => {
    const now = Date.now();
    if (now - lastClickTime.current > CLICK_WINDOW_MS) {
      clickCount.current = 0;
    }
    lastClickTime.current = now;
    clickCount.current += 1;

    if (clickCount.current >= CLICKS_TO_UNLOCK) {
      clickCount.current = 0;
      setOpen(true);
    }
  };

  const handleClose = () => {
    if (submitting) return;
    setOpen(false);
    setError('');
    setId('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/maintenance/bypass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.message || 'ID hoặc mật khẩu không đúng.');
        setSubmitting(false);
        return;
      }
      window.location.reload();
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại.');
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E8E8ED 100%)',
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center' }}>
          <Box
            component="button"
            onClick={handleLogoClick}
            aria-label="Luxe Glow"
            sx={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              mb: 5,
              WebkitTapHighlightColor: 'transparent',
              '&:active': { transform: 'scale(0.96)' },
              transition: 'transform 0.15s ease',
            }}
          >
            <Image src="/img/logo_blue_geometric.svg" alt="Luxe Glow" width={44} height={44} priority draggable={false} />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #007AFF 0%, #8B5CF6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                userSelect: 'none',
              }}
            >
              Luxe Glow
            </Typography>
          </Box>

          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: '50%',
              mx: 'auto',
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, rgba(0,122,255,0.1) 0%, rgba(139,92,246,0.1) 100%)',
            }}
          >
            <BuildOutlinedIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, letterSpacing: '-0.02em' }}>
            Đang bảo trì
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 440, mx: 'auto', lineHeight: 1.7 }}>
            Luxe Glow đang được nâng cấp để mang đến trải nghiệm tốt hơn cho bạn.
            Vui lòng quay lại sau ít phút. Xin lỗi vì sự bất tiện này!
          </Typography>
        </Box>
      </Container>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth slots={{ transition: Fade }}>
        <IconButton
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'text.secondary' }}
          aria-label="Đóng"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
        <DialogContent sx={{ pt: 5, pb: 4, px: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LockOutlinedIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Truy cập nội bộ</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              Đăng nhập để bỏ qua chế độ bảo trì
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {error && <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>}

            <TextField
              label="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              autoFocus
              fullWidth
              autoComplete="off"
              disabled={submitting}
            />
            <TextField
              label="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              fullWidth
              autoComplete="off"
              disabled={submitting}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" tabIndex={-1}>
                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting || !id || !password}
              sx={{ borderRadius: 2, py: 1.25, mt: 1 }}
            >
              {submitting ? 'Đang xác thực...' : 'Đăng nhập'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
