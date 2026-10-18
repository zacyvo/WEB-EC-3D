'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Container, Typography } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import { resultMessage } from '@/lib/zalo-oa-reward';

/**
 * Landing page after a Zalo step (backend redirects here with ?result=…). Opened on the
 * phone that scanned the QR or in Zalo's in-app browser — it carries no order id, phone or
 * coupon; the checkout tab that is polling shows the actual reward.
 */
function ZaloRewardResult() {
  const result = useSearchParams().get('result');
  const msg = resultMessage(result);
  const Icon = msg.tone === 'ok' ? CheckCircleRoundedIcon : msg.tone === 'info' ? InfoRoundedIcon : ErrorOutlineRoundedIcon;
  const color = msg.tone === 'ok' ? '#34C759' : msg.tone === 'info' ? '#C9A24A' : '#D45F8A';
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 6, md: 10 } }}>
      <Box
        sx={{
          textAlign: 'center', px: { xs: 3, sm: 5 }, py: { xs: 5, sm: 6 }, borderRadius: '28px',
          background: 'linear-gradient(180deg, #FDE8F0 0%, #FFFFFF 70%)', border: '1px solid rgba(201,162,74,0.35)',
        }}
      >
        <Icon sx={{ fontSize: 64, color }} />
        <Typography variant="h5" sx={{ mt: 2, fontWeight: 800, color: '#3B2A31' }}>{msg.title}</Typography>
        <Typography sx={{ mt: 1.5, color: '#7B6069', lineHeight: 1.6 }}>{msg.body}</Typography>
        <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/orders" variant="contained" sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700, background: 'linear-gradient(90deg, #EE93B4, #D45F8A)' }}>
            Xem đơn hàng
          </Button>
          <Button component={Link} href="/products" variant="outlined" sx={{ borderRadius: 99, textTransform: 'none', fontWeight: 700, borderColor: '#EE93B4', color: '#B9426F' }}>
            Tiếp tục mua sắm
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default function ZaloRewardPage() {
  return (
    <Suspense fallback={null}>
      <ZaloRewardResult />
    </Suspense>
  );
}
