'use client';

import { Accordion, AccordionDetails, AccordionSummary, Box, Chip, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { formatCurrency } from '@/lib/utils';
import EInvoiceDetailView, {
  EINVOICE_STATUS_META,
  downloadEInvoiceFile,
  formatInvoiceDate,
  type EInvoiceFileFormat,
  type PublicEInvoice,
} from '@/components/einvoice/EInvoiceDetailView';

/** Hoá đơn liên kết hợp đồng — `token` để tải file qua phiên của hợp đồng */
export interface ContractEInvoice extends PublicEInvoice {
  token: string;
}

/**
 * Tab "Hoá đơn điện tử" trên trang hợp đồng. Hoá đơn liên kết hợp đồng dùng chung khoá với hợp đồng
 * nên khách xem/tải trực tiếp bằng phiên đã xác thực của hợp đồng, không phải nhập khoá lại.
 */
export default function ContractEInvoices({
  apiUrl,
  contractToken,
  authHeaders,
  invoices,
}: {
  apiUrl: string;
  contractToken: string;
  authHeaders: Record<string, string>;
  invoices: ContractEInvoice[];
}) {
  const download = (inv: ContractEInvoice) => (format: EInvoiceFileFormat) =>
    downloadEInvoiceFile(
      `${apiUrl}/contracts/public/${contractToken}/einvoices/${inv.token}/download?format=${format}`,
      authHeaders,
      `${inv.localStatus === 'DRAFT' ? 'ban-nhap-hoa-don' : 'hoa-don'}-${inv.invoiceNo || inv.token.slice(0, 8)}.${format}`,
    );

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary">
        Hoá đơn điện tử lập cho hợp đồng này, nội dung trùng khớp với hoá đơn PDF/XML đã đăng ký với cơ quan thuế.
      </Typography>
      {invoices.map((inv, i) => {
        const status = EINVOICE_STATUS_META[inv.localStatus];
        return (
          <Accordion
            key={inv.token}
            defaultExpanded={i === 0}
            disableGutters
            elevation={0}
            sx={{ borderRadius: '16px !important', border: '1px solid', borderColor: 'grey.200', '&:before': { display: 'none' } }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: { xs: 2, md: 3 } }}>
              <Stack direction="row" spacing={1.5} useFlexGap sx={{ alignItems: 'center', flexWrap: 'wrap', width: '100%', pr: 1 }}>
                <ReceiptLongOutlinedIcon sx={{ color: '#2563EB' }} />
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    Hoá đơn {inv.invoiceNo ? `số ${inv.invoiceNo}` : inv.localStatus === 'DRAFT' ? '(bản nháp)' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Ngày lập {formatInvoiceDate(inv.arisingDate)}
                  </Typography>
                </Box>
                <Chip size="small" color={status.color} label={status.label} sx={{ fontWeight: 600 }} />
                <Box sx={{ flexGrow: 1 }} />
                <Typography sx={{ fontWeight: 800, color: '#2563EB' }}>{formatCurrency(inv.totalAmount)}</Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 2, md: 3 }, pb: 3 }}>
              <EInvoiceDetailView invoice={inv} onDownload={download(inv)} />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Stack>
  );
}
