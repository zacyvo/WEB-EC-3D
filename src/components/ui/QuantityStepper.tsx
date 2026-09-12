'use client';

import { Box, IconButton } from '@mui/material';

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: 'small' | 'medium';
}

const clamp = (value: number, min: number, max?: number) => {
  let result = Math.max(min, Math.floor(value));
  if (typeof max === 'number') result = Math.min(max, result);
  return result;
};

/** Ô số lượng dùng chung: cho phép gõ số trực tiếp hoặc bấm nút -/+. */
export default function QuantityStepper({ value, onChange, min = 1, max, size = 'small' }: QuantityStepperProps) {
  const atMin = value <= min;
  const atMax = typeof max === 'number' && value >= max;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: size === 'small' ? 1.5 : 2, overflow: 'hidden' }}>
      <IconButton
        size={size}
        aria-label="Giảm số lượng"
        disabled={atMin}
        onClick={() => onChange(clamp(value - 1, min, max))}
        sx={{ borderRadius: 0, px: size === 'small' ? 1.5 : 1 }}
      >
        -
      </IconButton>
      <Box
        component="input"
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const parsed = Number(e.target.value);
          onChange(clamp(Number.isFinite(parsed) ? parsed : min, min, max));
        }}
        sx={{
          width: 40,
          textAlign: 'center',
          fontWeight: 600,
          fontSize: size === 'small' ? 14 : 16,
          border: 'none',
          borderLeft: '1px solid',
          borderRight: '1px solid',
          borderColor: 'divider',
          outline: 'none',
          bgcolor: 'transparent',
          color: 'text.primary',
          fontFamily: 'inherit',
          py: 0.5,
          '&::-webkit-outer-spin-button': { WebkitAppearance: 'none', margin: 0 },
          '&::-webkit-inner-spin-button': { WebkitAppearance: 'none', margin: 0 },
          MozAppearance: 'textfield',
        }}
      />
      <IconButton
        size={size}
        aria-label="Tăng số lượng"
        disabled={atMax}
        onClick={() => onChange(clamp(value + 1, min, max))}
        sx={{ borderRadius: 0, px: size === 'small' ? 1.5 : 1 }}
      >
        +
      </IconButton>
    </Box>
  );
}
