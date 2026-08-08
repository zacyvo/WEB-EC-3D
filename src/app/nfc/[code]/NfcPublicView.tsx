'use client';

import { Alert, Box, Container, Paper, Stack, Typography } from '@mui/material';
import { SOCIAL_ICON_MAP } from '@/lib/social-icons';

export interface PublicSocialLink {
  _id: string;
  icon: string;
  value: string;
}

export default function NfcPublicView({ links }: { links: PublicSocialLink[] }) {
  return (
    <Container maxWidth="xs" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={3}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Danh thiếp điện tử
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Chạm vào một mục bên dưới để liên hệ
          </Typography>
        </Box>

        {links.length === 0 ? (
          <Alert severity="info" sx={{ borderRadius: 3 }}>
            Chưa có thông tin liên hệ nào được thêm.
          </Alert>
        ) : (
          <Stack spacing={1.5}>
            {links.map((link) => {
              const def = SOCIAL_ICON_MAP[link.icon];
              if (!def) return null;
              const isDirect = def.inputKind === 'phone' || def.inputKind === 'email';
              return (
                <Paper
                  key={link._id}
                  component="a"
                  href={def.buildHref(link.value)}
                  target={isDirect ? undefined : '_blank'}
                  rel={isDirect ? undefined : 'noopener noreferrer'}
                  elevation={0}
                  sx={{
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'background-color .15s',
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={def.src}
                    alt={def.label}
                    width={40}
                    height={40}
                    style={{ borderRadius: 10, flexShrink: 0 }}
                  />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600 }}>{def.label}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {link.value}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
