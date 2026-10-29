'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';

/**
 * Hiển thị file PDF (văn bản hợp đồng admin import, hoá đơn điện tử…) bằng trình xem PDF của trình
 * duyệt. File tải qua API có xác thực (header X-Contract-Access / X-Einvoice-Access) nên không nhúng
 * URL trực tiếp được — tải về Blob rồi tạo object URL. Một số trình duyệt di động không hiển thị PDF
 * trong iframe → luôn kèm nút mở tab mới.
 */
export default function PdfDocumentViewer({
  load,
  reloadKey,
  title = 'Văn bản hợp đồng',
  openLabel = 'Mở hợp đồng trong tab mới',
  errorText = 'Không tải được file hợp đồng. Vui lòng bấm Tải lại.',
  fallback,
}: {
  load: () => Promise<Blob>;
  reloadKey?: string;
  title?: string;
  openLabel?: string;
  errorText?: string;
  /** Nội dung thay thế khi không tải được PDF (mặc định hiện errorText) */
  fallback?: ReactNode;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;
    setUrl(null);
    setError(false);
    load()
      .then((blob) => {
        objectUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
        if (!cancelled) setUrl(objectUrl);
      })
      .catch(() => { if (!cancelled) setError(true); });
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  if (error) {
    return fallback ?? (
      <Typography variant="body2" color="error" sx={{ p: 3, textAlign: 'center' }}>
        {errorText}
      </Typography>
    );
  }
  if (!url) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    );
  }
  return (
    <Stack spacing={1}>
      <Box
        component="iframe"
        src={url}
        title={title}
        sx={{ width: '100%', height: { xs: 560, md: 900 }, border: 0, bgcolor: '#fff', display: 'block' }}
      />
      <Button
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        startIcon={<OpenInNewOutlinedIcon />}
        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
      >
        {openLabel}
      </Button>
    </Stack>
  );
}
