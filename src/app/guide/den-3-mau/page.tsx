'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Box, Container, Typography, Stack, Paper, Chip, alpha, Divider, Button,
} from '@mui/material';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import TouchAppOutlinedIcon from '@mui/icons-material/TouchAppOutlined';
import BrightnessAutoOutlinedIcon from '@mui/icons-material/BrightnessAutoOutlined';
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

// ── Status indicator (LED xanh) ──────────────────────────────────────────────

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
        transition: 'all 0.2s',
      }}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '4/3', bgcolor: '#F5F5F7' }}>
        <Image
          src={image}
          alt={label}
          fill
          style={{ objectFit: 'contain', padding: '16px' }}
        />
      </Box>

      <Box sx={{ p: 2.5 }}>
        {/* LED indicator */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: ledOn ? '#34C759' : '#636366',
              boxShadow: ledOn ? `0 0 8px ${alpha('#34C759', 0.7)}` : 'none',
              flexShrink: 0,
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

// ── Action step card ─────────────────────────────────────────────────────────

function ActionCard({
  icon,
  color,
  title,
  desc,
  badge,
}: {
  icon: React.ReactNode;
  color: string;
  title: string;
  desc: string;
  badge?: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: '1px solid',
        borderColor: alpha(color, 0.2),
        bgcolor: alpha(color, 0.03),
        display: 'flex',
        gap: 2,
        alignItems: 'flex-start',
        transition: 'border-color 0.2s',
        '&:hover': { borderColor: alpha(color, 0.4) },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2.5,
          bgcolor: alpha(color, 0.1),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography>
          {badge && (
            <Chip
              label={badge}
              size="small"
              sx={{ height: 18, fontSize: 10, bgcolor: alpha(color, 0.1), color, fontWeight: 600 }}
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>{desc}</Typography>
      </Box>
    </Paper>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function Guide3ColorPage() {
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
        {/* Glow blobs */}
        <Box sx={{ position: 'absolute', top: -60, left: '30%', width: 400, height: 400, borderRadius: '50%', background: alpha('#FFD60A', 0.08), filter: 'blur(90px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', top: 0, right: '20%', width: 300, height: 300, borderRadius: '50%', background: alpha('#FF9F0A', 0.07), filter: 'blur(80px)', pointerEvents: 'none' }} />

        <Container maxWidth="md" sx={{ position: 'relative' }}>
          {/* Badge */}
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              bgcolor: alpha('#FF9500', 0.1), color: '#FF9500',
              px: 2.5, py: 0.75, borderRadius: 980, mb: 3,
            }}
          >
            <LightbulbOutlinedIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 600 }}>Đèn 3 Màu · Không Remote</Typography>
          </Box>

          <Typography
            variant="h2"
            sx={{ fontWeight: 700, fontSize: { xs: 28, md: 46 }, letterSpacing: '-0.03em', mb: 2, lineHeight: 1.15 }}
          >
            Hướng dẫn sử dụng{' '}
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF9500 0%, #FFD60A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              đèn 3 màu
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 500, mx: 'auto', lineHeight: 1.7 }}
          >
            Đèn được trang bị dây nguồn tích hợp công tắc cảm ứng — chạm nhẹ để chuyển màu và điều chỉnh độ sáng.
          </Typography>

          {/* Stat chips */}
          <Stack direction="row" spacing={2} sx={{ justifyContent: 'center', mt: 4, flexWrap: 'wrap', gap: 1 }}>
            {[
              { label: '3 màu ánh sáng', color: '#FF9500' },
              { label: 'Công tắc cảm ứng', color: '#007AFF' },
              { label: 'Lưu cường độ tự động', color: '#34C759' },
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

        {/* ── Section 1: Trạng thái LED ── */}
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

        {/* ── Section 2: Cách sử dụng công tắc ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha('#007AFF', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TouchAppOutlinedIcon sx={{ fontSize: 20, color: '#007AFF' }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>Điều khiển bằng cảm ứng</Typography>
              <Typography variant="caption" color="text.secondary">Chạm vào công tắc trên dây nguồn</Typography>
            </Box>
          </Box>

          <Stack spacing={2}>
            <ActionCard
              icon={<TouchAppOutlinedIcon sx={{ fontSize: 22, color: '#007AFF' }} />}
              color="#007AFF"
              title="Chạm 1 lần"
              desc="Chuyển tuần tự qua các chế độ: Trắng → Vàng → Ấm → Tắt. Chạm thêm 1 lần để quay lại từ đầu."
              badge="Đổi màu / Tắt"
            />
            <ActionCard
              icon={<BrightnessAutoOutlinedIcon sx={{ fontSize: 22, color: '#FF9500' }} />}
              color="#FF9500"
              title="Chạm và giữ"
              desc="Giữ ngón tay trên công tắc để tăng hoặc giảm cường độ ánh sáng. Thả tay khi đạt mức độ sáng mong muốn."
              badge="Điều chỉnh độ sáng"
            />
            <ActionCard
              icon={<MemoryOutlinedIcon sx={{ fontSize: 22, color: '#34C759' }} />}
              color="#34C759"
              title="Lưu tự động theo màu"
              desc="Đèn ghi nhớ cường độ ánh sáng riêng biệt cho từng màu (Trắng, Vàng, Ấm). Lần sau bật lại, đèn sẽ tự khôi phục đúng độ sáng đã lưu."
              badge="Thông minh"
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: { xs: 6, md: 10 }, borderStyle: 'dashed' }} />

        {/* ── Section 3: Sơ đồ chế độ ── */}
        <Box sx={{ mb: { xs: 6, md: 10 } }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Sơ đồ chuyển đổi màu</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
            Mỗi lần chạm 1 lần vào công tắc, đèn chuyển sang chế độ tiếp theo theo vòng tuần tự.
          </Typography>

          {/* Cycle diagram */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 1, sm: 2 },
              flexWrap: 'wrap',
              p: { xs: 2, md: 4 },
              borderRadius: 4,
              bgcolor: '#F5F5F7',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {[
              { label: 'Trắng', color: '#E8E8ED', text: '#1C1C1E', glow: '#fff' },
              { label: 'Vàng', color: '#FFD60A', text: '#3A3A3C', glow: '#FFD60A' },
              { label: 'Ấm', color: '#FF9500', text: '#fff', glow: '#FF9500' },
              { label: 'Tắt', color: '#3A3A3C', text: '#fff', glow: 'transparent' },
            ].map((mode, idx, arr) => (
              <Box key={mode.label} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: { xs: 56, sm: 72 },
                      height: { xs: 56, sm: 72 },
                      borderRadius: 3,
                      bgcolor: mode.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 1,
                      boxShadow: mode.glow !== 'transparent' ? `0 4px 20px ${alpha(mode.glow, 0.45)}` : 'none',
                      border: mode.label === 'Trắng' ? '1.5px solid #D2D2D7' : 'none',
                    }}
                  >
                    <LightbulbOutlinedIcon sx={{ color: mode.text, fontSize: { xs: 22, sm: 28 }, opacity: mode.label === 'Tắt' ? 0.4 : 1 }} />
                  </Box>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>{mode.label}</Typography>
                </Box>
                {idx < arr.length - 1 && (
                  <ArrowForwardIcon sx={{ color: 'text.disabled', fontSize: 18, flexShrink: 0 }} />
                )}
              </Box>
            ))}

            {/* Loop arrow back */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: { xs: 1, sm: 0 }, width: { xs: '100%', sm: 'auto' }, justifyContent: 'center' }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                → quay lại Trắng
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Section 4: Lưu ý quan trọng ── */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #FFF9EC 0%, #FFFEF5 100%)',
            border: `1.5px solid ${alpha('#FF9500', 0.25)}`,
            mb: { xs: 6, md: 10 },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box
              sx={{
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: alpha('#FF9500', 0.12),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              <WarningAmberOutlinedIcon sx={{ color: '#FF9500', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="body1" sx={{ fontWeight: 700, mb: 2 }}>Lưu ý khi sử dụng</Typography>
              <Stack spacing={1.5}>
                {[
                  'Cắm nguồn điện trước, sau đó mới chạm công tắc để bật đèn.',
                  'Tránh tiếp xúc công tắc cảm ứng với nước hoặc môi trường ẩm ướt.',
                  'Không kéo dây nguồn quá mạnh — có thể làm lỏng kết nối bên trong.',
                  'Nếu đèn không phản hồi khi chạm, thử rút nguồn 10 giây rồi cắm lại.',
                ].map((note) => (
                  <Box key={note} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#FF9500', mt: 0.75, flexShrink: 0 }} />
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
              href="/guide/den-nhieu-mau"
              variant="outlined"
              sx={{ borderRadius: 980, px: 3 }}
            >
              Xem hướng dẫn đèn nhiều màu
            </Button>
          </Stack>
        </Box>
      </Container>
    </>
  );
}
