'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Box, Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import SortIcon from '@mui/icons-material/Sort';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CheckIcon from '@mui/icons-material/Check';

const SORT_OPTIONS = [
  { value: '', label: 'Mặc định' },
  { value: 'price_asc', label: 'Giá: Thấp đến cao', icon: <ArrowUpwardIcon fontSize="small" /> },
  { value: 'price_desc', label: 'Giá: Cao đến thấp', icon: <ArrowDownwardIcon fontSize="small" /> },
];

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') || '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const currentSort = searchParams.get('sort') || '';

  useEffect(() => {
    setValue(searchParams.get('q') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set('q', value.trim());
    else params.delete('q');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (sortValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (sortValue) params.set('sort', sortValue);
    else params.delete('sort');
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
    setAnchorEl(null);
  };

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || 'Sắp xếp';

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ mb: 3, display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        slotProps={{ input: {
          startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment>),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton size="small" onClick={clearSearch} edge="end"><ClearIcon sx={{ fontSize: 18 }} /></IconButton>
            </InputAdornment>
          ) : null,
        } }}
      />
      <Button
        variant={currentSort ? 'contained' : 'outlined'}
        size="small"
        startIcon={<SortIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ whiteSpace: 'nowrap', flexShrink: 0, borderRadius: 2 }}
      >
        {activeSortLabel}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { mt: 0.5, borderRadius: 2, minWidth: 200 } } }}
      >
        {SORT_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} selected={currentSort === opt.value} onClick={() => handleSort(opt.value)}>
            {opt.icon && <ListItemIcon>{opt.icon}</ListItemIcon>}
            <ListItemText>{opt.label}</ListItemText>
            {currentSort === opt.value && <CheckIcon fontSize="small" sx={{ ml: 1, color: 'primary.main' }} />}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
