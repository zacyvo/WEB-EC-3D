'use client';

import {
  Alert, FormControlLabel, Radio, RadioGroup, Stack, TextField,
} from '@mui/material';
import type { EInvoiceRequestInput } from '@/types';
import { EINVOICE_NOTE, type EInvoiceRequestErrors } from '@/lib/einvoice-request';

interface Props {
  value: EInvoiceRequestInput;
  onChange: (value: EInvoiceRequestInput) => void;
  /** Shown only after the customer tried to submit. */
  errors?: EInvoiceRequestErrors;
}

/** Buyer details for a VAT e-invoice + when/where the invoice is sent — used at checkout and on the order page. */
export default function EInvoiceRequestFields({ value, onChange, errors = {} }: Props) {
  const set = (patch: Partial<EInvoiceRequestInput>) => onChange({ ...value, ...patch });
  const isCompany = value.buyerType === 'COMPANY';

  return (
    <Stack spacing={2}>
      <Alert severity="info" sx={{ borderRadius: 2 }}>{EINVOICE_NOTE}</Alert>

      <RadioGroup
        row
        value={value.buyerType}
        onChange={(e) => set({ buyerType: e.target.value as EInvoiceRequestInput['buyerType'] })}
      >
        <FormControlLabel value="INDIVIDUAL" control={<Radio size="small" />} label="Cá nhân" />
        <FormControlLabel value="COMPANY" control={<Radio size="small" />} label="Công ty / Đơn vị" />
      </RadioGroup>

      {isCompany && (
        <TextField
          label="Tên công ty / đơn vị *" fullWidth size="small"
          value={value.companyName ?? ''} onChange={(e) => set({ companyName: e.target.value })}
          error={!!errors.companyName} helperText={errors.companyName}
        />
      )}
      <TextField
        label={isCompany ? 'Mã số thuế *' : 'Mã số thuế / CCCD (tùy chọn)'} fullWidth size="small"
        value={value.taxCode ?? ''} onChange={(e) => set({ taxCode: e.target.value })}
        error={!!errors.taxCode} helperText={errors.taxCode}
      />
      <TextField
        label="Họ tên người mua hàng *" fullWidth size="small"
        value={value.buyerName} onChange={(e) => set({ buyerName: e.target.value })}
        error={!!errors.buyerName} helperText={errors.buyerName}
      />
      <TextField
        label={isCompany ? 'Địa chỉ công ty (theo đăng ký thuế) *' : 'Địa chỉ *'} fullWidth size="small"
        value={value.address} onChange={(e) => set({ address: e.target.value })}
        error={!!errors.address} helperText={errors.address}
      />
      <TextField
        label="Email nhận hoá đơn *" type="email" fullWidth size="small"
        value={value.email} onChange={(e) => set({ email: e.target.value })}
        error={!!errors.email} helperText={errors.email ?? 'Hoá đơn điện tử sẽ được gửi tới email này'}
      />
    </Stack>
  );
}
