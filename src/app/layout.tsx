import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  title: {
    default: 'Luxe Glow | Đèn In 3D Thủ Công',
    template: '%s | Luxe Glow',
  },
  description:
    'Khám phá bộ sưu tập đèn in 3D độc đáo, handcraft từ chất liệu cao cấp. Thiết kế theo yêu cầu, phong cách tối giản hiện đại.',
  keywords: ['đèn 3D', 'in 3D', 'đèn trang trí', 'đèn handcraft', 'đèn bàn', 'Giá đèn 3D', 'đèn quà tặng', 'đèn nghệ thuật', 'đèn hiện đại', 'Luxe Glow'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Luxe Glow',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="bg-white text-apple-gray-900 antialiased font-sans">
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
