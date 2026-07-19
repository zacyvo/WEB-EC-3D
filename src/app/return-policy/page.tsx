import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import ReturnPolicyContent from './ReturnPolicyContent';

export const metadata: Metadata = {
  title: 'Chính sách bảo hành đổi trả',
  description: `Chính sách bảo hành, đổi trả và hoàn tiền của ${STORE.name} — điều kiện, quy trình và thời gian xử lý.`,
};

export default function ReturnPolicyPage() {
  return <ReturnPolicyContent />;
}
