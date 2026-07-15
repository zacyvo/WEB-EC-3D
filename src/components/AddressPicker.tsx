'use client';

import { useState } from 'react';
import { Box, Stack, ButtonGroup, Button, Autocomplete, TextField, Alert, CircularProgress, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface NewWard { id: string; name: string; }
interface NewProvince { id: string; name: string; wards: NewWard[]; }

interface OldWard { code: number; name: string; }
interface OldDistrict { code: number; name: string; wards: OldWard[]; }
interface OldProvince { code: number; name: string; districts: OldDistrict[]; }
interface OldLocationData { provinces: OldProvince[]; }

export interface OldAddressSelection { districtCode: number; wardCode?: number }

export interface AddressPickerValue {
  city: string;
  ward: string;
  oldAddress?: OldAddressSelection;
}

interface AddressPickerProps {
  newProvinces: NewProvince[];
  value: AddressPickerValue;
  onChange: (value: AddressPickerValue) => void;
  cityError?: string;
  wardError?: string;
}

export default function AddressPicker({ newProvinces, value, onChange, cityError, wardError }: AddressPickerProps) {
  const [mode, setMode] = useState<'new' | 'old'>('new');
  const [oldProvince, setOldProvince] = useState<OldProvince | null>(null);
  const [oldDistrict, setOldDistrict] = useState<OldDistrict | null>(null);
  const [oldWard, setOldWard] = useState<OldWard | null>(null);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const { data: oldLocationData } = useQuery<OldLocationData>({
    queryKey: ['vn-locations-old'],
    queryFn: async () => {
      const res = await fetch('/data/vn-locations-old.json');
      if (!res.ok) throw new Error('Cannot load old location data');
      return res.json();
    },
    staleTime: Infinity,
    enabled: mode === 'old',
  });

  const oldProvinces = oldLocationData?.provinces ?? [];
  const oldDistricts = oldProvince?.districts ?? [];
  const oldWards = oldDistrict?.wards ?? [];

  const selectedNewProvince = newProvinces.find((p) => p.name === value.city) ?? null;
  const newWardOptions = selectedNewProvince?.wards ?? [];

  const resolveNewAddress = async (districtCode: number, wardCode?: number) => {
    setResolving(true);
    setResolveError(null);
    try {
      const params: Record<string, number> = { districtCode };
      if (wardCode !== undefined) params.wardCode = wardCode;
      const res = await api.get('/locations/old-address/resolve', { params });
      const data = res.data.data as { new: { province: string; ward: string } };
      onChange({ city: data.new.province, ward: data.new.ward, oldAddress: { districtCode, wardCode } });
    } catch {
      setResolveError('Không thể chuyển đổi địa chỉ cũ này');
    } finally {
      setResolving(false);
    }
  };

  return (
    <Box>
      <ButtonGroup fullWidth size="small" sx={{ mb: 2.5 }}>
        <Button
          variant={mode === 'new' ? 'contained' : 'outlined'}
          onClick={() => {
            setMode('new');
            onChange({ city: '', ward: '', oldAddress: undefined });
          }}
        >
          Địa chỉ mới
        </Button>
        <Button
          variant={mode === 'old' ? 'contained' : 'outlined'}
          onClick={() => {
            setMode('old');
            setOldProvince(null);
            setOldDistrict(null);
            setOldWard(null);
            onChange({ city: '', ward: '', oldAddress: undefined });
          }}
        >
          Địa chỉ cũ
        </Button>
      </ButtonGroup>

      {mode === 'new' ? (
        <Stack spacing={2.5}>
          <Autocomplete
            options={newProvinces}
            getOptionLabel={(o) => o.name}
            value={selectedNewProvince}
            onChange={(_, opt) => onChange({ city: opt?.name ?? '', ward: '' })}
            renderInput={(params) => (
              <TextField {...params} label="Tỉnh/Thành phố *" size="small" error={!!cityError} helperText={cityError} />
            )}
          />
          <Autocomplete
            options={newWardOptions}
            getOptionLabel={(o) => o.name}
            value={newWardOptions.find((w) => w.name === value.ward) ?? null}
            disabled={!value.city}
            noOptionsText={!value.city ? 'Chọn tỉnh/thành phố trước' : 'Không tìm thấy'}
            onChange={(_, opt) => onChange({ city: value.city, ward: opt?.name ?? '' })}
            renderInput={(params) => (
              <TextField {...params} label="Phường/Xã *" size="small" error={!!wardError} helperText={wardError} />
            )}
          />
        </Stack>
      ) : (
        <Stack spacing={2.5}>
          <Autocomplete
            options={oldProvinces}
            getOptionLabel={(o) => o.name}
            value={oldProvince}
            isOptionEqualToValue={(o, v) => o.code === v.code}
            onChange={(_, opt) => {
              setOldProvince(opt);
              setOldDistrict(null);
              setOldWard(null);
              onChange({ city: '', ward: '', oldAddress: undefined });
            }}
            renderInput={(params) => <TextField {...params} label="Tỉnh cũ *" size="small" />}
          />
          <Autocomplete
            options={oldDistricts}
            getOptionLabel={(o) => o.name}
            value={oldDistrict}
            disabled={!oldProvince}
            isOptionEqualToValue={(o, v) => o.code === v.code}
            noOptionsText={oldProvince ? 'Không tìm thấy' : 'Chọn tỉnh cũ trước'}
            onChange={(_, opt) => {
              setOldDistrict(opt);
              setOldWard(null);
              onChange({ city: '', ward: '', oldAddress: undefined });
              if (opt && opt.wards.length === 0) resolveNewAddress(opt.code);
            }}
            renderInput={(params) => <TextField {...params} label="Huyện cũ *" size="small" />}
          />
          <Autocomplete
            options={oldWards}
            getOptionLabel={(o) => o.name}
            value={oldWard}
            disabled={!oldDistrict || oldWards.length === 0}
            isOptionEqualToValue={(o, v) => o.code === v.code}
            noOptionsText={!oldDistrict ? 'Chọn huyện cũ trước' : oldWards.length === 0 ? 'Huyện này không có xã/phường' : 'Không tìm thấy'}
            onChange={(_, opt) => {
              setOldWard(opt);
              if (opt && oldDistrict) resolveNewAddress(oldDistrict.code, opt.code);
              else onChange({ city: '', ward: '', oldAddress: undefined });
            }}
            renderInput={(params) => (
              <TextField {...params} label={oldWards.length > 0 ? 'Xã/Phường cũ *' : 'Xã/Phường cũ'} size="small" />
            )}
          />

          <Alert severity="info" sx={{ borderRadius: 2 }}>
            Hệ thống sẽ tự động chuyển đổi sang địa chỉ mới sau sát nhập
          </Alert>

          {resolving && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">Đang chuyển đổi...</Typography>
            </Box>
          )}
          {resolveError && <Alert severity="error" sx={{ borderRadius: 2 }}>{resolveError}</Alert>}
          {!resolving && !resolveError && value.city && value.ward && (
            <Alert severity="success" sx={{ borderRadius: 2 }}>
              Địa chỉ mới: {value.ward}, {value.city}
            </Alert>
          )}
        </Stack>
      )}
    </Box>
  );
}
