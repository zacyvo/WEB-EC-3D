import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import TermsOfServiceContent from './TermsOfServiceContent';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ',
  description: `Điều khoản sử dụng dịch vụ của ${STORE.name} — quy định quyền và nghĩa vụ khi mua sắm tại Luxe Glow.`,
};

export default function TermsOfServicePage() {
  return <TermsOfServiceContent />;
}
