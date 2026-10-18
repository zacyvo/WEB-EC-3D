'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Box, Button, CircularProgress, Collapse, Dialog, IconButton, TextField, Typography, useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import QRCode from 'qrcode';
import toast from 'react-hot-toast';
import ConfettiBurst from './ConfettiBurst';
import {
  POLL_HIDDEN_INTERVAL_MS, POLL_INTERVAL_MS, POLL_MAX_DURATION_MS,
  isPlausibleVnPhone, offerConditions, phaseOf, resultMessage, shouldOpenModal, shouldPoll,
  zaloOaRewardApi, type RewardPhase, type RewardStatus,
} from '@/lib/zalo-oa-reward';

// Luxe Glow gifting palette: pastel pink, white, soft gold.
const C = {
  pink50: '#FFF6F9',
  pink100: '#FDE8F0',
  pink200: '#F9D0DF',
  pink400: '#EE93B4',
  rose: '#D45F8A',
  roseDark: '#B9426F',
  gold: '#C9A24A',
  goldSoft: '#E8C77A',
  ink: '#3B2A31',
  muted: '#7B6069',
};

const ACTIVE_PHASES: RewardPhase[] = ['success', 'claimed'];

function errMessage(err: unknown, fallback: string): string {
  return (err as { response?: { data?: { message?: string } } })?.response?.data?.message || fallback;
}

/** Gift box with a soft-gold ribbon (inline SVG, no asset request). */
function GiftIcon({ size = 76 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden>
      <defs>
        <linearGradient id="lgBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F9C6D8" />
          <stop offset="1" stopColor="#EE93B4" />
        </linearGradient>
        <linearGradient id="lgGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F1D48A" />
          <stop offset="1" stopColor="#C9A24A" />
        </linearGradient>
      </defs>
      <rect x="14" y="40" width="68" height="46" rx="8" fill="url(#lgBox)" />
      <rect x="10" y="28" width="76" height="18" rx="6" fill="#F7B3CB" />
      <rect x="42" y="28" width="12" height="58" fill="url(#lgGold)" />
      <path d="M48 28c-6-14-24-16-24-6 0 7 12 7 24 6z" fill="url(#lgGold)" />
      <path d="M48 28c6-14 24-16 24-6 0 7-12 7-24 6z" fill="url(#lgGold)" />
      <circle cx="48" cy="28" r="5" fill="#E8C77A" />
    </svg>
  );
}

