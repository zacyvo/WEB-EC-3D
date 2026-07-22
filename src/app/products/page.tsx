import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Khám phá bộ sưu tập đèn in 3D độc đáo của Luxe Glow — hoặc gửi ý tưởng riêng để chúng tôi in 3D theo yêu cầu của bạn.',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
