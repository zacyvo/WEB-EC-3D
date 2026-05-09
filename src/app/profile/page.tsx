'use client';

import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Avatar, Card, CardContent,
  List, ListItemButton, ListItemIcon, ListItemText, Divider,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Chip, IconButton, Stack, Autocomplete,
  Checkbox, FormControlLabel, CircularProgress,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import HeadsetMicOutlinedIcon from '@mui/icons-material/HeadsetMicOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import type { Address, ApiResponse, User } from '@/types';

interface Ward { id: string; name: string; }
interface Province { id: string; name: string; wards: Ward[]; }
interface LocationData { provinces: Province[]; }

interface AddressForm {
  city: string;
  ward: string;
  street: string;
  isDefault: boolean;
}

const EMPTY_FORM: AddressForm = { city: '', ward: '', street: '', isDefault: false };

export default function ProfilePage() {
  const { user, isAuthenticated, clearAuth, updateUser } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/auth/login?redirect=/profile');
  }, [mounted, isAuthenticated, router]);

  // ── Address dialog state ────────────────────────────────────────────────────
  const [addrOpen, setAddrOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<AddressForm>(EMPTY_FORM);
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);

  // ── Location data (lazy: only loads when form dialog opens) ─────────────────
  const { data: locationData } = useQuery<LocationData>({
    queryKey: ['vn-locations'],
    queryFn: async () => {
      const res = await fetch('/data/vn-locations.json');
      if (!res.ok) throw new Error('Cannot load location data');
      return res.json();
    },
    staleTime: Infinity,
    enabled: formOpen,
  });

  const provinces: Province[] = locationData?.provinces ?? [];
  const wardOptions: Ward[] = selectedProvince
    ? (provinces.find((p) => p.id === selectedProvince.id)?.wards ?? [])
    : [];

  // Prefill province/ward Autocomplete when editing and provinces have loaded
  useEffect(() => {
    if (!formOpen || provinces.length === 0 || selectedProvince !== null || !form.city) return;
    const prov = provinces.find((p) => p.name === form.city);
    if (prov) {
      setSelectedProvince(prov);
      if (form.ward) {
        const ward = prov.wards.find((w) => w.name === form.ward);
        if (ward) setSelectedWard(ward);
      }
    }
  }, [formOpen, provinces, form.city, form.ward, selectedProvince]);

  const openAdd = () => {
    setEditIndex(null);
    setForm({ ...EMPTY_FORM, isDefault: !user?.addresses?.length });
    setSelectedProvince(null);
    setSelectedWard(null);
    setFormOpen(true);
  };

  const openEdit = (index: number, addr: Address) => {
    setEditIndex(index);
    setForm({ city: addr.city, ward: addr.ward, street: addr.street, isDefault: addr.isDefault });
    setSelectedProvince(null);
    setSelectedWard(null);
    setFormOpen(true);
  };

  // ── Mutations ───────────────────────────────────────────────────────────────
  const addMut = useMutation({
    mutationFn: (data: AddressForm) =>
      api.post<ApiResponse<User>>('/users/me/addresses', { ...data, district: '' }),
    onSuccess: (res) => {
      if (res.data.data?.addresses) updateUser({ addresses: res.data.data.addresses });
      toast.success('Đã thêm địa chỉ mới');
      setFormOpen(false);
    },
    onError: () => toast.error('Không thể thêm địa chỉ'),
  });

  const updateMut = useMutation({
    mutationFn: ({ index, data }: { index: number; data: AddressForm }) =>
      api.patch<ApiResponse<User>>(`/users/me/addresses/${index}`, { ...data, district: '' }),
    onSuccess: (res) => {
      if (res.data.data?.addresses) updateUser({ addresses: res.data.data.addresses });
      toast.success('Đã cập nhật địa chỉ');
      setFormOpen(false);
    },
    onError: () => toast.error('Không thể cập nhật địa chỉ'),
  });

  const deleteMut = useMutation({
    mutationFn: (index: number) =>
      api.delete<ApiResponse<User>>(`/users/me/addresses/${index}`),
    onSuccess: (res) => {
      if (res.data.data?.addresses) updateUser({ addresses: res.data.data.addresses });
      toast.success('Đã xóa địa chỉ');
    },
    onError: () => toast.error('Không thể xóa địa chỉ'),
  });

  const setDefaultMut = useMutation({
    mutationFn: (index: number) =>
      api.patch<ApiResponse<User>>(`/users/me/addresses/${index}`, { isDefault: true }),
    onSuccess: (res) => {
      if (res.data.data?.addresses) updateUser({ addresses: res.data.data.addresses });
      toast.success('Đã đặt làm địa chỉ mặc định');
    },
    onError: () => toast.error('Không thể cập nhật'),
  });

  const handleSubmit = () => {
    if (!form.city || !form.ward || !form.street.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }
    if (editIndex !== null) {
      updateMut.mutate({ index: editIndex, data: form });
    } else {
      addMut.mutate(form);
    }
  };

  const isSubmitting = addMut.isPending || updateMut.isPending;

  if (!mounted || !user) return null;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>Hồ sơ của tôi</Typography>

      {/* ── Avatar & Info ──────────────────────────────────────────────────── */}
      <Card
        variant="outlined"
        sx={{
          borderRadius: 3,
          mb: 2,
          cursor: 'pointer',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          '&:hover': { borderColor: 'primary.main', boxShadow: '0 0 0 2px rgba(25,118,210,0.12)' },
        }}
        onClick={() => router.push('/profile/edit')}
      >
        <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
          <Avatar sx={{ width: 72, height: 72, fontSize: 28 }}>
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} fill style={{ objectFit: 'cover' }} sizes="72px" />
            ) : (
              user.name?.charAt(0).toUpperCase()
            )}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>{user.name}</Typography>
            <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            {user.phone && <Typography variant="body2" color="text.secondary">{user.phone}</Typography>}
          </Box>
          <ChevronRightIcon sx={{ color: 'text.disabled', flexShrink: 0 }} />
        </CardContent>
      </Card>

      {/* ── Menu ──────────────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <List disablePadding>
          <ListItemButton component={Link} href="/orders" sx={{ py: 1.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><ReceiptLongOutlinedIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
            <ListItemText primary="Đơn hàng của tôi" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
          </ListItemButton>
          <Divider />
          <ListItemButton onClick={() => setAddrOpen(true)} sx={{ py: 1.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><LocationOnOutlinedIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
            <ListItemText
              primary={<span style={{ fontWeight: 500 }}>Địa chỉ giao hàng</span>}
              secondary={user.addresses?.length ? `${user.addresses.length} địa chỉ đã lưu` : 'Chưa có địa chỉ'}
            />
            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
          </ListItemButton>
        </List>
      </Card>

      {/* ── Hỗ trợ ──────────────────────────────────────────────────────── */}
      <Card variant="outlined" sx={{ borderRadius: 3, mb: 2 }}>
        <List disablePadding>
          <ListItemButton component={Link} href="/contact" sx={{ py: 1.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><HeadsetMicOutlinedIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
            <ListItemText primary="Liên hệ hỗ trợ" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
          </ListItemButton>
          <Divider />
          <ListItemButton component={Link} href="/faq" sx={{ py: 1.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><HelpOutlineIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
            <ListItemText primary="Câu hỏi thường gặp" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
          </ListItemButton>
          <Divider />
          <ListItemButton component={Link} href="/order-guide" sx={{ py: 1.75 }}>
            <ListItemIcon sx={{ minWidth: 40 }}><MenuBookOutlinedIcon sx={{ color: 'primary.main' }} /></ListItemIcon>
            <ListItemText primary="Hướng dẫn đặt hàng" slotProps={{ primary: { sx: { fontWeight: 500 } } }} />
            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
          </ListItemButton>
        </List>
      </Card>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <ListItemButton onClick={() => { clearAuth(); router.push('/'); }} sx={{ py: 1.75 }}>
          <ListItemIcon sx={{ minWidth: 40 }}><LogoutIcon sx={{ color: 'error.main' }} /></ListItemIcon>
          <ListItemText primary="Đăng xuất" slotProps={{ primary: { sx: { fontWeight: 500, color: 'error.main' } } }} />
        </ListItemButton>
      </Card>

      {/* ── Address List Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={addrOpen}
        onClose={() => setAddrOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Địa chỉ giao hàng</DialogTitle>
        <DialogContent sx={{ px: 2 }}>
          {!user.addresses?.length ? (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 52, color: 'text.disabled', mb: 1.5 }} />
              <Typography color="text.secondary" variant="body2">Bạn chưa có địa chỉ nào</Typography>
            </Box>
          ) : (
            <Stack spacing={1.5} sx={{ mt: 0.5 }}>
              {user.addresses.map((addr, i) => (
                <Card
                  key={i}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    borderColor: addr.isDefault ? 'primary.main' : 'divider',
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        {addr.isDefault && (
                          <Chip
                            label="Mặc định"
                            size="small"
                            color="primary"
                            sx={{ mb: 0.75, height: 20, fontSize: '0.68rem', fontWeight: 600 }}
                          />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                          {addr.street}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {addr.ward}, {addr.city}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.25, flexShrink: 0, ml: 1 }}>
                        {!addr.isDefault && (
                          <IconButton
                            size="small"
                            onClick={() => setDefaultMut.mutate(i)}
                            disabled={setDefaultMut.isPending}
                            title="Đặt làm mặc định"
                          >
                            <StarBorderIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                          </IconButton>
                        )}
                        <IconButton size="small" onClick={() => openEdit(i, addr)}>
                          <EditOutlinedIcon fontSize="small" sx={{ color: 'primary.main' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => deleteMut.mutate(i)}
                          disabled={deleteMut.isPending}
                        >
                          <DeleteOutlineIcon fontSize="small" sx={{ color: 'error.main' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
          <Button onClick={() => setAddrOpen(false)} color="inherit">Đóng</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd}>
            Thêm địa chỉ
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Add / Edit Address Dialog ──────────────────────────────────────── */}
      <Dialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        fullWidth
        maxWidth="xs"
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editIndex !== null ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 0.5 }}>
            <Autocomplete
              options={provinces}
              getOptionLabel={(p) => p.name}
              value={selectedProvince}
              onChange={(_, val) => {
                setSelectedProvince(val);
                setSelectedWard(null);
                setForm((f) => ({ ...f, city: val?.name ?? '', ward: '' }));
              }}
              renderInput={(params) => <TextField {...params} label="Tỉnh / Thành phố" required />}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              noOptionsText="Không tìm thấy"
              loadingText="Đang tải..."
            />
            <Autocomplete
              options={wardOptions}
              getOptionLabel={(w) => w.name}
              value={selectedWard}
              onChange={(_, val) => {
                setSelectedWard(val);
                setForm((f) => ({ ...f, ward: val?.name ?? '' }));
              }}
              disabled={!selectedProvince}
              renderInput={(params) => <TextField {...params} label="Phường / Xã" required />}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              noOptionsText={selectedProvince ? 'Không tìm thấy' : 'Chọn tỉnh/thành trước'}
            />
            <TextField
              label="Số nhà, tên đường"
              value={form.street}
              onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
              required
              placeholder="VD: 123 Nguyễn Huệ"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.isDefault}
                  onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
                  size="small"
                />
              }
              label={<Typography variant="body2">Đặt làm địa chỉ mặc định</Typography>}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setFormOpen(false)} color="inherit">Hủy</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {editIndex !== null ? 'Lưu thay đổi' : 'Thêm địa chỉ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

