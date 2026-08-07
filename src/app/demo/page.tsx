import type { Metadata } from 'next';
import { DemoScreen } from './DemoScreen';

export const metadata: Metadata = {
  title: 'Demo',
  robots: { index: false, follow: false },
};

export default function DemoPage() {
  return <DemoScreen />;
}