function Sparkles({ disabled }: { disabled: boolean }) {
  if (disabled) return null;
  const items = [
    { left: '8%', top: '10%', size: 14, delay: 0 },
    { left: '86%', top: '8%', size: 18, delay: 0.6 },
    { left: '90%', top: '38%', size: 12, delay: 1.1 },
    { left: '5%', top: '42%', size: 16, delay: 1.6 },
    { left: '72%', top: '18%', size: 10, delay: 0.3 },
  ];
  return (
    <Box aria-hidden sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {items.map((s, i) => (
        <motion.span
          key={i}
          style={{ position: 'absolute', left: s.left, top: s.top, fontSize: s.size, color: i % 2 ? C.goldSoft : C.pink400 }}
          animate={{ y: [0, -10, 0], opacity: [0.35, 1, 0.35], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
        >
          ✦
        </motion.span>
      ))}
    </Box>
  );
}

/**
 * Post-checkout Zalo OA welcome reward. Backend-authoritative: this component only shows the
 * state the API returns, polls while a Zalo interaction is pending, and never claims success
 * before the coupon is actually assigned. No linking code, no OTP, no phone matching.
 */
export default function ZaloOaRewardModal({ orderId }: { orderId: string }) {
  const reduceMotion = !!useReducedMotion();
  const isMobile = useMediaQuery('(max-width:599.95px)');
  const [status, setStatus] = useState<RewardStatus | null>(null);
  const [open, setOpen] = useState(false);
  const [connectUrl, setConnectUrl] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [showQrMobile, setShowQrMobile] = useState(false);
  const [opened, setOpened] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [linkBusy, setLinkBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [burst, setBurst] = useState(0);
  const [tick, setTick] = useState(0);
  const pollStart = useRef(Date.now());
  const savedPhone = useRef('');
  const prevPhase = useRef<RewardPhase | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refreshLink = useCallback(async () => {
    setLinkBusy(true);
    try {
      const r = await zaloOaRewardApi.link(orderId);
      if (!mounted.current) return;
      setConnectUrl(r.connectUrl);
      setStatus(r.status);
      setOpened(false);
      pollStart.current = Date.now();
    } catch {
      const s = await zaloOaRewardApi.status(orderId).catch(() => null);
      if (s && mounted.current) setStatus(s);
    } finally {
      if (mounted.current) setLinkBusy(false);
    }
  }, [orderId]);

  // Open once per order. Any failure here is silent: the reward must never disturb checkout.
  useEffect(() => {
    let cancelled = false;
    zaloOaRewardApi
      .open(orderId)
      .then(async (s) => {
        if (cancelled || !shouldOpenModal(s)) return;
        setStatus(s);
        setOpen(true);
        setBurst((b) => b + 1);
        if (['ELIGIBLE', 'AWAITING_ZALO', 'IDENTITY_PENDING'].includes(s.state)) await refreshLink();
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [orderId, refreshLink]);

  // Personalized QR for the current connect link.
  useEffect(() => {
    if (!connectUrl) return;
    let cancelled = false;
    QRCode.toDataURL(connectUrl, { margin: 1, width: 360, errorCorrectionLevel: 'M', color: { dark: C.ink, light: '#FFFFFF' } })
      .then((url) => !cancelled && setQr(url))
      .catch(() => !cancelled && setQr(null));
    return () => {
      cancelled = true;
    };
  }, [connectUrl]);

  // Poll the backend while an external Zalo step can change the state. Stops when the state is
  // final/expired, the modal is closed, the component unmounts, or after POLL_MAX_DURATION_MS.
  useEffect(() => {
    if (!open || !status || !shouldPoll(status.state)) return;
    if (Date.now() - pollStart.current > POLL_MAX_DURATION_MS) return;
    const delay = typeof document !== 'undefined' && document.hidden ? POLL_HIDDEN_INTERVAL_MS : POLL_INTERVAL_MS;
    const t = window.setTimeout(async () => {
      try {
        const s = await zaloOaRewardApi.status(orderId);
        if (mounted.current) setStatus(s);
      } catch {
        // transient — try again next tick
      }
      if (mounted.current) setTick((x) => x + 1);
    }, delay);
    return () => window.clearTimeout(t);
  }, [open, status, orderId, tick]);

  // Coming back from the Zalo app: refresh immediately instead of waiting for the next tick.
  useEffect(() => {
    if (!open) return;
    const onVisible = () => {
      if (document.visibilityState === 'visible' && status && shouldPoll(status.state)) setTick((x) => x + 1);
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [open, status]);

  const phase: RewardPhase | null = status ? phaseOf(status.state, opened) : null;

  // Celebrate exactly when the backend confirms the reward.
  useEffect(() => {
    if (phase && ACTIVE_PHASES.includes(phase) && prevPhase.current && !ACTIVE_PHASES.includes(prevPhase.current) && status?.couponCode) {
      setBurst((b) => b + 1);
    }
    prevPhase.current = phase;
  }, [phase, status?.couponCode]);

  const savePhone = useCallback(
    async (value: string): Promise<boolean> => {
      const v = value.trim();
      if (v === savedPhone.current) return true;
      if (!isPlausibleVnPhone(v)) {
        setPhoneError('Số điện thoại không hợp lệ (VD: 0912345678)');
        return false;
      }
      try {
        const s = await zaloOaRewardApi.setPhone(orderId, v);
        savedPhone.current = v;
        setPhoneError(null);
        if (mounted.current) setStatus(s);
        return true;
      } catch (err) {
        setPhoneError(errMessage(err, 'Không lưu được số điện thoại'));
        return false;
      }
    },
    [orderId],
  );

  const openZalo = () => {
    if (!connectUrl) return;
    if (!isPlausibleVnPhone(phone)) {
      setPhoneError('Số điện thoại không hợp lệ (VD: 0912345678)');
      return;
    }
    // Open synchronously in the click handler (popup blockers); phone is saved in parallel —
    // the recipient is only resolved after Zalo login + follow, seconds later.
    // ('noopener' in the features string would make window.open return null, hiding a blocked
    // popup — so detach the opener manually instead.)
    const w = window.open(connectUrl, '_blank');
    if (w) w.opener = null;
    else window.location.assign(connectUrl);
    setOpened(true);
    pollStart.current = Date.now();
    void savePhone(phone);
  };

  const close = () => {
    setOpen(false);
    if (status && !['REWARD_ASSIGNED', 'ALREADY_CLAIMED'].includes(status.state)) {
      zaloOaRewardApi.dismiss(orderId).catch(() => undefined);
    }
  };

  const copyCode = async () => {
    if (!status?.couponCode) return;
    try {
      await navigator.clipboard.writeText(status.couponCode);
      setCopied(true);
      toast.success('Đã sao chép mã giảm giá');
      window.setTimeout(() => mounted.current && setCopied(false), 2000);
    } catch {
      toast.error('Không sao chép được, vui lòng chọn và sao chép thủ công');
    }
  };

  if (!status) return null;
  const percent = status.offer?.discountPercent ?? 20;
  const conditions = offerConditions(status.offer);
  const oaName = status.oa?.name || 'Luxe Glow';
  const fade = reduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -8 }, transition: { duration: 0.28 } };

  return (
    <>
      <ConfettiBurst burstKey={open ? burst : 0} disabled={reduceMotion} />
      <Dialog
        open={open}
        onClose={close}
        fullWidth
        maxWidth="xs"
        aria-labelledby="zalo-reward-title"
        data-testid="zalo-reward-modal"
        slotProps={{
          paper: { sx: {
            m: { xs: 2, sm: 4 },
            width: { xs: 'calc(100% - 32px)', sm: '100%' },
            maxHeight: { xs: 'calc(100% - 32px)', sm: 'calc(100% - 64px)' },
            borderRadius: '28px',
            overflow: 'hidden',
            position: 'relative',
            background: `linear-gradient(180deg, ${C.pink100} 0%, ${C.pink50} 38%, #FFFFFF 70%)`,
            border: `1px solid rgba(201,162,74,0.35)`,
            boxShadow: '0 24px 60px rgba(212,95,138,0.25)',
          } },
        }}
      >
        <Sparkles disabled={reduceMotion} />
        <IconButton
          aria-label="Đóng"
          onClick={close}
          sx={{ position: 'absolute', top: 10, right: 10, zIndex: 2, color: C.muted, bgcolor: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: '#fff' } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Box sx={{ position: 'relative', px: { xs: 2.5, sm: 4 }, pt: { xs: 4, sm: 4.5 }, pb: { xs: 3, sm: 3.5 }, overflowY: 'auto', textAlign: 'center' }}>
          <Box aria-live="polite" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
            {phase === 'connecting' && 'Đang kết nối với Zalo'}
            {phase === 'confirming' && 'Đang xác nhận ưu đãi của bạn'}
            {phase === 'success' && 'Đã nhận mã giảm giá'}
          </Box>

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4, rotate: -12, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0, y: 0 }}
            transition={reduceMotion ? { duration: 0.15 } : { type: 'spring', stiffness: 260, damping: 14, delay: 0.05 }}
            style={{ display: 'inline-block' }}
          >
            <GiftIcon size={isMobile ? 64 : 76} />
          </motion.div>

          <AnimatePresence mode="wait">
            {(phase === 'offer' || phase === 'expired') && (
              <motion.div key="offer" {...fade}>
                <Typography id="zalo-reward-title" variant="h5" sx={{ mt: 1, fontWeight: 800, color: C.ink, fontSize: { xs: 22, sm: 24 } }}>
                  Bạn có quà từ Luxe Glow!
                </Typography>
                <motion.div
                  initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
                  animate={reduceMotion ? { opacity: 1 } : { scale: [0.6, 1.12, 1], opacity: 1 }}
                  transition={reduceMotion ? { duration: 0 } : { duration: 0.7, delay: 0.25, times: [0, 0.6, 1] }}
                >
                  <Typography
                    component="p"
                    data-testid="zalo-reward-percent"
                    sx={{
                      my: 1,
                      fontWeight: 900,
                      letterSpacing: '0.02em',
                      fontSize: { xs: 34, sm: 40 },
                      lineHeight: 1.1,
                      background: `linear-gradient(90deg, ${C.rose}, ${C.gold})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    GIẢM GIÁ {percent}%
                  </Typography>
                </motion.div>
                <Typography sx={{ color: C.muted, fontSize: 15, lineHeight: 1.55 }}>
                  Chúc mừng bạn đã đặt hàng thành công!
                  <br />
                  Quan tâm Zalo OA {oaName} để nhận ưu đãi {percent}% cho lần mua sắm tiếp theo.
                </Typography>

                <Box sx={{ mt: 2, display: 'inline-flex', alignItems: 'center', gap: 1, px: 1.5, py: 0.75, borderRadius: 99, bgcolor: '#fff', border: `1px solid ${C.pink200}` }}>
                  <Image src="/img/icon/zalo-icon.png" alt="Zalo" width={22} height={22} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Zalo OA {oaName}</Typography>
                  <Typography sx={{ fontSize: 12, color: C.muted }}>· Official Account</Typography>
                </Box>

                {phase === 'expired' ? (
                  <Box sx={{ mt: 2.5 }}>
                    <Typography sx={{ color: C.roseDark, fontWeight: 600, mb: 1.5 }}>Mã QR đã hết hạn.</Typography>
                    <Button
                      onClick={refreshLink}
                      disabled={linkBusy}
                      startIcon={linkBusy ? <CircularProgress size={16} color="inherit" /> : <RefreshIcon />}
                      variant="contained"
                      color="inherit"
                      fullWidth
                      sx={primaryBtnSx}
                    >
                      Tạo mã QR mới
                    </Button>
                  </Box>
                ) : (
                  <>
                    {(!isMobile || showQrMobile) && (
                      <Box sx={{ mt: 2.5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Box
                          sx={{
                            p: 1.25, borderRadius: '20px', bgcolor: '#fff',
                            border: `2px solid ${C.goldSoft}`, boxShadow: '0 8px 24px rgba(201,162,74,0.18)',
                            width: { xs: 168, sm: 188 }, height: { xs: 168, sm: 188 },
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {qr ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qr} alt="Mã QR kết nối Zalo Luxe Glow" data-testid="zalo-reward-qr" style={{ width: '100%', height: '100%', borderRadius: 12 }} />
                          ) : (
                            <CircularProgress size={28} sx={{ color: C.pink400 }} />
                          )}
                        </Box>
                        <Typography sx={{ mt: 1, fontSize: 12.5, color: C.muted }}>Quét mã bằng ứng dụng Zalo</Typography>
                      </Box>
                    )}

                    <Button
                      onClick={openZalo}
                      disabled={!connectUrl || linkBusy}
                      variant="contained"
                      color="inherit"
                      fullWidth
                      data-testid="zalo-reward-follow"
                      startIcon={<Image src="/img/icon/zalo-icon.png" alt="" width={20} height={20} />}
                      sx={{ ...primaryBtnSx, mt: 2.5 }}
                    >
                      Quan tâm Zalo Luxe Glow
                    </Button>
                    {isMobile && (
                      <Button size="small" onClick={() => setShowQrMobile((v) => !v)} sx={{ mt: 1, color: C.muted, textTransform: 'none', '&:hover': { bgcolor: 'rgba(238,147,180,0.12)' } }}>
                        {showQrMobile ? 'Ẩn mã QR' : 'Hoặc hiển thị mã QR để quét'}
                      </Button>
                    )}

                    <Box sx={{ mt: 1.5, textAlign: 'left' }}>
                      <Button
                        size="small"
                        onClick={() => setPhoneOpen((v) => !v)}
                        aria-expanded={phoneOpen}
                        sx={{ color: C.roseDark, textTransform: 'none', px: 0.5, fontSize: 13, '&:hover': { bgcolor: 'rgba(238,147,180,0.12)' } }}
                      >
                        {phoneOpen ? '− ' : '+ '}Nhận ưu đãi bằng số điện thoại khác (không bắt buộc)
                      </Button>
                      <Collapse in={phoneOpen}>
                        <TextField
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError(null);
                          }}
                          onBlur={() => void savePhone(phone)}
                          label="Số điện thoại nhận ưu đãi"
                          placeholder="VD: 0912345678"
                          inputMode="tel"
                          fullWidth
                          size="small"
                          error={!!phoneError}
                          helperText={phoneError || 'Không cần mã OTP. Để trống để nhận ưu đãi vào tài khoản đang đặt hàng.'}
                          slotProps={{ htmlInput: { maxLength: 20, 'data-testid': 'zalo-reward-phone' } }}
                          sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '14px', bgcolor: '#fff' } }}
                        />
                      </Collapse>
                    </Box>
                  </>
                )}
                <Button onClick={close} sx={{ mt: 1.5, color: C.muted, textTransform: 'none', '&:hover': { bgcolor: 'rgba(238,147,180,0.12)' } }}>
                  Để sau
                </Button>
              </motion.div>
            )}

            {(phase === 'connecting' || phase === 'confirming') && (
              <motion.div key={phase} {...fade}>
                <Typography id="zalo-reward-title" variant="h6" sx={{ mt: 1.5, fontWeight: 800, color: C.ink }}>
                  {phase === 'connecting' ? 'Đang kết nối với Zalo...' : 'Đang xác nhận ưu đãi của bạn...'}
                </Typography>
                <CircularProgress size={34} sx={{ my: 2.5, color: C.rose }} />
                {phase === 'connecting' && (
                  <>
                    <Typography sx={{ color: C.muted, fontSize: 14 }}>
                      Hoàn tất cho phép trong Zalo, sau đó nhấn “Quan tâm” Zalo OA {oaName}. Trang này sẽ tự cập nhật.
                    </Typography>
                    <Button size="small" onClick={() => setOpened(false)} sx={{ mt: 1.5, color: C.roseDark, textTransform: 'none', '&:hover': { bgcolor: 'rgba(238,147,180,0.12)' } }}>
                      Hiển thị lại mã QR
                    </Button>
                  </>
                )}
                {phase === 'confirming' && status.state === 'FOLLOW_PENDING' && (
                  <>
                    <Typography sx={{ color: C.muted, fontSize: 14 }}>
                      Bước cuối: nhấn “Quan tâm” trên trang Zalo OA {oaName}.
                    </Typography>
                    {status.oa?.url && (
                      <Button
                        component="a"
                        href={status.oa.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="contained"
                      color="inherit"
                        fullWidth
                        startIcon={<Image src="/img/icon/zalo-icon.png" alt="" width={20} height={20} />}
                        sx={{ ...primaryBtnSx, mt: 2 }}
                      >
                        Mở Zalo OA {oaName}
                      </Button>
                    )}
                  </>
                )}
              </motion.div>
            )}

            {(phase === 'success' || phase === 'claimed') && (
              <motion.div key="success" {...fade}>
                <Typography id="zalo-reward-title" variant="h6" sx={{ mt: 1, fontWeight: 800, color: C.ink, lineHeight: 1.35 }}>
                  {phase === 'success' ? (
                    <>Chúc mừng! Bạn đã nhận được<br />mã giảm giá {percent}%!</>
                  ) : (
                    'Bạn đã nhận ưu đãi này trước đó'
                  )}
                </Typography>
                {status.couponCode ? (
                  <>
                    <Box
                      sx={{
                        mt: 2, mx: 'auto', px: 2.5, py: 1.5, borderRadius: '18px', bgcolor: '#fff',
                        border: `2px dashed ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5,
                      }}
                    >
                      <Typography data-testid="zalo-reward-code" sx={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontWeight: 800, fontSize: 22, letterSpacing: '0.08em', color: C.roseDark, wordBreak: 'break-all', textAlign: 'left' }}>
                        {status.couponCode}
                      </Typography>
                      <Button
                        onClick={copyCode}
                        variant="contained"
                      color="inherit"
                        size="small"
                        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                        sx={{ ...primaryBtnSx, flexShrink: 0, py: 0.75, px: 1.75, fontSize: 13 }}
                      >
                        {copied ? 'Đã chép' : 'Sao chép mã'}
                      </Button>
                    </Box>
                    {status.recipient && !status.recipient.isOrderAccount && (
                      <Typography sx={{ mt: 1.5, fontSize: 13, color: C.muted }}>
                        Ưu đãi được gán cho số điện thoại {status.recipient.phoneMasked ?? 'bạn đã nhập'} — dùng được khi đặt hàng bằng tài khoản có số điện thoại này.
                      </Typography>
                    )}
                    {conditions.length > 0 && (
                      <Box component="ul" sx={{ mt: 2, mb: 0, pl: 2.5, textAlign: 'left', color: C.muted, fontSize: 13.5, lineHeight: 1.7 }}>
                        {conditions.map((c) => <li key={c}>{c}</li>)}
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography sx={{ mt: 2, color: C.muted, fontSize: 14 }}>
                    Tài khoản Zalo này đã nhận ưu đãi chào mừng của {oaName}. Mỗi tài khoản Zalo chỉ nhận một lần.
                  </Typography>
                )}
                <Button onClick={close} variant="contained"
                      color="inherit" fullWidth sx={{ ...primaryBtnSx, mt: 2.5 }}>
                  Tiếp tục mua sắm
                </Button>
              </motion.div>
            )}

            {(phase === 'unsupported' || phase === 'ineligible' || phase === 'error') && (
              <motion.div key="info" {...fade}>
                <Typography id="zalo-reward-title" variant="h6" sx={{ mt: 1, fontWeight: 800, color: C.ink }}>
                  {phase === 'unsupported'
                    ? resultMessage('unsupported').title
                    : phase === 'ineligible'
                      ? status.reason === 'COUPON_EXHAUSTED' ? 'Ưu đãi đã hết lượt' : 'Ưu đãi hiện không khả dụng'
                      : 'Có lỗi xảy ra'}
                </Typography>
                <Typography sx={{ mt: 1.5, color: C.muted, fontSize: 14, lineHeight: 1.6 }}>
                  {phase === 'unsupported'
                    ? resultMessage('unsupported').body
                    : phase === 'ineligible'
                      ? 'Rất tiếc, đơn hàng này hiện không thể nhận ưu đãi Zalo OA.'
                      : 'Hệ thống chưa thể xác nhận ưu đãi lúc này. Vui lòng thử lại sau hoặc liên hệ CSKH.'}
                </Typography>
                <Button onClick={close} variant="outlined" fullWidth sx={{ mt: 2.5, borderRadius: 99, borderColor: C.pink400, color: C.roseDark, textTransform: 'none', fontWeight: 700 }}>
                  Đóng
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Dialog>
    </>
  );
}

const primaryBtnSx = {
  borderRadius: 99,
  py: 1.25,
  textTransform: 'none',
  fontWeight: 800,
  fontSize: 15.5,
  color: '#fff',
  background: `linear-gradient(90deg, ${C.pink400} 0%, ${C.rose} 100%)`,
  boxShadow: '0 8px 20px rgba(212,95,138,0.3)',
  '&:hover': { background: `linear-gradient(90deg, ${C.rose} 0%, ${C.roseDark} 100%)` },
  '&.Mui-disabled': { color: 'rgba(255,255,255,0.85)', background: C.pink200 },
} as const;
