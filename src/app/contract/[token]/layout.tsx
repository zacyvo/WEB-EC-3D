import type { Metadata } from 'next';

// Link hợp đồng là link bảo mật — không cho index
export const metadata: Metadata = {
  title: 'Hợp đồng',
  robots: { index: false, follow: false },
};

export default function ContractLayout({ children }: { children: React.ReactNode }) {
  return children;
}
