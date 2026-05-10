'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box, Container, Typography, TextField, Button, Stack, Paper,
  IconButton, Chip, LinearProgress, CircularProgress, Alert,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';

const MAX_IMAGES = 3;
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface PreviewImage {
  file: File;
  previewUrl: string;
  uploading: boolean;
  uploadedUrl?: string;
  error?: string;
}

export default function CustomOrderPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => { setMounted(true); }, []);

  // Pre-fill from user profile
  useEffect(() => {
    if (user) {
      setContactName(user.name || '');
      setContactPhone(user.phone || '');
      setContactEmail(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/auth/login?redirect=/custom-order');
  }, [mounted, isAuthenticated, router]);

  const submitMutation = useMutation({
    mutationFn: async (payload: {
      content: string;
      images: string[];
      contactName: string;
      contactPhone: string;
      contactEmail: string;
    }) => {
      const res = await api.post('/custom-orders', payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Đã gửi yêu cầu thành công! Chúng tôi sẽ liên hệ sớm.');
      router.push('/custom-order/my-requests');
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg || 'Gửi yêu cầu thất bại');
    },
  });

  const uploadImage = async (preview: PreviewImage): Promise<string | null> => {
    const formData = new FormData();
    formData.append('files', preview.file);
    try {
      const res = await api.post<{ data: { urls: string[] } }>('/upload/custom-order-images', formData);
      return res.data.data.urls[0];
    } catch {
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);

    for (const file of toAdd) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(`${file.name} vượt quá ${MAX_FILE_SIZE_MB}MB`);
        continue;
      }

      const previewUrl = URL.createObjectURL(file);
      const newImage: PreviewImage = { file, previewUrl, uploading: true };
      setImages((prev) => [...prev, newImage]);

      const uploadedUrl = await uploadImage(newImage);

      setImages((prev) =>
        prev.map((img) =>
          img.previewUrl === previewUrl
            ? { ...img, uploading: false, uploadedUrl: uploadedUrl ?? undefined, error: uploadedUrl ? undefined : 'Upload thất bại' }
            : img,
        ),
      );
    }
  };

  const handleRemoveImage = (previewUrl: string) => {
    setImages((prev) => {
      const target = prev.find((img) => img.previewUrl === previewUrl);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((img) => img.previewUrl !== previewUrl);
    });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!content.trim() || content.trim().length < 10) errs.content = 'Nội dung phải có ít nhất 10 ký tự';
    if (!contactName.trim()) errs.contactName = 'Vui lòng nhập họ tên';
    if (!contactPhone.trim()) errs.contactPhone = 'Vui lòng nhập số điện thoại';
    if (!contactEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) errs.contactEmail = 'Email không hợp lệ';
    if (images.some((img) => img.uploading)) errs.images = 'Vui lòng chờ ảnh tải xong';
    if (images.some((img) => img.error)) errs.images = 'Một số ảnh tải lên thất bại, xóa và thử lại';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitMutation.mutate({
      content: content.trim(),
      images: images.filter((i) => i.uploadedUrl).map((i) => i.uploadedUrl!),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      contactEmail: contactEmail.trim(),
    });
  };

  if (!mounted || !isAuthenticated) return null;

  const isUploading = images.some((img) => img.uploading);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <IconButton component={Link} href="/" size="small" sx={{ color: 'text.secondary' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Đặt sản phẩm theo yêu cầu
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Mô tả ý tưởng của bạn, chúng tôi sẽ tư vấn và báo giá
          </Typography>
        </Box>
      </Box>

      {/* Link to my requests */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          component={Link}
          href="/custom-order/my-requests"
          startIcon={<ReceiptLongOutlinedIcon />}
          size="small"
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Yêu cầu của tôi
        </Button>
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Content */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nội dung yêu cầu <span style={{ color: '#EF4444' }}>*</span>
              </Typography>
              <TextField
                multiline
                rows={5}
                fullWidth
                placeholder="Mô tả chi tiết mẫu bạn muốn: kích thước, màu sắc, chất liệu, hình dạng, mục đích sử dụng..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                error={!!errors.content}
                helperText={errors.content || `${content.length}/2000 ký tự`}
                slotProps={{ htmlInput: { maxLength: 2000 } }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Box>

            {/* Image upload */}
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
                Hình ảnh tham khảo
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  (tối đa {MAX_IMAGES} ảnh, mỗi ảnh không quá {MAX_FILE_SIZE_MB}MB)
                </Typography>
              </Typography>

              {errors.images && (
                <Alert severity="error" sx={{ mb: 1.5, borderRadius: 2 }}>{errors.images}</Alert>
              )}

              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                {images.map((img) => (
                  <Box
                    key={img.previewUrl}
                    sx={{
                      position: 'relative', width: 96, height: 96,
                      borderRadius: 2, overflow: 'hidden',
                      border: '1px solid', borderColor: img.error ? 'error.main' : 'divider',
                    }}
                  >
                    <Image src={img.previewUrl} alt="preview" fill style={{ objectFit: 'cover' }} />
                    {img.uploading && (
                      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={24} sx={{ color: '#fff' }} />
                      </Box>
                    )}
                    {img.error && (
                      <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(239,68,68,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography variant="caption" color="error" sx={{ px: 0.5, textAlign: 'center', fontSize: 9 }}>Lỗi</Typography>
                      </Box>
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(img.previewUrl)}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: 'rgba(0,0,0,0.5)', color: '#fff', p: 0.3, '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  </Box>
                ))}

                {images.length < MAX_IMAGES && (
                  <Box
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      width: 96, height: 96, borderRadius: 2,
                      border: '2px dashed', borderColor: 'divider',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', gap: 0.5,
                      '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.50' },
                      transition: 'all 0.15s',
                    }}
                  >
                    <AddPhotoAlternateOutlinedIcon sx={{ color: 'text.disabled', fontSize: 28 }} />
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: 10 }}>Thêm ảnh</Typography>
                  </Box>
                )}
              </Box>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>

            {/* Divider */}
            <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Thông tin liên hệ
              </Typography>
              <Stack spacing={4}>
                <TextField
                  label="Họ và tên"
                  fullWidth
                  size="small"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  error={!!errors.contactName}
                  helperText={errors.contactName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  label="Số điện thoại"
                  fullWidth
                  size="small"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  error={!!errors.contactPhone}
                  helperText={errors.contactPhone}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
                <TextField
                  label="Email"
                  fullWidth
                  size="small"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Stack>
            </Box>

            {isUploading && (
              <Box>
                <Typography variant="caption" color="text.secondary">Đang tải ảnh lên...</Typography>
                <LinearProgress sx={{ mt: 0.5, borderRadius: 1 }} />
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={submitMutation.isPending || isUploading}
              startIcon={submitMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <BrushOutlinedIcon />}
              sx={{ borderRadius: 2.5, py: 1.5, fontWeight: 600, fontSize: '1rem' }}
            >
              {submitMutation.isPending ? 'Đang gửi...' : 'Gửi yêu cầu'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
