'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Alert, Button, Paper, Stack, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import SignatureCanvas from './SignatureCanvas';
import type { PartyASignature, PublicContract } from './ContractDocument';
import { contractApi, downloadBlob, errMsg } from './contractApi';

/**
 * Bên A ký văn bản (hợp đồng hoặc phụ lục) — chữ ký số PKI (tải file đã có chữ ký Bên B về, ký
 * bằng USB token rồi tải lên) hoặc chữ ký điện tử đơn giản (canvas). Endpoint theo `basePath`:
 * `/contracts/public/:token` (hợp đồng) hoặc `/contracts/public/:token/addenda/:id` (phụ lục).
 */
export default function DocumentSigningSection({
  basePath,
  partyASignature,
  downloadFileName,
  defaultSignerName,
  authHeaders,
  onSigned,
  title = 'Ký hợp đồng',
  signedTitle = 'Chữ ký của bạn (Bên A)',
  description = 'Cửa hàng đã ký hợp đồng này bằng chữ ký số. Bạn có thể ký xác nhận bằng chữ ký số của mình (nếu có USB token), hoặc ký xác nhận đơn giản.',
  embedded = false,
}: {
  basePath: string;
  partyASignature?: PartyASignature;
  downloadFileName: string;
  defaultSignerName?: string;
  authHeaders: Record<string, string> | undefined;
  onSigned: (c: PublicContract) => void;
  title?: string;
  signedTitle?: string;
  description?: string;
  /** Hiển thị lồng trong khối khác (không viền Paper riêng) */
  embedded?: boolean;
}) {
  const [mode, setMode] = useState<'choose' | 'pki' | 'simple'>('choose');
  const [uploadingPki, setUploadingPki] = useState(false);
  const [submittingSimple, setSubmittingSimple] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const paperSx = embedded
    ? { p: { xs: 1.5, md: 2 }, borderRadius: 3, bgcolor: 'grey.50' }
    : { p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' };

  const uploadPki = async (file: File) => {
    setUploadingPki(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await contractApi.post(`${basePath}/document/party-a-signed`, form, {
        headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
      });
      onSigned(res.data.data);
      toast.success('Đã xác thực chữ ký số của bạn');
    } catch (err) {
      toast.error(errMsg(err, 'Tải lên file đã ký thất bại'));
    } finally {
      setUploadingPki(false);
    }
  };

  const submitSimple = async (canvasImageBase64: string, confirmedName: string) => {
    setSubmittingSimple(true);
    try {
      const res = await contractApi.post(
        `${basePath}/document/party-a-simple-signature`,
        { canvasImageBase64, confirmedName },
        { headers: authHeaders },
      );
      onSigned(res.data.data);
      toast.success('Đã ghi nhận xác nhận của bạn');
    } catch (err) {
      toast.error(errMsg(err, 'Xác nhận chữ ký thất bại'));
    } finally {
      setSubmittingSimple(false);
    }
  };

  if (partyASignature?.status === 'VERIFIED') {
    return (
      <Paper elevation={0} sx={paperSx}>
        <Typography sx={{ fontWeight: 700, mb: 1.5 }}>{signedTitle}</Typography>
        {partyASignature.mode === 'SIMPLE' ? (
          <Stack spacing={1}>
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              Chữ ký điện tử đơn giản — không phải chữ ký số PKI.
            </Alert>
            <Typography variant="body2">
              Xác nhận bởi <b>{partyASignature.simpleSignature?.confirmedName}</b>
              {partyASignature.simpleSignature?.confirmedAt
                ? ` lúc ${new Date(partyASignature.simpleSignature.confirmedAt).toLocaleString('vi-VN')}` : ''}
            </Typography>
            {partyASignature.simpleSignature?.canvasImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={partyASignature.simpleSignature.canvasImageUrl}
                alt="Chữ ký của bạn"
                style={{ height: 60, border: '1px solid #e5e7eb', borderRadius: 8, background: '#fff', alignSelf: 'flex-start' }}
              />
            )}
          </Stack>
        ) : (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <VerifiedUserOutlinedIcon color="success" fontSize="small" />
            <Typography variant="body2">
              Đã ký bằng chữ ký số — {partyASignature.signerCertCN || 'đã xác thực'}
            </Typography>
          </Stack>
        )}
      </Paper>
    );
  }

  return (
    <Paper elevation={0} sx={paperSx}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
        <Link href="/contract/huong-dan-ky" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
            Xem hướng dẫn ký →
          </Typography>
        </Link>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      {partyASignature?.status === 'REJECTED' && partyASignature.rejectReason && (
        <Alert severity="error" sx={{ borderRadius: 3, mb: 2 }}>
          Chữ ký trước đó không hợp lệ: {partyASignature.rejectReason}. Vui lòng ký lại.
        </Alert>
      )}

      {mode === 'choose' && (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<VerifiedUserOutlinedIcon />}
            onClick={() => setMode('pki')}
            sx={{ textTransform: 'none', borderRadius: 3, flex: 1 }}
          >
            Tôi có chữ ký số (USB token)
          </Button>
          <Button
            variant="outlined"
            startIcon={<GestureOutlinedIcon />}
            onClick={() => setMode('simple')}
            sx={{ textTransform: 'none', borderRadius: 3, flex: 1 }}
          >
            Tôi không có — ký đơn giản
          </Button>
        </Stack>
      )}

      {mode === 'pki' && (
        <Stack spacing={1.5}>
          <Typography variant="body2" color="text.secondary">
            1. Tải file PDF bên dưới về máy. 2. Ký bằng phần mềm ký số của bạn (đã cắm USB token).
            3. Tải file đã ký lên đây.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={() =>
                downloadBlob(`${basePath}/document/to-sign`, downloadFileName, authHeaders)
                  .catch((err) => toast.error(errMsg(err, 'Tải file thất bại')))}
              sx={{ textTransform: 'none', borderRadius: 3 }}
            >
              Tải file cần ký
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadPki(file);
                e.target.value = '';
              }}
            />
            <Button
              variant="contained"
              startIcon={<UploadFileOutlinedIcon />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPki}
              sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}
            >
              {uploadingPki ? 'Đang tải lên & xác thực...' : 'Tải lên file đã ký'}
            </Button>
          </Stack>
          <Button size="small" onClick={() => setMode('choose')} sx={{ textTransform: 'none', alignSelf: 'flex-start' }}>
            ← Quay lại
          </Button>
        </Stack>
      )}

      {mode === 'simple' && (
        <Stack spacing={1.5}>
          <SignatureCanvas
            defaultName={defaultSignerName}
            submitting={submittingSimple}
            onSubmit={submitSimple}
          />
          <Button size="small" onClick={() => setMode('choose')} sx={{ textTransform: 'none', alignSelf: 'flex-start' }}>
            ← Quay lại
          </Button>
        </Stack>
      )}
    </Paper>
  );
}
