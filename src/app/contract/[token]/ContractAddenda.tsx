'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Chip, Collapse, Divider, Paper, Stack, Typography } from '@mui/material';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import { formatCurrency } from '@/lib/utils';
import PdfDocumentViewer from '@/components/pdf/PdfDocumentViewer';
import DocumentSigningSection from './DocumentSigningSection';
import type { PublicContract, PublicContractAddendum } from './ContractDocument';
import { contractApi, downloadBlob, errMsg } from './contractApi';

const label = (no: number) => `Phụ lục số ${String(no).padStart(2, '0')}`;

function AddendumCard({
  token, contract, addendum, authHeaders, onSigned,
}: {
  token: string;
  contract: PublicContract;
  addendum: PublicContractAddendum;
  authHeaders: Record<string, string> | undefined;
  onSigned: (c: PublicContract) => void;
}) {
  const [showPdf, setShowPdf] = useState(false);
  const cancelled = addendum.status === 'CANCELLED';
  const basePath = `/contracts/public/${token}/addenda/${addendum._id}`;
  const fileBase = `phu-luc-${String(addendum.addendumNo).padStart(2, '0')}-hop-dong-${contract.contractNo.replace(/\//g, '-')}`;
  const partyBSigned = addendum.partyBSignature?.status === 'VERIFIED';
  const canSign = !cancelled && partyBSigned && contract.status !== 'CLOSED';
  // Đổi khi có chữ ký mới → viewer tải lại bản PDF mới nhất
  const pdfVersion = [addendum._id, addendum.partyBSignature?.status, addendum.partyASignature?.status].join('|');

  return (
    <Paper
      elevation={0}
      sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200', opacity: cancelled ? 0.75 : 1 }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography sx={{ fontWeight: 700, textDecoration: cancelled ? 'line-through' : 'none' }}>
            {label(addendum.addendumNo)}
          </Typography>
          <Chip
            size="small"
            color={cancelled ? 'error' : 'primary'}
            label={cancelled ? 'Đã hủy' : 'Đã chốt'}
            sx={{ fontWeight: 600 }}
          />
          {!cancelled && (
            <Chip
              size="small"
              variant="outlined"
              color={addendum.partyASignature?.status === 'VERIFIED' ? 'success' : partyBSigned ? 'warning' : 'default'}
              label={
                addendum.partyASignature?.status === 'VERIFIED' ? 'Hai bên đã ký'
                  : partyBSigned ? 'Chờ bạn ký' : 'Chờ cửa hàng ký'
              }
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ fontWeight: 800, color: cancelled ? 'text.disabled' : '#2563EB' }}>
            {addendum.amount > 0 ? `+ ${formatCurrency(addendum.amount)}` : 'Không phát sinh chi phí'}
          </Typography>
        </Stack>
        {addendum.title && <Typography variant="body2" color="text.secondary">{addendum.title}</Typography>}
        {cancelled && (
          <Typography variant="body2" color="error">
            Phụ lục đã bị hủy{addendum.cancelReason ? ` — lý do: ${addendum.cancelReason}` : ''}. Giá trị không còn tính vào tổng thanh toán.
          </Typography>
        )}

        {addendum.items.length > 0 && (
          <Stack divider={<Divider flexItem />} spacing={1}>
            {addendum.items.map((item, i) => (
              <Stack key={i} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{item.productName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.productCode ? `Mã ${item.productCode} · ` : ''}SL {item.quantity} × {formatCurrency(item.unitPrice)}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>{formatCurrency(item.subtotal)}</Typography>
              </Stack>
            ))}
          </Stack>
        )}
        {addendum.content && (
          <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>{addendum.content}</Typography>
        )}
        {!cancelled && addendum.amount > 0 && (
          <Box>
            {addendum.paymentSchedule.map((s, i) => (
              <Typography key={i} variant="caption" color="text.secondary" component="p">
                {addendum.paymentSchedule.length > 1 ? `Lần ${i + 1}: ` : 'Thanh toán: '}
                {s.percent}% ({formatCurrency(Math.round((addendum.amount * s.percent) / 100))}) — {s.timing}
              </Typography>
            ))}
          </Box>
        )}
        {addendum.deliveryDate && (
          <Typography variant="caption" color="text.secondary">
            Ngày giao: {new Date(addendum.deliveryDate).toLocaleDateString('vi-VN')}
          </Typography>
        )}

        {addendum.hasPdf && (
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Button
              size="small"
              variant="outlined"
              startIcon={showPdf ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              onClick={() => setShowPdf((v) => !v)}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {showPdf ? 'Ẩn văn bản phụ lục' : 'Xem văn bản phụ lục'}
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<DownloadOutlinedIcon />}
              onClick={() =>
                downloadBlob(`${basePath}/document/view`, `${fileBase}.pdf`, authHeaders)
                  .catch((err) => toast.error(errMsg(err, 'Tải file thất bại')))}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              Tải PDF
            </Button>
          </Stack>
        )}
        <Collapse in={showPdf} unmountOnExit>
          <Box sx={{ bgcolor: 'grey.100', p: { xs: 1, md: 2 }, borderRadius: 2 }}>
            <PdfDocumentViewer
              load={async () =>
                (await contractApi.get(`${basePath}/document/view`, { headers: authHeaders, responseType: 'blob', timeout: 60000 })).data as Blob}
              reloadKey={pdfVersion}
              title={label(addendum.addendumNo)}
              openLabel="Mở phụ lục trong tab mới"
              errorText="Không tải được file phụ lục. Vui lòng bấm Tải lại."
            />
          </Box>
        </Collapse>

        {canSign && (
          <DocumentSigningSection
            embedded
            basePath={basePath}
            partyASignature={addendum.partyASignature}
            downloadFileName={`${fileBase}-can-ky.pdf`}
            defaultSignerName={contract.partyA?.representative || contract.partyA?.name}
            authHeaders={authHeaders}
            onSigned={onSigned}
            title={`Ký ${label(addendum.addendumNo)}`}
            signedTitle={`Chữ ký của bạn trên ${label(addendum.addendumNo)}`}
            description="Cửa hàng đã ký phụ lục này bằng chữ ký số. Bạn ký xác nhận bằng chữ ký số của mình (nếu có USB token), hoặc ký xác nhận đơn giản."
          />
        )}
      </Stack>
    </Paper>
  );
}

