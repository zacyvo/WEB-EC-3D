import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import NfcGuideContent from './NfcGuideContent';

export const metadata: Metadata = {
  title: 'Hướng dẫn kích hoạt và sử dụng thẻ NFC',
  description: `Hướng dẫn kích hoạt thẻ NFC lần đầu, đăng nhập quản lý, thêm thông tin liên hệ / mạng xã hội và chia sẻ danh thiếp điện tử ${STORE.name}.`,
};

export default function NfcGuidePage() {
  return <NfcGuideContent />;
}
