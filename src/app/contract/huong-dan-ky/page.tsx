import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import SigningGuideContent from './SigningGuideContent';

export const metadata: Metadata = {
  title: 'Hướng dẫn ký hợp đồng bằng chữ ký số',
  description: `Hướng dẫn khách hàng của ${STORE.name} cách ký xác nhận hợp đồng — bằng chữ ký số (USB token) hoặc chữ ký điện tử đơn giản.`,
};

export default function ContractSigningGuidePage() {
  return <SigningGuideContent />;
}
