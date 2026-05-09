'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Box, Badge, Typography } from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import { useCartStore } from '@/lib/store/cart.store';

const NAV_ITEMS = [
  { href: '/', label: 'Trang chủ', Icon: HomeOutlinedIcon },
  { href: '/custom-order', label: 'Thiết kế', Icon: BrushOutlinedIcon },
  { href: '/products', label: 'Sản phẩm', Icon: GridViewOutlinedIcon },
  { href: '/cart', label: 'Giỏ hàng', Icon: ShoppingBagOutlinedIcon, showBadge: true },
  { href: '/profile', label: 'Tôi', Icon: PersonOutlineIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Box
      component="nav"
      sx={{
        display: { xs: 'flex', md: 'none' },
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200,
        bgcolor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid',
        borderColor: 'divider',
        height: 64,
        alignItems: 'center',
        justifyContent: 'space-around',
        px: 1,
      }}
    >
      {NAV_ITEMS.map(({ href, label, Icon, showBadge }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <Box
            key={href}
            component={Link}
            href={href}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3,
              px: 1.5, py: 0.75, borderRadius: 2, textDecoration: 'none',
              color: active ? 'primary.main' : 'text.disabled',
              transition: 'color 0.15s',
            }}
          >
            <Badge badgeContent={showBadge ? (itemCount || null) : null} color="error" sx={{ '& .MuiBadge-badge': { fontSize: 9, minWidth: 16, height: 16 } }}>
              <Icon sx={{ fontSize: 24 }} />
            </Badge>
            <Typography sx={{ fontSize: 10, fontWeight: active ? 600 : 400, lineHeight: 1 }}>{label}</Typography>
          </Box>
        );
      })}

    </Box>
  );
}
