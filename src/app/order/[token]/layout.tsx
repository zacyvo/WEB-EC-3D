import type { Metadata } from 'next';

// Link xem đơn là link bảo mật — không cho index
export const metadata: Metadata = {
  title: 'Xem đơn hàng',
  robots: { index: false, follow: false },
};

export default function PublicOrderLayout({ children }: { children: React.ReactNode }) {
  return children;
}
