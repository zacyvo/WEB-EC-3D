'use client';

import { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Chip, Stack, IconButton, CircularProgress,
} from '@mui/material';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { formatCurrency } from '@/lib/utils';
import { describeCoupon, normalizeCouponCode } from '@/lib/coupon';
import type { Coupon, ValidateCouponsResponse } from '@/types';

interface Props {
  /** Codes the shop has assigned to this customer (GET /promotions/my-coupons). */
  coupons: Coupon[];
  /** Codes the customer picked or typed, in apply order. */
  selectedCodes: string[];
  validateResult: ValidateCouponsResponse | null;
  isValidating: boolean;
  onAdd: (code: string) => void;
  onRemove: (code: string) => void;
}

/** Checkout "Mã giảm giá": type a code (e.g. FREE_SHIP) or tap one of the customer's codes; each
 * selected code shows whether it applied (and how much) or why not. */
export default function CouponSection({ coupons, selectedCodes, validateResult, isValidating, onAdd, onRemove }: Props) {
  const [input, setInput] = useState('');

  function submitInput() {
    const code = normalizeCouponCode(input);
    if (!code) return;
    onAdd(code);
    setInput('');
  }

  const appliedByCode = new Map((validateResult?.appliedCoupons ?? []).map((a) => [a.code, a]));
  const rejectedByCode = new Map((validateResult?.rejectedCoupons ?? []).map((r) => [r.code, r]));
  const totalSaved = (validateResult?.totalDiscount ?? 0) + (validateResult?.shippingDiscount ?? 0);

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mt: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <LocalOfferOutlinedIcon sx={{ fontSize: 20, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Mã giảm giá</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Nhập mã giảm giá hoặc mã miễn phí vận chuyển (VD: <strong>FREE_SHIP</strong>)
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: coupons.length ? 2 : 0 }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Nhập mã giảm giá"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            // Inside the checkout <form>: Enter must apply the code, not place the order.
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); submitInput(); }
            }}
            slotProps={{ htmlInput: { maxLength: 50, 'aria-label': 'Mã giảm giá', style: { fontFamily: 'monospace', fontWeight: 600 } } }}
          />
          <Button
            type="button"
            variant="contained"
            onClick={submitInput}
            disabled={!input.trim()}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 3, flexShrink: 0 }}
          >
            Áp dụng
          </Button>
        </Box>

        {coupons.length > 0 && (
          <>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, fontWeight: 600 }}>
              Mã dành cho bạn — chạm để chọn
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {coupons.map((c) => {
                const selected = selectedCodes.includes(c.code);
                const applied = appliedByCode.has(c.code);
                return (
                  <Chip
                    key={c.code}
                    icon={c.type === 'free_shipping' ? <LocalShippingOutlinedIcon /> : undefined}
                    label={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, fontFamily: 'monospace', lineHeight: 1.3, fontSize: '0.8rem' }}>
                          {c.code}
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: selected ? 'inherit' : 'text.secondary', lineHeight: 1.4 }}>
                          {describeCoupon(c)}
                        </Typography>
                        {c.minOrderValue > 0 && (
                          <Typography variant="caption" sx={{ fontSize: '0.65rem', color: selected ? 'inherit' : 'text.disabled', lineHeight: 1.3 }}>
                            Đơn tối thiểu {c.minOrderValue.toLocaleString('vi-VN')}₫
                          </Typography>
                        )}
                      </Box>
                    }
                    onClick={() => (selected ? onRemove(c.code) : onAdd(c.code))}
                    color={applied ? 'success' : selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    sx={{ height: 'auto', py: 0.75, cursor: 'pointer', borderRadius: '20px !important' }}
                  />
                );
              })}
            </Box>
          </>
        )}

        {selectedCodes.length > 0 && (
          <Stack spacing={1} sx={{ mt: 2 }}>
            {selectedCodes.map((code) => {
              const applied = appliedByCode.get(code);
              const rejected = rejectedByCode.get(code);
              const pending = !applied && !rejected;
              const isShipping = applied?.kind === 'shipping';
              return (
                <Box
                  key={code}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, borderRadius: 2,
                    border: '1px solid',
                    borderColor: applied ? 'success.light' : rejected ? 'warning.light' : 'grey.200',
                    bgcolor: applied ? 'rgba(46,125,50,0.06)' : rejected ? 'rgba(237,108,2,0.06)' : 'grey.50',
                  }}
                >
                  {pending ? (
                    <CircularProgress size={16} />
                  ) : applied ? (
                    isShipping
                      ? <LocalShippingOutlinedIcon fontSize="small" color="success" />
                      : <LocalOfferOutlinedIcon fontSize="small" color="success" />
                  ) : (
                    <ErrorOutlineIcon fontSize="small" color="warning" />
                  )}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{code}</Typography>
                    <Typography variant="caption" color={applied ? 'success.dark' : 'text.secondary'} sx={{ display: 'block', lineHeight: 1.4 }}>
                      {pending
                        ? 'Đang kiểm tra...'
                        : applied
                          // Skip the suffix when the program name already says it ("Miễn phí vận chuyển").
                          ? `${applied.name}${isShipping && !/vận chuyển|ship/i.test(applied.name) ? ' — miễn phí vận chuyển' : ''}`
                          : rejected!.reason}
                    </Typography>
                  </Box>
                  {applied && (
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 700, flexShrink: 0 }}>
                      -{formatCurrency(applied.discountAmount)}
                    </Typography>
                  )}
                  <IconButton size="small" aria-label={`Bỏ mã ${code}`} onClick={() => onRemove(code)} disabled={isValidating && pending}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              );
            })}
            {totalSaved > 0 && (
              <Typography variant="caption" color="success.dark" sx={{ textAlign: 'right' }}>
                Tổng tiết kiệm: <strong>-{formatCurrency(totalSaved)}</strong>
              </Typography>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
