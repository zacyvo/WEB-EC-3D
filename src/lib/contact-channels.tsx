import Box from '@mui/material/Box';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { STORE } from '@/lib/store-config';

export function ThreadsIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z" />
    </SvgIcon>
  );
}

function createImageIcon(src: string, alt: string) {
  return function ImageIcon({ sx }: SvgIconProps) {
    const size = (sx as unknown as { fontSize?: number } | undefined)?.fontSize ?? 24;
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        sx={{ width: size, height: size, objectFit: 'contain', display: 'inline-block' }}
      />
    );
  };
}

const ZaloIcon = createImageIcon('/img/icon/zalo-icon.png', 'Zalo');
const TiktokIcon = createImageIcon('/img/icon/tiktok-icon.svg', 'TikTok');
const ShopeeIcon = createImageIcon('/img/icon/shopee-icon.svg', 'Shopee');
const FacebookIcon = createImageIcon('/img/icon/facebook-icon.svg', 'Facebook');

export const CONTACT_CHANNELS = [
  {
    id: 'phone',
    label: 'Gọi điện',
    value: STORE.phone,
    desc: 'Hotline hỗ trợ 8:00 – 22:00',
    href: `tel:${STORE.phone}`,
    Icon: PhoneOutlinedIcon,
    color: '#34C759',
    bg: '#F0FBF2',
    cta: 'Gọi ngay',
    status: !!STORE.phone
  },
  {
    id: 'zalo',
    label: 'Zalo',
    value: 'Chat qua Zalo',
    desc: 'Phản hồi trong vòng 5 phút',
    href: STORE.zalo,
    Icon: ZaloIcon,
    color: '#007AFF',
    bg: '#EAF3FF',
    cta: 'Nhắn Zalo',
    status: !!STORE.zalo
  },
  {
    id: 'email',
    label: 'Email',
    value: STORE.email,
    desc: 'Phản hồi trong vòng 24 giờ',
    href: `mailto:${STORE.email}`,
    Icon: EmailOutlinedIcon,
    color: '#636366',
    bg: '#F5F5F7',
    cta: 'Gửi email',
    status: !!STORE.email
  },
  {
    id: 'facebook',
    label: 'Facebook',
    value: 'Luxe Glow',
    desc: 'Theo dõi tin tức & khuyến mãi',
    href: STORE.facebook,
    Icon: FacebookIcon,
    color: '#1877F2',
    bg: '#EEF4FE',
    cta: 'Xem trang',
    status: !!STORE.facebook
  },
  {
    id: 'shopee',
    label: 'Shopee',
    value: 'shop.luxeglow',
    desc: 'Mua hàng & nhận nhiều ưu đãi',
    href: STORE.shopee,
    Icon: ShopeeIcon,
    color: '#EE4D2D',
    bg: '#FFF2EF',
    cta: 'Vào shop',
    status: !!STORE.shopee
  },
  {
    id: 'instagram',
    label: 'Instagram',
    value: 'comming soon',
    desc: 'Ảnh sản phẩm & behind-the-scenes',
    href: STORE.instagram,
    Icon: CameraAltOutlinedIcon,
    color: '#C13584',
    bg: '#FBF0F7',
    cta: 'Comming soon',
    status: !!STORE.instagram
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    value: '@luxe.glow672',
    desc: 'Video sản phẩm & livestream',
    href: STORE.tiktok,
    Icon: TiktokIcon,
    color: '#1C1C1E',
    bg: '#F5F5F7',
    cta: 'Xem trang',
    status: !!STORE.tiktok
  },
  {
    id: 'threads',
    label: 'Threads',
    value: '@luxeglow.vn',
    desc: 'Cập nhật xu hướng & khoảnh khắc đời thường',
    href: STORE.threads,
    Icon: ThreadsIcon,
    color: '#000000',
    bg: '#F2F2F2',
    cta: 'Xem trang',
    status: !!STORE.threads
  },
] as const;
