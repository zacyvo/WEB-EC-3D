import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import PaymentMethodsContent from './PaymentMethodsContent';

export const metadata: Metadata = {
  title: 'Hình thức thanh toán',
  description: `Các hình thức thanh toán được ${STORE.name} hỗ trợ: thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng và ví điện tử.`,
};

export default function PaymentMethodsPage() {
  return <PaymentMethodsContent />;
}
