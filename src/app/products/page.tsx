import type { Metadata } from 'next';
import ProductsClient from './ProductsClient';

export const metadata: Metadata = {
  title: 'Sản phẩm',
  description: 'Khám phá toàn bộ bộ sưu tập đèn in 3D độc đáo của Luxe Glow.',
};

export default function ProductsPage() {
  return <ProductsClient />;
}
