import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import ShippingPolicyContent from './ShippingPolicyContent';

export const metadata: Metadata = {
  title: 'Chính sách vận chuyển',
  description: `Chính sách vận chuyển của ${STORE.name} — phạm vi giao hàng, thời gian, phí vận chuyển và cách theo dõi đơn hàng.`,
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyContent />;
}
