import type { Metadata } from 'next';
import { STORE } from '@/lib/store-config';
import SupportedPhonesContent from './SupportedPhonesContent';

export const metadata: Metadata = {
  title: 'Điện thoại hỗ trợ NFC',
  description: `Danh sách điện thoại hỗ trợ NFC theo hãng sản xuất từ 2015 đến nay — tra cứu nhanh trước khi dùng thẻ NFC ${STORE.name}.`,
};

export default function NfcSupportedPhonesPage() {
  return <SupportedPhonesContent />;
}
