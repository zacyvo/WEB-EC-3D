'use client';

import { useState } from 'react';
import {
  Alert, Box, Button, IconButton, Paper, Stack, TextField, Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import toast from 'react-hot-toast';
import { nfcApi, errMsg } from '@/lib/nfc-api';
import { SOCIAL_ICONS, SOCIAL_ICON_MAP, type SocialIconKey } from '@/lib/social-icons';
import type { NfcOwnProfile } from './types';

interface DraftLink {
  icon: SocialIconKey;
  value: string;
}

export default function NfcManage({
  code, profile, accessJwt, onLogout,
}: {
  code: string;
  profile: NfcOwnProfile;
  accessJwt: string;
  onLogout: () => void;
}) {
  const [links, setLinks] = useState<DraftLink[]>(
    profile.socialLinks.map((l) => ({ icon: l.icon as SocialIconKey, value: l.value })),
  );
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const addLink = (icon: SocialIconKey) => {
    setLinks((l) => [...l, { icon, value: '' }]);
    setPickerOpen(false);
  };
  const updateValue = (idx: number, value: string) =>
    setLinks((l) => l.map((x, i) => (i === idx ? { ...x, value } : x)));
  const removeLink = (idx: number) => setLinks((l) => l.filter((_, i) => i !== idx));

  const save = async () => {
    setSaving(true);
    try {
      await nfcApi.put(
        `/nfc/public/${code}/links`,
        { links },
        { headers: { 'X-Nfc-Access': accessJwt } },
      );
      toast.success('Đã lưu danh sách link');
    } catch (err) {
      toast.error(errMsg(err, 'Lưu thất bại'));
    } finally {
      setSaving(false);
    }
  };

  const publicUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/nfc/${profile.nfcCode}`
      : `/nfc/${profile.nfcCode}`;

  return (
    <Box sx={{ maxWidth: 640, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>Quản lý thẻ NFC</Typography>
            <Typography variant="body2" color="text.secondary">SĐT: {profile.phone}</Typography>
          </Box>
          <IconButton onClick={onLogout} title="Đăng xuất">
            <LogoutIcon />
          </IconButton>
        </Stack>

        <Alert severity="info" sx={{ borderRadius: 3, wordBreak: 'break-all' }}>
          Trang công khai của bạn: <b>{publicUrl}</b> — chia sẻ link này hoặc thẻ NFC vật lý để mọi
          người xem thông tin liên hệ.
        </Alert>

        <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
          <Typography sx={{ fontWeight: 700, mb: 2 }}>Danh sách liên hệ / mạng xã hội</Typography>

          <Stack spacing={1.5}>
            {links.map((link, idx) => {
              const def = SOCIAL_ICON_MAP[link.icon];
              return (
                <Stack key={idx} direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={def?.src}
                    alt={def?.label}
                    width={36}
                    height={36}
                    style={{ borderRadius: 9, flexShrink: 0 }}
                  />
                  <TextField
                    size="small"
                    fullWidth
                    value={link.value}
                    onChange={(e) => updateValue(idx, e.target.value)}
                    placeholder={def?.placeholder}
                    label={def?.label}
                  />
                  <IconButton onClick={() => removeLink(idx)} size="small">
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              );
            })}
            {links.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                Chưa có link nào — bấm &quot;Thêm liên hệ&quot; bên dưới.
              </Typography>
            )}
          </Stack>

          <Button
            startIcon={<AddIcon />}
            onClick={() => setPickerOpen((v) => !v)}
            sx={{ mt: 2, textTransform: 'none' }}
          >
            Thêm liên hệ
          </Button>

          {pickerOpen && (
            <Box sx={{
              mt: 1.5, p: 1.5, bgcolor: 'grey.50', borderRadius: 3,
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 1,
            }}>
              {SOCIAL_ICONS.map((def) => (
                <Box
                  key={def.key}
                  onClick={() => addLink(def.key)}
                  sx={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5,
                    p: 1, borderRadius: 2, cursor: 'pointer', textAlign: 'center',
                    '&:hover': { bgcolor: 'white' },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={def.src} alt={def.label} width={32} height={32} style={{ borderRadius: 8 }} />
                  <Typography sx={{ fontSize: 10, lineHeight: 1.2 }}>{def.label}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={save}
            disabled={saving}
            sx={{ mt: 3, textTransform: 'none', fontWeight: 600, borderRadius: 3, py: 1.2 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
}
