export interface NfcOwnSocialLink {
  _id: string;
  icon: string;
  value: string;
}

export interface NfcOwnProfile {
  _id: string;
  nfcId: string;
  nfcCode: string;
  phone?: string;
  isActivated: boolean;
  socialLinks: NfcOwnSocialLink[];
}