/**
 * Phụ lục hợp đồng phía khách — sửa đổi, bổ sung (mua thêm, gia công thêm) sau khi hợp đồng đã
 * chốt. Tổng thanh toán = giá trị hợp đồng gốc + các phụ lục đã chốt.
 */
export default function ContractAddenda({
  token, contract, authHeaders, onSigned,
}: {
  token: string;
  contract: PublicContract;
  authHeaders: Record<string, string> | undefined;
  onSigned: (c: PublicContract) => void;
}) {
  const addenda = contract.addenda ?? [];
  if (addenda.length === 0) return null;
  const finalAddenda = addenda.filter((a) => a.status === 'FINAL');

  return (
    <Stack spacing={2}>
      <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, border: '1px solid', borderColor: 'grey.200' }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1.5 }}>
          <PostAddOutlinedIcon sx={{ color: '#2563EB' }} fontSize="small" />
          <Typography sx={{ fontWeight: 700 }}>Phụ lục hợp đồng & tổng thanh toán</Typography>
        </Stack>
        <Stack spacing={0.75}>
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Giá trị hợp đồng ban đầu</Typography>
            <Typography variant="body2">{formatCurrency(contract.totalAmount)}</Typography>
          </Stack>
          {finalAddenda.map((a) => (
            <Stack key={a._id} direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">+ {label(a.addendumNo)}</Typography>
              <Typography variant="body2">{formatCurrency(a.amount)}</Typography>
            </Stack>
          ))}
          <Divider />
          <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
            <Typography sx={{ fontWeight: 700 }}>Tổng giá trị thanh toán</Typography>
            <Typography sx={{ fontWeight: 800, color: '#2563EB' }}>
              {formatCurrency(contract.grandTotalAmount ?? contract.totalAmount)}
            </Typography>
          </Stack>
        </Stack>
      </Paper>
      {[...addenda].sort((x, y) => x.addendumNo - y.addendumNo).map((a) => (
        <AddendumCard key={a._id} token={token} contract={contract} addendum={a} authHeaders={authHeaders} onSigned={onSigned} />
      ))}
    </Stack>
  );
}
