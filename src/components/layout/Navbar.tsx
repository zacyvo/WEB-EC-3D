'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppBar, Toolbar, Container, Box, IconButton, Badge,
  Typography, Button, Avatar, Menu, MenuItem, Divider, alpha,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useCartStore } from '@/lib/store/cart.store';
import { useAuthStore } from '@/lib/store/auth.store';
import { useState } from 'react';
const NAV_LINKS = [
  { label: 'Trang chủ', href: '/' },
  { label: 'Sản phẩm', href: '/products' },
  { label: 'Thiết kế theo yêu cầu', href: '/custom-order' },
  { label: 'Liên hệ', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const { user, clearAuth } = useAuthStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    clearAuth();
    setAnchorEl(null);
    window.location.href = '/';
  };

  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 64, gap: 2 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Box sx={{ width: 32, height: 32, borderRadius: 2, background: 'linear-gradient(135deg, #007AFF 0%, #0055B3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>3D</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '1.05rem', letterSpacing: '-0.02em' }}>Luxe Glow</Typography>
          </Link>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flex: 1, ml: 1 }}>
            {NAV_LINKS.map((l) => (
              <Button key={l.href} component={Link} href={l.href} sx={{ color: pathname === l.href ? 'primary.main' : 'text.secondary', fontWeight: pathname === l.href ? 600 : 400, borderRadius: 2, '&:hover': { color: 'text.primary', backgroundColor: alpha('#007AFF', 0.06) } }}>{l.label}</Button>
            ))}
          </Box>
          <Box sx={{ flex: 1, display: { md: 'none' } }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton component={Link} href="/cart" sx={{ color: 'text.primary' }}>
              <Badge badgeContent={itemCount || null} color="error">
                <ShoppingBagOutlinedIcon fontSize="small" />
              </Badge>
            </IconButton>

            {user ? (
              <>
                <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
                  <Avatar src={user.avatar || undefined} sx={{ width: 32, height: 32, fontSize: 13 }}>{!user.avatar && user.name?.charAt(0).toUpperCase()}</Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  slotProps={{ paper: { sx: { mt: 1, minWidth: 200, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' } } }}>
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{user.email}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem component={Link} href="/profile" onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1.5 }}><PersonOutlineIcon fontSize="small" />Tài khoản</MenuItem>
                  <MenuItem component={Link} href="/orders" onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1.5 }}><ReceiptLongIcon fontSize="small" />Đơn hàng</MenuItem>
                  <MenuItem component={Link} href="/custom-order" onClick={() => setAnchorEl(null)} sx={{ gap: 1.5, py: 1.5 }}><ReceiptLongIcon fontSize="small" />Thiết kế theo yêu cầu</MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.5, color: 'error.main' }}><LogoutIcon fontSize="small" />Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <Button component={Link} href="/auth/login" variant="contained" size="small" sx={{ ml: 1, borderRadius: 980 }}>Đăng nhập</Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
