import type { Metadata } from 'next';
import { MaintenanceScreen } from './MaintenanceScreen';

export const metadata: Metadata = {
  title: 'Đang bảo trì',
  robots: { index: false, follow: false },
};

export default function MaintenancePage() {
  return <MaintenanceScreen />;
}
