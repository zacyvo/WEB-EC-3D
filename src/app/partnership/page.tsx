import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import PartnershipContent from './PartnershipContent';

export const metadata: Metadata = {
  title: 'Hợp tác sản xuất cùng Luxe Glow',
  description: `Chính sách hợp tác sản xuất dành cho đối tác của ${STORE.name} — 4 cấp độ hợp tác, ưu đãi giá cung cấp và ưu tiên sản xuất theo sản lượng, doanh số hằng tháng.`,
};

export default function PartnershipPage() {
  return <PartnershipContent />;
}
