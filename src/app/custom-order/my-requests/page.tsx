'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Box, Container, Typography, Card, CardContent, CardActionArea,
  Chip, Skeleton, Stack, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, Grid,
} from '@mui/material';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';
import api from '@/lib/api';
import { formatDate, CUSTOM_ORDER_STATUS_MAP } from '@/lib/utils';
import type { ApiResponse, CustomOrder } from '@/types';

export default function MyCustomRequestsPage() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [detail, setDetail] = useState<CustomOrder | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) router.replace('/auth/login?redirect=/custom-order/my-requests');
  }, [mounted, isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ['custom-orders-user'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<{ data: CustomOrder[] }>>('/custom-orders');
      return res.data.data.data;
    },
    enabled: isAuthenticated,
  });

  if (!mounted) return null;

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 7 }}>
        <Stack spacing={2}>{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} variant="rounded" height={110} sx={{ borderRadius: 3 }} />)}</Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 7 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <IconButton component={Link} href="/custom-order" size="small" sx={{ color: 'text.secondary' }}>
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Yêu cầu tuỳ chỉnh của tôi</Typography>
      </Box>

      {!data?.length ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
            <BrushOutlinedIcon sx={{ fontSize: 40, color: 'grey.300' }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Chưa có yêu cầu nào</Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>Hãy gửi ý tưởng của bạn, chúng tôi sẽ tư vấn và báo giá</Typography>
          <Button component={Link} href="/custom-order" variant="contained">Tạo yêu cầu mới</Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button component={Link} href="/custom-order" variant="outlined" size="small" sx={{ borderRadius: 2 }}>
              + Tạo yêu cầu mới
            </Button>
          </Box>
          {data.map((req) => {
            const statusInfo = CUSTOM_ORDER_STATUS_MAP[req.status] || { label: req.status, chipSx: {} };
            return (
              <Card key={req._id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardActionArea onClick={() => setDetail(req)} sx={{ p: 0 }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                          #{req._id.slice(-8).toUpperCase()}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">{formatDate(req.createdAt)}</Typography>
                      </Box>
                      <Chip label={statusInfo.label} size="small" variant="outlined" sx={statusInfo.chipSx} />
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: req.images.length ? 1.5 : 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {req.content}
                    </Typography>
                    {req.images.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.75 }}>
                        {req.images.slice(0, 3).map((url, i) => (
                          <Box key={i} sx={{ position: 'relative', width: 48, height: 48, borderRadius: 1.5, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                            <Image src={url} alt="" fill style={{ objectFit: 'cover' }} />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detail} onClose={() => setDetail(null)} maxWidth="sm" fullWidth slotProps={{ paper: { sx: { borderRadius: 3 } } }}>
        {detail && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Chi tiết yêu cầu</Typography>
                <Typography variant="caption" color="text.disabled">#{detail._id.slice(-8).toUpperCase()}</Typography>
              </Box>
              <IconButton onClick={() => setDetail(null)} size="small"><CloseIcon /></IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={2.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Trạng thái</Typography>
                  <Chip
                    label={CUSTOM_ORDER_STATUS_MAP[detail.status]?.label ?? detail.status}
                    size="small"
                    variant="outlined"
                    sx={CUSTOM_ORDER_STATUS_MAP[detail.status]?.chipSx}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Nội dung yêu cầu</Typography>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{detail.content}</Typography>
                </Box>

                {detail.images.length > 0 && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>Hình ảnh tham khảo</Typography>
                    <Grid container spacing={1}>
                      {detail.images.map((url, i) => (
                        <Grid size={4} key={i}>
                          <Box sx={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                            <Image src={url} alt="" fill style={{ objectFit: 'cover' }} sizes="33vw" />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}

                {detail.adminNote && (
                  <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>Ghi chú từ shop</Typography>
                    <Typography variant="body2">{detail.adminNote}</Typography>
                  </Box>
                )}

                {detail.cancelReason && (
                  <Box sx={{ p: 1.5, bgcolor: '#FEF2F2', borderRadius: 2 }}>
                    <Typography variant="caption" color="error.main" sx={{ display: 'block', mb: 0.5 }}>Lý do hủy</Typography>
                    <Typography variant="body2" color="error.main">{detail.cancelReason}</Typography>
                  </Box>
                )}

                <Box sx={{ p: 1.5, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75 }}>Thông tin liên hệ</Typography>
                  <Stack spacing={0.5}>
                    <Typography variant="body2"><strong>Tên:</strong> {detail.contactName}</Typography>
                    <Typography variant="body2"><strong>SĐT:</strong> {detail.contactPhone}</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {detail.contactEmail}</Typography>
                  </Stack>
                </Box>

                <Typography variant="caption" color="text.disabled">Ngày gửi: {formatDate(detail.createdAt)}</Typography>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
              <Button onClick={() => setDetail(null)} sx={{ borderRadius: 2 }}>Đóng</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}
