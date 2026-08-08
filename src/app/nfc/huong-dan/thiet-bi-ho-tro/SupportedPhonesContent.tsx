'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Alert, Box, Chip, CircularProgress, Container, Divider, IconButton, InputAdornment,
  Paper, Stack, TextField, Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NfcOutlinedIcon from '@mui/icons-material/NfcOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import ClearIcon from '@mui/icons-material/Clear';

interface PhoneModel {
  name: string;
  year: number;
}

interface PhoneBrand {
  brand: string;
  note?: string;
  models: PhoneModel[];
}

interface PhonesData {
  updatedAt: string;
  disclaimer: string;
  brands: PhoneBrand[];
}

function normalize(s: string): string {
  return s.toLowerCase().trim();
}

export default function SupportedPhonesContent() {
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  const { data, isLoading } = useQuery<PhonesData>({
    queryKey: ['nfc-supported-phones'],
    queryFn: async () => {
      const res = await fetch('/data/nfc-supported-phones.json');
      return res.json();
    },
    staleTime: Infinity,
  });

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = normalize(search.trim());
    return data.brands
      .filter((b) => !selectedBrand || b.brand === selectedBrand)
      .map((b) => {
        const brandMatches = !q || normalize(b.brand).includes(q);
        const models = brandMatches ? b.models : b.models.filter((m) => normalize(m.name).includes(q));
        return { ...b, models: [...models].sort((a, c) => c.year - a.year) };
      })
      .filter((b) => b.models.length > 0);
  }, [data, search, selectedBrand]);

  const totalMatches = filtered.reduce((sum, b) => sum + b.models.length, 0);

  return (
    <Box sx={{ py: { xs: 6, md: 10 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
            <PhoneIphoneOutlinedIcon sx={{ color: 'primary.main' }} />
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 2 }}>
              Thẻ NFC
            </Typography>
          </Stack>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
            Điện thoại hỗ trợ NFC
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
            Tra cứu nhanh dòng máy có NFC theo hãng sản xuất, từ 2015 đến nay, để chạm thẻ NFC danh
            thiếp {' '}
            <Link href="/nfc/huong-dan" style={{ color: 'inherit', fontWeight: 600 }}>
              (xem hướng dẫn kích hoạt và sử dụng)
            </Link>.
          </Typography>
          <Divider sx={{ mt: 3 }} />
        </Box>

        {data?.disclaimer && (
          <Alert severity="info" icon={<NfcOutlinedIcon fontSize="small" />} sx={{ borderRadius: 3, mb: 4 }}>
            {data.disclaimer}
          </Alert>
        )}

        {/* Search */}
        <Stack spacing={2} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Tìm theo hãng hoặc tên máy — VD: Samsung, iPhone 15, Redmi Note..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />

          {data && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              <Chip
                label="Tất cả"
                size="small"
                color={selectedBrand === '' ? 'primary' : 'default'}
                variant={selectedBrand === '' ? 'filled' : 'outlined'}
                onClick={() => setSelectedBrand('')}
                sx={{ fontWeight: 600 }}
              />
              {data.brands.map((b) => (
                <Chip
                  key={b.brand}
                  label={b.brand}
                  size="small"
                  color={selectedBrand === b.brand ? 'primary' : 'default'}
                  variant={selectedBrand === b.brand ? 'filled' : 'outlined'}
                  onClick={() => setSelectedBrand((cur) => (cur === b.brand ? '' : b.brand))}
                />
              ))}
            </Stack>
          )}
        </Stack>

        {/* Results */}
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress size={28} />
          </Box>
        ) : filtered.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              Không tìm thấy kết quả phù hợp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thử tìm với tên hãng hoặc dòng máy khác, hoặc kiểm tra trực tiếp trong Cài đặt điện
              thoại của bạn.
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {totalMatches} dòng máy phù hợp
            </Typography>
            <Stack spacing={3}>
              {filtered.map((b) => (
                <Paper
                  key={b.brand}
                  elevation={0}
                  sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: b.note ? 0.75 : 2 }}>
                    {b.brand}
                  </Typography>
                  {b.note && (
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                      {b.note}
                    </Typography>
                  )}
                  <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {b.models.map((m) => (
                      <Chip
                        key={m.name}
                        label={`${m.name} · ${m.year}`}
                        size="small"
                        sx={{ bgcolor: 'grey.100', fontWeight: 500 }}
                      />
                    ))}
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </>
        )}
      </Container>
    </Box>
  );
}
