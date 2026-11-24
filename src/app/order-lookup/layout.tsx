import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tra cứu đơn hàng',
  description: 'Xem đơn hàng đã đặt không cần đăng nhập — bằng số điện thoại và mã bảo mật hoặc địa chỉ nhận hàng.',
  robots: { index: false, follow: true },
};

export default function OrderLookupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
