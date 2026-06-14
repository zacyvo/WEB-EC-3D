'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Paper, Chip, alpha, Divider, Button, Grid,
} from '@mui/material';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BatteryChargingFullOutlinedIcon from '@mui/icons-material/BatteryChargingFullOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FlareOutlinedIcon from '@mui/icons-material/FlareOutlined';
import ColorLensOutlinedIcon from '@mui/icons-material/ColorLensOutlined';

// ── Status indicator card ────────────────────────────────────────────────────

function LedStatusCard({
  ledOn,
  label,
  desc,
  image,
}: {
  ledOn: boolean;
  label: string;
  desc: string;
  image: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        borderRadius: 4,
        border: '1.5px solid',
        borderColor: ledOn ? alpha('#34C759', 0.35) : alpha('#636366', 0.2),
        overflow: 'hidden',
        bgcolor: ledOn ? alpha('#34C759', 0.03) : '#FAFAFA',
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3', bgcolor: '#F5F5F7' }}>
        <Image src={image} alt={label} fill style={{ objectFit: 'contain', padding: '16px' }} />
      </Box>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
              bgcolor: ledOn ? '#34C759' : '#636366',
              boxShadow: ledOn ? `0 0 8px ${alpha('#34C759', 0.7)}` : 'none',
            }}
          />
          <Typography variant="caption" sx={{ fontWeight: 700, color: ledOn ? '#34C759' : '#636366', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            LED xanh {ledOn ? 'sáng' : 'tắt'}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{desc}</Typography>
      </Box>
    </Paper>
  );
}

// ── Remote function row ──────────────────────────────────────────────────────

