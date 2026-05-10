import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import PrivacyPolicyContent from './PrivacyPolicyContent';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật',
  description: `Chính sách bảo mật của ${STORE.name} — cam kết bảo vệ thông tin cá nhân khách hàng.`,
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />;
}
