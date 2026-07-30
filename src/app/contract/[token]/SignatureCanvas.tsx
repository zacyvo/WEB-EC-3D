'use client';

import { useRef, useState } from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';

/**
 * Canvas ký tay đơn giản — dùng pointer events thuần, không thêm thư viện ngoài vì phạm vi
 * nhỏ (vẽ 1 nét, xuất PNG). Đây là "chữ ký điện tử đơn giản", KHÔNG phải chữ ký số PKI.
 */
export default function SignatureCanvas({
  defaultName,
  submitting,
  onSubmit,
}: {
  defaultName?: string;
  submitting: boolean;
  onSubmit: (canvasImageBase64: string, confirmedName: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [confirmedName, setConfirmedName] = useState(defaultName ?? '');

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(x, y);
    ctx.stroke();
    if (!hasDrawn) setHasDrawn(true);
  };

  const end = () => {
    drawingRef.current = false;
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const submit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn || !confirmedName.trim()) return;
    onSubmit(canvas.toDataURL('image/png'), confirmedName.trim());
  };

  return (
    <Stack spacing={2}>
      <Alert severity="warning" sx={{ borderRadius: 3 }}>
        Đây là <b>chữ ký điện tử đơn giản</b> để xác nhận nội dung hợp đồng, <b>KHÔNG phải chữ ký
        số</b> (chữ ký điện tử an toàn) theo Nghị định 130/2018. Nếu bạn có chữ ký số (USB token),
        vui lòng dùng phương án &quot;Ký bằng chữ ký số&quot; ở trên để có giá trị pháp lý cao nhất.
      </Alert>

      <TextField
        label="Họ và tên xác nhận *"
        value={confirmedName}
        onChange={(e) => setConfirmedName(e.target.value)}
        placeholder="VD: Nguyễn Văn A"
        fullWidth
      />

      <Box>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
          Ký tên vào khung bên dưới
        </Typography>
        <Box
          sx={{
            border: '1px dashed', borderColor: 'grey.400', borderRadius: 3,
            bgcolor: '#fff', touchAction: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={200}
            style={{ width: '100%', height: 200, display: 'block', cursor: 'crosshair' }}
            onPointerDown={start}
            onPointerMove={move}
            onPointerUp={end}
            onPointerLeave={end}
          />
        </Box>
      </Box>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          startIcon={<DeleteOutlineIcon />}
          onClick={clear}
          disabled={submitting}
          sx={{ textTransform: 'none', borderRadius: 3 }}
        >
          Xoá chữ ký
        </Button>
        <Button
          variant="contained"
          startIcon={<GestureOutlinedIcon />}
          onClick={submit}
          disabled={submitting || !hasDrawn || !confirmedName.trim()}
          sx={{ textTransform: 'none', borderRadius: 3, fontWeight: 600 }}
        >
          {submitting ? 'Đang xác nhận...' : 'Xác nhận chữ ký'}
        </Button>
      </Stack>
    </Stack>
  );
}