function RemoteFuncRow({
  icon,
  color,
  label,
  desc,
}: {
  icon: React.ReactNode;
  color: string;
  label: string;
  desc: string;
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
      <Box
        sx={{
          width: 40, height: 40, borderRadius: 2.5,
          bgcolor: alpha(color, 0.1),
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1, py: 0.25 }}>
        <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.25 }}>{label}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{desc}</Typography>
      </Box>
    </Box>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GuideRgbPage() {
  return (
    <>
      {/* ── Hero ── */}
      <Box
        sx={{
          background: 'linear-gradient(180deg, #F5F5F7 0%, #fff 100%)',
          pt: { xs: 7, md: 11 },
          pb: { xs: 5, md: 8 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ position: 'absolute', top: -60, left: '20%', width: 400, height: 400, borderRadius: '50%', background: alpha('#8B5CF6', 0.08), filter: 'blur(90px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 0, right: '15%', width: 300, height: 300, borderRadius: '50%', background: alpha('#007AFF', 0.07), filter: 'blur(80px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: -40, left: '40%', width: 250, height: 250, borderRadius: '50%', background: alpha('#34C759', 0.06), filter: 'blur(70px)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#8B5CF6', 0.1), color: '#8B5CF6',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <AutoAwesomeOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Đèn Nhiều Màu · Có Remote</Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 28, md: 46 }, letterSpacing: '-0.03em', mb: 2, lineHeight: 1.15 }}
          >
            Hướng dẫn sử dụng{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #007AFF 50%, #34C759 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              đèn nhiều màu
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 520, mx: 'auto', lineHeight: 1.7 }}
          >
            Đèn tích hợp công tắc cảm ứng và remote điều khiển — tùy chỉnh màu sắc, độ sáng và hiệu ứng chuyển màu ngay từ xa.
          </Typography>

          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 4, flexWrap: 'wrap', gap: 1 }}>
            {[
              { label: 'Nhiều màu RGB', color: '#8B5CF6' },
              { label: 'Remote điều khiển', color: '#007AFF' },
              { label: 'Hiệu ứng chuyển màu', color: '#34C759' },
            ].map(({ label, color }) => (
              <Chip
                key={label}
                label={label}
                size="small"
                sx={{ bgcolor: alpha(color, 0.08), color, fontWeight: 600, border: `1px solid ${alpha(color, 0.2)}` }}
              />
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pb: { xs: 10, md: 14 } }}>

        {/* ── Section 1: Khởi động lần đầu — tháo pin ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#FF3B30', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BatteryChargingFullOutlinedIcon sx={{ fontSize: 20, color: '#FF3B30' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Bước đầu tiên: Kích hoạt remote</Typography>
              <Typography variant="caption" color="text.secondary">Làm ngay trước khi sử dụng lần đầu</Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              border: `2px solid ${alpha('#FF3B30', 0.3)}`,
              bgcolor: alpha('#FF3B30', 0.03),
              overflow: 'hidden',
            }}
          >
            <Grid container>
              {/* Image */}
              <Grid size={{ xs: 12, sm: 5 }}>
                <Box sx={{ position: 'relative', width: '100%', height: { xs: 220, sm: '100%' }, minHeight: { sm: 260 }, bgcolor: '#F5F5F7' }}>
                  <Image
                    src="/img/guide/pull_out.png"
                    alt="Tháo lớp bảo vệ pin remote"
                    fill
                    style={{ objectFit: 'contain', padding: '24px' }}
                  />
                </Box>
              </Grid>

              {/* Text */}
              <Grid size={{ xs: 12, sm: 7 }}>
                <Box sx={{ p: { xs: 3, md: 4 } }}>
                  <Chip
                    label="Quan trọng"
                    size="small"
                    sx={{ bgcolor: alpha('#FF3B30', 0.1), color: '#FF3B30', fontWeight: 700, mb: 2, fontSize: 11 }}
                  />
                  <Typography variant="body1" sx={{ fontWeight: 700, mb: 1.5 }}>
                    Tháo lớp bảo vệ pin trước khi dùng
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                    Remote được xuất xưởng với một tấm nhựa mỏng cách ly pin để tránh hao pin trong quá trình vận chuyển. Hãy kéo tấm nhựa ra ngoài theo hướng mũi tên trước khi sử dụng.
                  </Typography>
                  <Stack spacing={1}>
                    {[
                      'Tìm khe hở nhỏ ở cạnh remote',
                      'Kéo tấm nhựa trong suốt ra ngoài',
                      'Remote sẽ hoạt động ngay lập tức',
                    ].map((step, i) => (
                      <Box key={step} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                            bgcolor: alpha('#FF3B30', 0.1),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#FF3B30' }}>{i + 1}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">{step}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        <Divider sx={{ mb: { xs: 6, md: 10 }, borderStyle: 'dashed' }} />

        {/* ── Section 2: Trạng thái LED ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#34C759', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PowerSettingsNewOutlinedIcon sx={{ fontSize: 20, color: '#34C759' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Trạng thái đèn</Typography>
              <Typography variant="caption" color="text.secondary">Nhìn vào đèn LED xanh để biết tình trạng</Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
            <LedStatusCard
              ledOn
              label="Đèn đang tắt"
              desc="Khi đèn LED xanh sáng lên, đèn chính đang ở trạng thái tắt — không phát sáng."
              image="/img/guide/status_off.png"
            />
            <LedStatusCard
              ledOn={false}
              label="Đèn đang sáng"
              desc="Khi đèn LED xanh tắt, đèn chính đang hoạt động và phát sáng bình thường."
              image="/img/guide/status_on.png"
            />
          </Stack>

          <Paper
            elevation={0}
            sx={{
              mt: 2.5, p: 2, borderRadius: 3,
              bgcolor: alpha('#007AFF', 0.04),
              border: `1px solid ${alpha('#007AFF', 0.15)}`,
              display: 'flex', gap: 1.5, alignItems: 'flex-start',
            }}
          >
            <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#007AFF', mt: 0.1, flexShrink: 0 }} />
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
              <strong style={{ color: '#1C1C1E' }}>Lưu ý: </strong>
              Đèn LED xanh ngược với trạng thái đèn chính — sáng LED = tắt đèn, tắt LED = đèn đang sáng.
            </Typography>
          </Paper>
        </Box>

        <Divider sx={{ mb: { xs: 6, md: 10 }, borderStyle: 'dashed' }} />

        {/* ── Section 3: Công tắc cảm ứng ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#007AFF', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TouchAppOutlinedIcon sx={{ fontSize: 20, color: '#007AFF' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Công tắc cảm ứng trên dây nguồn</Typography>
              <Typography variant="caption" color="text.secondary">Bật/tắt nhanh ngay tại dây nguồn</Typography>
            </Box>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, md: 3.5 }, borderRadius: 4,
              border: `1px solid ${alpha('#007AFF', 0.2)}`,
              bgcolor: alpha('#007AFF', 0.03),
            }}
          >
            <Stack spacing={2.5}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: 40, height: 40, borderRadius: 2.5, bgcolor: alpha('#007AFF', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <TouchAppOutlinedIcon sx={{ fontSize: 20, color: '#007AFF' }} />
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Chạm 1 lần</Typography>
                    <Chip label="Bật / Tắt đèn" size="small" sx={{ height: 18, fontSize: 10, bgcolor: alpha('#007AFF', 0.1), color: '#007AFF', fontWeight: 600 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    Bật hoặc tắt đèn. Khi bật lại, đèn sẽ khôi phục màu sắc và hiệu ứng cuối cùng đã dùng.
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'center', fontStyle: 'italic' }}>
                Để điều chỉnh màu sắc, độ sáng và hiệu ứng — sử dụng remote bên dưới
              </Typography>
            </Stack>
          </Paper>
        </Box>

        <Divider sx={{ mb: { xs: 6, md: 10 }, borderStyle: 'dashed' }} />

        {/* ── Section 4: Remote ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#8B5CF6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeOutlinedIcon sx={{ fontSize: 20, color: '#8B5CF6' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Remote điều khiển</Typography>
              <Typography variant="caption" color="text.secondary">Điều chỉnh đầy đủ màu sắc, độ sáng và hiệu ứng</Typography>
            </Box>
          </Box>

          <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
            {/* Remote image */}
            <Grid size={{ xs: 12, sm: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  border: '1.5px solid',
                  borderColor: alpha('#8B5CF6', 0.25),
                  overflow: 'hidden',
                  bgcolor: '#F5F5F7',
                  aspectRatio: '3/4',
                  position: 'relative',
                }}
              >
                <Image
                  src="/img/guide/remote.png"
                  alt="Remote điều khiển đèn nhiều màu"
                  fill
                  style={{ objectFit: 'contain', padding: '24px' }}
                />
              </Paper>
            </Grid>

            {/* Functions */}
            <Grid size={{ xs: 12, sm: 7 }}>
              <Stack spacing={3}>
                <RemoteFuncRow
                  icon={<ColorLensOutlinedIcon sx={{ fontSize: 20, color: '#8B5CF6' }} />}
                  color="#8B5CF6"
                  label="Chọn màu đèn"
                  desc="Nhấn trực tiếp vào các nút màu để chuyển đèn sang màu mong muốn — hỗ trợ toàn bộ dải màu RGB."
                />
                <RemoteFuncRow
                  icon={<TuneOutlinedIcon sx={{ fontSize: 20, color: '#007AFF' }} />}
                  color="#007AFF"
                  label="Điều chỉnh cường độ sáng"
                  desc='Nhấn nút "+" để tăng sáng, nhấn "−" để giảm sáng. Điều chỉnh mượt mà theo từng bậc.'
                />
                <RemoteFuncRow
                  icon={<FlareOutlinedIcon sx={{ fontSize: 20, color: '#34C759' }} />}
                  color="#34C759"
                  label="Hiệu ứng chuyển màu"
                  desc="Chọn chế độ hiệu ứng để đèn tự động chạy các dải màu, nhấp nháy nhịp nhàng hoặc chuyển màu dần dần."
                />
                <RemoteFuncRow
                  icon={<PowerSettingsNewOutlinedIcon sx={{ fontSize: 20, color: '#FF3B30' }} />}
                  color="#FF3B30"
                  label="Bật / Tắt từ xa"
                  desc="Nhấn nút Power trên remote để bật hoặc tắt đèn mà không cần chạm vào dây nguồn."
                />
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* ── Section 5: Lưu ý ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #F9F5FF 0%, #EAF3FF 100%)',
            border: `1.5px solid ${alpha('#8B5CF6', 0.2)}`,
            mb: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: alpha('#8B5CF6', 0.12),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <WarningAmberOutlinedIcon sx={{ color: '#8B5CF6', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>Lưu ý khi sử dụng</Typography>
              <Stack spacing={1.5}>
                {[
                  'Tháo tấm nhựa bảo vệ pin remote trước khi dùng lần đầu (xem hướng dẫn bước 1).',
                  'Giữ remote hướng thẳng về phía đèn, trong khoảng cách 5–8 mét để tín hiệu tốt nhất.',
                  'Tránh để remote bị ướt hoặc rơi mạnh — có thể làm hỏng module thu phát tín hiệu.',
                  'Nếu remote không phản hồi, thử thay pin CR2025 hoặc CR2032 (loại pin đồng hồ).',
                  'Cắm nguồn điện trước khi điều khiển bằng remote hoặc công tắc cảm ứng.',
                ].map((note) => (
                  <Box key={note} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#8B5CF6', mt: 0.75, flexShrink: 0 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>{note}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Box>
        </Paper>

        {/* ── Bottom CTA ── */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Cần thêm hỗ trợ?</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            Đội ngũ Luxe Glow luôn sẵn sàng hỗ trợ bạn từ 8:00 – 22:00 mỗi ngày.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'center' }}>
            <Button
              component={Link}
              href="/contact"
              variant="contained"
              sx={{ borderRadius: 980, px: 3, fontWeight: 600 }}
              endIcon={<ArrowForwardIcon />}
            >
              Liên hệ hỗ trợ
            </Button>
            <Button
              component={Link}
              href="/guide/den-3-mau"
              variant="outlined"
              sx={{ borderRadius: 980, px: 3 }}
            >
              Xem hướng dẫn đèn 3 màu
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
