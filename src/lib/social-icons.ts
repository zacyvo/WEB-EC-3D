// Catalog các icon social/liên hệ cho tính năng NFC — key phải khớp với
// backend/src/nfc/constants/social-icons.constant.ts (SOCIAL_ICON_KEYS).
// Đổi ở đây thì phải đổi cả BE và frontend-admin/src/lib/social-icons.ts.

export type SocialIconKey =
  | 'phone' | 'email' | 'website' | 'facebook' | 'messenger' | 'zalo' | 'instagram'
  | 'threads' | 'tiktok' | 'x' | 'youtube' | 'linkedin' | 'whatsapp' | 'telegram'
  | 'snapchat' | 'pinterest' | 'discord' | 'wechat' | 'line' | 'skype' | 'viber' | 'reddit';

export type IconInputKind = 'phone' | 'email' | 'text';

export interface SocialIconDef {
  key: SocialIconKey;
  label: string;
  src: string;
  color: string;
  inputKind: IconInputKind;
  placeholder: string;
  buildHref: (value: string) => string;
}

function toIntlPhone(raw: string): string {
  const digits = raw.trim().replace(/[\s-]/g, '');
  if (digits.startsWith('+')) return digits.slice(1);
  if (digits.startsWith('0')) return '84' + digits.slice(1);
  return digits;
}

function withScheme(value: string): string {
  const v = value.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(v)) return v;
  return `https://${v}`;
}

export const SOCIAL_ICONS: SocialIconDef[] = [
  { key: 'phone', label: 'Điện thoại', src: '/img/icon/phone-icon.svg', color: '#34C759', inputKind: 'phone', placeholder: 'VD: 0912345678', buildHref: (v) => `tel:${v.trim()}` },
  { key: 'email', label: 'Email', src: '/img/icon/email-icon.svg', color: '#EA4335', inputKind: 'email', placeholder: 'VD: ban@email.com', buildHref: (v) => `mailto:${v.trim()}` },
  { key: 'website', label: 'Website / Link', src: '/img/icon/website-icon.svg', color: '#6366F1', inputKind: 'text', placeholder: 'VD: yourwebsite.com', buildHref: withScheme },
  { key: 'facebook', label: 'Facebook', src: '/img/icon/facebook-icon.svg', color: '#1877F2', inputKind: 'text', placeholder: 'VD: facebook.com/yourpage', buildHref: withScheme },
  { key: 'messenger', label: 'Messenger', src: '/img/icon/messenger-icon.svg', color: '#0866FF', inputKind: 'text', placeholder: 'VD: m.me/yourpage', buildHref: withScheme },
  { key: 'zalo', label: 'Zalo', src: '/img/icon/zalo-icon.png', color: '#0068FF', inputKind: 'phone', placeholder: 'VD: 0912345678', buildHref: (v) => `https://zalo.me/${toIntlPhone(v)}` },
  { key: 'instagram', label: 'Instagram', src: '/img/icon/instagram-icon.svg', color: '#FF0069', inputKind: 'text', placeholder: 'VD: instagram.com/yourpage', buildHref: withScheme },
  { key: 'threads', label: 'Threads', src: '/img/icon/threads-icon.svg', color: '#000000', inputKind: 'text', placeholder: 'VD: threads.net/@yourpage', buildHref: withScheme },
  { key: 'tiktok', label: 'TikTok', src: '/img/icon/tiktok-icon.svg', color: '#000000', inputKind: 'text', placeholder: 'VD: tiktok.com/@yourpage', buildHref: withScheme },
  { key: 'x', label: 'X (Twitter)', src: '/img/icon/x-icon.svg', color: '#000000', inputKind: 'text', placeholder: 'VD: x.com/yourpage', buildHref: withScheme },
  { key: 'youtube', label: 'YouTube', src: '/img/icon/youtube-icon.svg', color: '#FF0000', inputKind: 'text', placeholder: 'VD: youtube.com/@yourchannel', buildHref: withScheme },
  { key: 'linkedin', label: 'LinkedIn', src: '/img/icon/linkedin-icon.svg', color: '#0A66C2', inputKind: 'text', placeholder: 'VD: linkedin.com/in/yourname', buildHref: withScheme },
  { key: 'whatsapp', label: 'WhatsApp', src: '/img/icon/whatsapp-icon.svg', color: '#25D366', inputKind: 'phone', placeholder: 'VD: 0912345678', buildHref: (v) => `https://wa.me/${toIntlPhone(v)}` },
  { key: 'telegram', label: 'Telegram', src: '/img/icon/telegram-icon.svg', color: '#26A5E4', inputKind: 'text', placeholder: 'VD: t.me/yourusername', buildHref: withScheme },
  { key: 'snapchat', label: 'Snapchat', src: '/img/icon/snapchat-icon.svg', color: '#FFFC00', inputKind: 'text', placeholder: 'VD: snapchat.com/add/yourname', buildHref: withScheme },
  { key: 'pinterest', label: 'Pinterest', src: '/img/icon/pinterest-icon.svg', color: '#BD081C', inputKind: 'text', placeholder: 'VD: pinterest.com/yourpage', buildHref: withScheme },
  { key: 'discord', label: 'Discord', src: '/img/icon/discord-icon.svg', color: '#5865F2', inputKind: 'text', placeholder: 'VD: discord.gg/invite', buildHref: withScheme },
  { key: 'wechat', label: 'WeChat', src: '/img/icon/wechat-icon.svg', color: '#07C160', inputKind: 'text', placeholder: 'VD: WeChat ID của bạn', buildHref: withScheme },
  { key: 'line', label: 'Line', src: '/img/icon/line-icon.svg', color: '#00C300', inputKind: 'text', placeholder: 'VD: line.me/ti/p/yourid', buildHref: withScheme },
  { key: 'skype', label: 'Skype', src: '/img/icon/skype-icon.svg', color: '#00AFF0', inputKind: 'text', placeholder: 'VD: Skype ID của bạn', buildHref: (v) => `skype:${v.trim()}?chat` },
  { key: 'viber', label: 'Viber', src: '/img/icon/viber-icon.svg', color: '#7360F2', inputKind: 'phone', placeholder: 'VD: 0912345678', buildHref: (v) => `viber://chat?number=%2B${toIntlPhone(v)}` },
  { key: 'reddit', label: 'Reddit', src: '/img/icon/reddit-icon.svg', color: '#FF4500', inputKind: 'text', placeholder: 'VD: reddit.com/u/yourname', buildHref: withScheme },
];

export const SOCIAL_ICON_MAP: Record<string, SocialIconDef> = Object.fromEntries(
  SOCIAL_ICONS.map((i) => [i.key, i]),
);
