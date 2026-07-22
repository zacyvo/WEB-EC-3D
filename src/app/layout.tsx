import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BottomNav } from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.luxe-glow.vn'),
  title: {
    default: 'Luxe Glow | In 3D Theo Ý Tưởng Của Bạn',
    template: '%s | Luxe Glow',
  },
  description:
    'Mọi thứ xung quanh bạn đều có thể làm từ in 3D. Bạn có ý tưởng, Luxe Glow thực hiện nó — từ đèn trang trí handcraft đến quà tặng, mô hình và vật dụng cá nhân hoá.',
  keywords: ['in 3D theo yêu cầu', 'thiết kế theo ý tưởng', 'xưởng in 3D', 'đèn 3D', 'in 3D', 'đèn trang trí', 'đèn handcraft', 'quà tặng in 3D', 'quà tặng cá nhân hoá', 'đèn nghệ thuật', 'Luxe Glow'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Luxe Glow',
    title: 'Luxe Glow | In 3D Theo Ý Tưởng Của Bạn',
    description: 'Mọi thứ xung quanh bạn đều có thể làm từ in 3D. Bạn có ý tưởng, Luxe Glow thực hiện nó — từ đèn trang trí handcraft đến quà tặng, mô hình và vật dụng cá nhân hoá.',
    images: [{ url: 'https://www.luxe-glow.vn/img/meta-data.jpg', width: 1200, height: 630, alt: 'Luxe Glow – In 3D Theo Ý Tưởng Của Bạn' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luxe Glow | In 3D Theo Ý Tưởng Của Bạn',
    description: 'Mọi thứ xung quanh bạn đều có thể làm từ in 3D. Bạn có ý tưởng, Luxe Glow thực hiện nó.',
    images: ['https://www.luxe-glow.vn/img/meta-data.jpg'],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/img/logo_blue_geometric.svg',
    shortcut: '/img/logo_blue_geometric.svg',
    apple: '/img/logo_blue_geometric.svg',
  },
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
