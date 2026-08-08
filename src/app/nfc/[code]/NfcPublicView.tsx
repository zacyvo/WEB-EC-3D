'use client';

import { useMemo } from 'react';
import { Box, Container, Stack, Typography, alpha } from '@mui/material';
import NfcOutlinedIcon from '@mui/icons-material/NfcOutlined';
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { SOCIAL_ICON_MAP } from '@/lib/social-icons';

export interface PublicSocialLink {
  _id: string;
  icon: string;
  value: string;
}

const ACCENT_FROM = '#0A84FF';
const ACCENT_TO = '#5AC8FA';

/** Sinh file .vcf (vCard) từ SĐT/Email đã có — cho phép "Lưu vào danh bạ" bằng 1 chạm, giống Apple Wallet. */
function useVCardHref(links: PublicSocialLink[]): string | null {
  return useMemo(() => {
    const phone = links.find((l) => l.icon === 'phone')?.value;
    const email = links.find((l) => l.icon === 'email')?.value;
    if (!phone && !email) return null;
    const lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:;;;;',
      'FN:Danh thiếp điện tử',
      phone ? `TEL;TYPE=CELL:${phone}` : '',
      email ? `EMAIL:${email}` : '',
      'END:VCARD',
    ].filter(Boolean);
    return `data:text/vcard;charset=utf-8,${encodeURIComponent(lines.join('\r\n'))}`;
  }, [links]);
}

export default function NfcPublicView({ links }: { links: PublicSocialLink[] }) {
  const vCardHref = useVCardHref(links);
  const validLinks = links.filter((l) => SOCIAL_ICON_MAP[l.icon]);

  return (
    <Box
      sx={{
        background: 'linear-gradient(180deg, #F5F5F7 0%, #FFFFFF 55%)',
        minHeight: { xs: 'auto', md: '70vh' },
      }}
    >
      <Container maxWidth="xs" sx={{ py: { xs: 5, md: 9 } }}>
        {/* ── Hero card ── */}
        <Box
          sx={{
            borderRadius: '28px',
            overflow: 'hidden',
            bgcolor: '#fff',
            boxShadow: '0 24px 60px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {/* Gradient banner */}
          <Box
            sx={{
              height: 104,
              position: 'relative',
              background: `linear-gradient(135deg, ${ACCENT_FROM} 0%, ${ACCENT_TO} 100%)`,
              overflow: 'hidden',
            }}
          >
            <Box sx={{
              position: 'absolute', top: -36, right: -24, width: 150, height: 150,
              borderRadius: '50%', bgcolor: alpha('#fff', 0.16), filter: 'blur(6px)',
            }}
            />
            <Box sx={{
              position: 'absolute', bottom: -50, left: -30, width: 130, height: 130,
              borderRadius: '50%', bgcolor: alpha('#fff', 0.1), filter: 'blur(6px)',
            }}
            />
          </Box>

          {/* Avatar overlapping the seam */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '-44px' }}>
            <Box
              sx={{
                width: 88, height: 88, borderRadius: '50%',
                bgcolor: '#fff', boxShadow: '0 10px 28px rgba(0,0,0,0.14)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: `linear-gradient(135deg, ${alpha(ACCENT_FROM, 0.12)} 0%, ${alpha(ACCENT_TO, 0.12)} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <NfcOutlinedIcon sx={{ fontSize: 34, color: ACCENT_FROM }} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ px: 3.5, pb: 3.5, pt: 1.5, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
              Danh thiếp điện tử
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: vCardHref ? 2.5 : 0 }}>
              Chạm vào một mục bên dưới để liên hệ ngay
            </Typography>

            {vCardHref && (
              <Box
                component="a"
                href={vCardHref}
                download="danh-thiep.vcf"
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 1,
                  bgcolor: '#000', color: '#fff', textDecoration: 'none',
                  px: 3, py: 1.25, borderRadius: 980,
                  fontWeight: 600, fontSize: 15,
                  transition: 'transform .15s ease, opacity .15s ease',
                  '&:active': { transform: 'scale(0.96)', opacity: 0.85 },
                }}
              >
                <PersonAddAlt1OutlinedIcon sx={{ fontSize: 18 }} />
                Lưu vào danh bạ
              </Box>
            )}
          </Box>
        </Box>

        {/* ── Grouped contact list ── */}
        {validLinks.length > 0 ? (
          <Box
            sx={{
              mt: 3, borderRadius: '22px', overflow: 'hidden', bgcolor: '#fff',
              boxShadow: '0 16px 40px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            {validLinks.map((link, i) => {
              const def = SOCIAL_ICON_MAP[link.icon];
              const isDirect = def.inputKind === 'phone' || def.inputKind === 'email';
              return (
                <Box
                  key={link._id}
                  component="a"
                  href={def.buildHref(link.value)}
                  target={isDirect ? undefined : '_blank'}
                  rel={isDirect ? undefined : 'noopener noreferrer'}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.75,
                    px: 2.25, py: 1.65,
                    textDecoration: 'none', color: 'inherit',
                    borderBottom: i < validLinks.length - 1 ? '1px solid' : 'none',
                    borderColor: 'grey.100',
                    transition: 'background-color .15s ease',
                    '&:hover': { bgcolor: 'grey.50' },
                    '&:active': { bgcolor: 'grey.100' },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={def.src}
                    alt=""
                    width={40}
                    height={40}
                    style={{ borderRadius: 11, flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}
                  />
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 15, lineHeight: 1.3 }}>
                      {def.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap sx={{ fontSize: 13 }}>
                      {link.value}
                    </Typography>
                  </Box>
                  <ChevronRightRoundedIcon sx={{ color: 'grey.300', flexShrink: 0 }} />
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              mt: 3, borderRadius: '22px', bgcolor: '#fff', boxShadow: '0 16px 40px rgba(0,0,0,0.05)',
              py: 5, px: 3, textAlign: 'center',
            }}
          >
            <ContactPageOutlinedIcon sx={{ fontSize: 32, color: 'grey.300', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Chưa có thông tin liên hệ nào được thêm.
            </Typography>
          </Box>
        )}

        {/* ── Footer branding ── */}
        <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'center', alignItems: 'baseline', mt: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Danh thiếp điện tử bởi
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, color: ACCENT_FROM }}>
            Luxe Glow
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
