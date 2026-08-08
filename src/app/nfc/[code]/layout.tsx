import type { Metadata } from 'next';

// Link NFC là link cá nhân (quản lý hoặc hồ sơ công khai) — không cho index
export const metadata: Metadata = {
  title: 'Thẻ NFC',
  robots: { index: false, follow: false },
};

export default function NfcLayout({ children }: { children: React.ReactNode }) {
  return children;
}
