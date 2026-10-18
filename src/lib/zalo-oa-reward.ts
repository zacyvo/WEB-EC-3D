import api from '@/lib/api';
import type { ApiResponse } from '@/types';
import type { RewardStatus } from '@/lib/zalo-oa-reward-logic';

export * from '@/lib/zalo-oa-reward-logic';

const base = (orderId: string) => `/zalo-oa-reward/orders/${encodeURIComponent(orderId)}`;

/** Owner-only API (JWT). The backend decides everything; the browser never submits a UID. */
export const zaloOaRewardApi = {
  open: async (orderId: string) => (await api.post<ApiResponse<RewardStatus>>(`${base(orderId)}/session`)).data.data,
  status: async (orderId: string) => (await api.get<ApiResponse<RewardStatus>>(`${base(orderId)}/status`)).data.data,
  link: async (orderId: string) =>
    (await api.post<ApiResponse<{ connectUrl: string; expiresAt: string; status: RewardStatus }>>(`${base(orderId)}/link`)).data.data,
  setPhone: async (orderId: string, phone: string) =>
    (await api.put<ApiResponse<RewardStatus>>(`${base(orderId)}/reward-phone`, { phone })).data.data,
  dismiss: async (orderId: string) => (await api.post<ApiResponse<RewardStatus>>(`${base(orderId)}/dismiss`)).data.data,
};
