export const STORE = {
  name: 'Luxe Glow',
  tagline: 'In 3D Theo Ý Tưởng Của Bạn',
  address: 'Bình Trị Đông, TP. Hồ Chí Minh, Việt Nam',
  phone: '0909064680',
  email: 'support@luxe-glow.vn',
  website: 'https://www.luxe-glow.vn/',
  taxId: '079197022908',
  zalo: 'https://zalo.me/0909064680',
  facebook: 'https://www.facebook.com/share/1HraFSNqjd/?mibextid=wwXIfr',
  instagram: '',
  shopee: 'https://vn.shp.ee/MoBMsiLT',
  tiktok: 'https://www.tiktok.com/@luxe.glow672?_r=1&_t=ZS-98LqAAMjZDN',
  threads: 'https://www.threads.com/@luxeglow.vn?igshid=NTc4MTIwNjQ2YQ==',
  googleMapsEmbed: '',
  // ── Chủ sở hữu website (công khai theo pháp luật thương mại điện tử) ──
  // Điền đúng theo Giấy chứng nhận đăng ký kinh doanh. Trường để trống sẽ không hiển thị.
  /** Tên hộ kinh doanh / doanh nghiệp, VD: "Hộ kinh doanh Luxe Glow". */
  legalName: '',
  /** Số Giấy chứng nhận đăng ký kinh doanh. */
  businessRegNo: '',
  /** Ngày cấp, nơi cấp Giấy chứng nhận đăng ký kinh doanh. */
  businessRegIssued: '',
  /** Chủ hộ kinh doanh / người đại diện theo pháp luật. */
  representative: '',
} as const;

/** Thông tin chủ sở hữu website hiển thị trên các trang pháp lý — chỉ gồm các trường đã điền. */
export const STORE_OWNER_LINES: { label: string; value: string }[] = [
  { label: 'Tên đơn vị', value: STORE.legalName || STORE.name },
  { label: 'Mã số thuế', value: STORE.taxId },
  { label: 'Giấy chứng nhận đăng ký kinh doanh số', value: STORE.businessRegNo },
  { label: 'Ngày cấp, nơi cấp', value: STORE.businessRegIssued },
  { label: 'Người đại diện', value: STORE.representative },
  { label: 'Địa chỉ', value: STORE.address },
  { label: 'Điện thoại', value: STORE.phone },
  { label: 'Email', value: STORE.email },
  { label: 'Website', value: STORE.website.replace(/\/+$/, '') },
].filter((l) => l.value);
