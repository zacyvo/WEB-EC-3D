'use client';

import Link from 'next/link';
import { Box, Container, Typography, Tooltip } from '@mui/material';
import { CONTACT_CHANNELS } from '@/lib/contact-channels';

export function SocialConnectSection() {
  const channels = CONTACT_CHANNELS.filter((c) => c.status && !c.cta.toLowerCase().includes('comming soon'));

  if (!channels.length) return null;

  return (
    <Box component="section" sx={{ py: { xs: 6, md: 9 }, borderTop: '1px solid', borderColor: 'divider' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.25, fontSize: { xs: 24, md: 32 } }}>
          Kết nối với Luxe Glow
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 5, maxWidth: 480, mx: 'auto' }}>
          Theo dõi các kênh của chúng tôi để cập nhật sản phẩm mới, ưu đãi và được hỗ trợ nhanh nhất
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: { xs: 2.5, md: 3.5 } }}>
          {channels.map(({ id, label, href, Icon, color, bg }) => (
            <Tooltip key={id} title={label} arrow>
              <Box
                component={Link}
                href={href}
                target={id !== 'phone' && id !== 'email' ? '_blank' : undefined}
                rel={id !== 'phone' && id !== 'email' ? 'noopener noreferrer' : undefined}
                aria-label={label}
                sx={{
                  width: 64, height: 64, borderRadius: '50%', bgcolor: bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', border: '1px solid', borderColor: 'divider',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 },
                }}
              >
                <Icon sx={{ color, fontSize: 35 }} />
              </Box>
            </Tooltip>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
