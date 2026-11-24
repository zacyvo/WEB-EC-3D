import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { ApiResponse, BankTransferAvailability, PaymentAccountType } from '@/types';

export const PAYMENT_ACCOUNT_LABEL: Record<PaymentAccountType, string> = {
  PERSONAL: 'Tài khoản cá nhân',
  BUSINESS: 'Tài khoản Hộ kinh doanh Luxe Glow',
};

/** Short form for the payment details rows. */
export const PAYMENT_ACCOUNT_SHORT_LABEL: Record<PaymentAccountType, string> = {
  PERSONAL: 'Cá nhân',
  BUSINESS: 'Hộ kinh doanh',
};

const UNAVAILABLE: BankTransferAvailability = { enabled: false, accountTypes: [], defaultAccountType: null };

/** Whether checkout may offer bank transfer, and which receiving accounts the customer can pick.
 * Tolerates the older `{ enabled }`-only response during a deploy. */
export function useBankTransferAvailability(enabled = true) {
  return useQuery<BankTransferAvailability>({
    queryKey: ['bank-transfer-availability'],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Partial<BankTransferAvailability>>>('/payments/bank-transfer/availability');
      const d = res.data.data ?? {};
      if (!d.enabled) return UNAVAILABLE;
      return {
        enabled: true,
        accountTypes: d.accountTypes ?? [],
        defaultAccountType: d.defaultAccountType ?? null,
      };
    },
    enabled,
    staleTime: 60_000,
  });
}
