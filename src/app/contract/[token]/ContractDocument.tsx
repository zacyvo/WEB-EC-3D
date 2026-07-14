'use client';

import { formatCurrency } from '@/lib/utils';

// ── Types (public contract — không chứa dữ liệu nội bộ) ──────────────────────

export interface PublicContractItem {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ContractParty {
  name: string;
  address: string;
  representative: string;
  position: string;
  phone: string;
  email: string;
  taxCode: string;
}

export interface PublicContract {
  contractNo: string;
  status: 'NEW' | 'REVIEW' | 'DRAFT' | 'FINAL' | 'SUCCESS' | 'CLOSED';
  items: PublicContractItem[];
  totalAmount: number;
  partyA: ContractParty;
  partyB: ContractParty;
  signPlace: string;
  signDate?: string;
  technicalRequirements: string;
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolder: string;
  deliveryDate?: string;
  deliveryAddress: string;
  userNote: string;
  closeReason: string;
  submittedAt?: string;
  finalizedAt?: string;
  successAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Đọc số tiền thành chữ ─────────────────────────────────────────────────────

const VN_DIGITS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

function readTriple(n: number, showZeroHundred: boolean): string {
  const hundred = Math.floor(n / 100);
  const ten = Math.floor((n % 100) / 10);
  const unit = n % 10;
  const parts: string[] = [];
  if (hundred > 0 || showZeroHundred) parts.push(VN_DIGITS[hundred], 'trăm');
  if (ten > 1) {
    parts.push(VN_DIGITS[ten], 'mươi');
    if (unit === 1) parts.push('mốt');
    else if (unit === 4) parts.push('tư');
    else if (unit === 5) parts.push('lăm');
    else if (unit > 0) parts.push(VN_DIGITS[unit]);
  } else if (ten === 1) {
    parts.push('mười');
    if (unit === 5) parts.push('lăm');
    else if (unit > 0) parts.push(VN_DIGITS[unit]);
  } else if (unit > 0) {
    if (hundred > 0 || showZeroHundred) parts.push('lẻ');
    parts.push(VN_DIGITS[unit]);
  }
  return parts.join(' ');
}

export function numberToVietnameseWords(amount: number): string {
  if (!Number.isFinite(amount)) return '';
  let n = Math.floor(Math.abs(amount));
  if (n === 0) return 'Không đồng';
  const scales = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];
  const triples: number[] = [];
  while (n > 0) {
    triples.push(n % 1000);
    n = Math.floor(n / 1000);
  }
  const parts: string[] = [];
  for (let i = triples.length - 1; i >= 0; i--) {
    if (triples[i] === 0) continue;
    parts.push(readTriple(triples[i], i !== triples.length - 1) + scales[i]);
  }
  const sentence = parts.join(' ').replace(/\s+/g, ' ').trim();
  return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ' đồng';
}

// ── Render ────────────────────────────────────────────────────────────────────

const DOTS = '………………………………';

function dots(value?: string | number | null, fallback = DOTS): string {
  if (value === null || value === undefined) return fallback;
  const s = String(value).trim();
  return s || fallback;
}

function vnDate(value?: string | null): string {
  if (!value) return 'ngày ………… tháng ………… năm …………';
  const d = new Date(value);
  return `ngày ${String(d.getDate()).padStart(2, '0')} tháng ${String(d.getMonth() + 1).padStart(2, '0')} năm ${d.getFullYear()}`;
}

const S: Record<string, React.CSSProperties> = {
  page: {
    fontFamily: "'Times New Roman', 'Tinos', serif",
    fontSize: '13px',
    lineHeight: 1.55,
    color: '#111',
    background: '#fff',
    width: '100%',
    maxWidth: '794px',
    margin: '0 auto',
    padding: '40px 40px',
    boxSizing: 'border-box',
    position: 'relative',
  },
  centerBold: { textAlign: 'center', fontWeight: 700 },
  title: { textAlign: 'center', fontWeight: 700, fontSize: '17px', margin: '14px 0 2px' },
  articleTitle: { fontWeight: 700, margin: '12px 0 4px' },
  p: { margin: '4px 0', textAlign: 'justify' },
  indent: { margin: '2px 0 2px 18px', textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '8px 0', fontSize: '12.5px' },
  th: { border: '1px solid #111', padding: '5px 6px', fontWeight: 700, textAlign: 'center', background: '#f5f5f5' },
  td: { border: '1px solid #111', padding: '5px 6px', verticalAlign: 'top' },
  watermark: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
    zIndex: 1,
  },
  watermarkText: {
    fontSize: '80px',
    fontWeight: 800,
    color: 'rgba(220, 38, 38, 0.10)',
    transform: 'rotate(-28deg)',
    whiteSpace: 'nowrap',
    letterSpacing: '8px',
  },
};

function PartyBlock({ title, party, isCompany }: { title: string; party: ContractParty; isCompany?: boolean }) {
  return (
    <div style={{ margin: '8px 0' }}>
      <p style={{ ...S.p, fontWeight: 700 }}>{title}</p>
      <p style={S.indent}>
        {isCompany ? 'Tên đơn vị' : 'Tên tổ chức / cá nhân'}: {dots(party?.name)}
      </p>
      <p style={S.indent}>Địa chỉ: {dots(party?.address)}</p>
      <p style={S.indent}>
        Đại diện: {dots(party?.representative, '……………………')} &nbsp;&nbsp;Chức vụ: {dots(party?.position, '……………………')}
      </p>
      <p style={S.indent}>
        Điện thoại: {dots(party?.phone, '……………………')} &nbsp;&nbsp;Email: {dots(party?.email, '……………………')}
      </p>
      <p style={S.indent}>
        {isCompany ? 'Mã số thuế' : 'Mã số thuế / CCCD'}: {dots(party?.taxCode, '……………………')}
      </p>
    </div>
  );
}

export default function ContractDocument({
  data,
  watermark,
}: {
  data: PublicContract;
  watermark?: string;
}) {
  const d = data.signDate ? new Date(data.signDate) : null;

  return (
    <div id="contract-doc" style={S.page}>
      {watermark && (
        <div style={S.watermark}>
          <span style={S.watermarkText}>{watermark}</span>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{ ...S.centerBold, margin: 0 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p style={{ ...S.centerBold, margin: '2px 0', textDecoration: 'underline' }}>
          Độc lập – Tự do – Hạnh phúc
        </p>

        <p style={S.title}>HỢP ĐỒNG THIẾT KẾ VÀ SẢN XUẤT SẢN PHẨM IN 3D</p>
        <p style={{ textAlign: 'center', margin: '0 0 10px' }}>Số: {dots(data.contractNo, '…………/HĐ-…………')}</p>

        <p style={{ ...S.p, fontStyle: 'italic' }}>– Căn cứ Bộ luật Dân sự số 91/2015/QH13;</p>
        <p style={{ ...S.p, fontStyle: 'italic' }}>– Căn cứ Luật Thương mại số 36/2005/QH11;</p>
        <p style={{ ...S.p, fontStyle: 'italic' }}>– Căn cứ nhu cầu và khả năng của hai bên.</p>

        <p style={S.p}>
          Hôm nay, ngày {d ? String(d.getDate()).padStart(2, '0') : '…………'} tháng{' '}
          {d ? String(d.getMonth() + 1).padStart(2, '0') : '…………'} năm {d ? d.getFullYear() : '…………'}, tại{' '}
          {dots(data.signPlace)}, chúng tôi gồm:
        </p>

        <PartyBlock title="BÊN A (BÊN ĐẶT HÀNG):" party={data.partyA} />
        <PartyBlock title="BÊN B (BÊN THIẾT KẾ VÀ SẢN XUẤT):" party={data.partyB} isCompany />

        <p style={S.p}>Sau khi bàn bạc, hai bên thống nhất ký kết hợp đồng với các điều khoản sau:</p>

        <p style={S.articleTitle}>Điều 1. Nội dung hợp đồng</p>
        <p style={S.p}>
          1.1. Bên A giao và Bên B nhận thực hiện việc thiết kế và sản xuất (in 3D) sản phẩm theo yêu cầu
          của Bên A, chi tiết như sau:
        </p>
        <table style={S.table}>
          <thead>
            <tr>
              <th style={{ ...S.th, width: '36px' }}>STT</th>
              <th style={{ ...S.th, width: '90px' }}>Mã sản phẩm</th>
              <th style={S.th}>Tên sản phẩm</th>
              <th style={{ ...S.th, width: '62px' }}>Số lượng</th>
              <th style={{ ...S.th, width: '100px' }}>Đơn giá (VNĐ)</th>
              <th style={{ ...S.th, width: '110px' }}>Thành tiền (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={`${item.productId}-${i}`}>
                <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                <td style={{ ...S.td, textAlign: 'center' }}>{item.productCode}</td>
                <td style={S.td}>{item.productName}</td>
                <td style={{ ...S.td, textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ ...S.td, textAlign: 'right' }}>{item.unitPrice.toLocaleString('vi-VN')}</td>
                <td style={{ ...S.td, textAlign: 'right' }}>{item.subtotal.toLocaleString('vi-VN')}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} style={{ ...S.td, textAlign: 'center', fontWeight: 700 }}>Tổng cộng</td>
              <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>
                {data.totalAmount.toLocaleString('vi-VN')}
              </td>
            </tr>
          </tbody>
        </table>
        <p style={S.p}>
          1.2. Yêu cầu kỹ thuật khác (công nghệ in FDM/SLA/SLS, độ dày lớp in, xử lý bề mặt, độ đặc…):{' '}
          {dots(data.technicalRequirements, 'KHÔNG')}
        </p>

        <p style={S.articleTitle}>Điều 2. Thiết kế và duyệt mẫu</p>
        <p style={S.p}>
          2.1. Bên B thiết kế file 3D dựa trên yêu cầu, bản vẽ, hình ảnh hoặc mẫu vật do Bên A cung cấp.
        </p>
        <p style={S.p}>
          2.2. Bên A được yêu cầu chỉnh sửa thiết kế tối đa 05 lần miễn phí; từ lần tiếp theo tính phí
          50.000 VNĐ/lần.
        </p>
        <p style={S.p}>
          2.3. Bên B chỉ tiến hành sản xuất sau khi Bên A xác nhận duyệt thiết kế (qua email, tin nhắn
          hoặc văn bản). Bản thiết kế đã duyệt là căn cứ để nghiệm thu sản phẩm.
        </p>
        <p style={S.p}>
          2.4. Yêu cầu thay đổi thiết kế sau khi đã duyệt được coi là yêu cầu mới; hai bên thỏa thuận lại
          chi phí và thời gian thực hiện.
        </p>

        <p style={S.articleTitle}>Điều 3. Giá trị hợp đồng và thanh toán</p>
        <p style={S.p}>
          3.1. Tổng giá trị hợp đồng: <b>{formatCurrency(data.totalAmount)}</b> (bằng chữ:{' '}
          <i>{numberToVietnameseWords(data.totalAmount)}</i>). Giá trên đã bao gồm thuế GTGT và chi phí
          vận chuyển.
        </p>
        <p style={S.p}>3.2. Thanh toán chia thành 03 đợt:</p>
        <p style={S.indent}>
          – Đợt 1: Bên A tạm ứng 50% giá trị hợp đồng ({formatCurrency(Math.round(data.totalAmount * 0.5))})
          ngay khi ký hợp đồng;
        </p>
        <p style={S.indent}>
          – Đợt 2: thanh toán 40% giá trị hợp đồng ({formatCurrency(Math.round(data.totalAmount * 0.4))})
          khi nghiệm thu;
        </p>
        <p style={S.indent}>
          – Đợt 3: thanh toán 10% còn lại sau 05 ngày kể từ ngày nghiệm thu.
        </p>
        <p style={S.p}>
          3.3. Hình thức thanh toán: tiền mặt hoặc chuyển khoản. Số tài khoản: {dots(data.bankAccountNumber, '……………………')}{' '}
          Ngân hàng: {dots(data.bankName, '……………………')} Chủ tài khoản: {dots(data.bankAccountHolder, '……………………')}
        </p>

        <p style={S.articleTitle}>Điều 4. Thời gian thực hiện và giao nhận</p>
        <p style={S.p}>4.1. Thời gian giao hàng: {vnDate(data.deliveryDate)}.</p>
        <p style={S.p}>
          4.2. Địa điểm giao hàng: {dots(data.deliveryAddress)}. Chi phí vận chuyển do Bên B chịu (đã bao
          gồm trong giá trị hợp đồng).
        </p>
        <p style={S.p}>
          4.3. Bên A kiểm tra và nghiệm thu số lượng, ngoại quan sản phẩm khi Bên B bàn giao; khiếu nại
          (nếu có) gửi cho Bên B trong vòng 05 ngày làm việc kể từ ngày nghiệm thu.
        </p>

        <p style={S.articleTitle}>Điều 5. Tiêu chuẩn chất lượng và sai số</p>
        <p style={S.p}>5.1. Sản phẩm được xem là đạt yêu cầu khi:</p>
        <p style={S.indent}>– Đúng mẫu thiết kế hoặc mẫu đối chứng đã được duyệt;</p>
        <p style={S.indent}>– Đúng vật liệu, màu sắc và số lượng đã thống nhất;</p>
        <p style={S.indent}>– Không bị gãy, nứt hoặc thiếu chi tiết làm mất công năng;</p>
        <p style={S.indent}>– Các bộ phận lắp ráp hoạt động theo yêu cầu đã thống nhất;</p>
        <p style={S.indent}>– Bề mặt được làm sạch cơ bản;</p>
        <p style={S.indent}>– Phụ kiện được lắp hoặc đóng kèm đầy đủ;</p>
        <p style={S.indent}>– Được đóng gói theo thỏa thuận.</p>
        <p style={S.p}>5.2. Sai số kích thước cho phép:</p>
        <p style={S.indent}>– Kích thước dưới 50 mm: ±0,1 mm;</p>
        <p style={S.indent}>– Kích thước từ 50 mm đến dưới 150 mm: ±1 mm;</p>
        <p style={S.indent}>– Kích thước từ 150 mm trở lên: ±10 mm;</p>
        <p style={S.indent}>– Sai số lắp ghép hoặc chi tiết kỹ thuật: theo bản vẽ hoặc mẫu thử đã được duyệt.</p>
        <p style={S.p}>
          5.3. Đối với sản phẩm yêu cầu độ chính xác cao, hai bên phải ghi rõ dung sai riêng bằng văn bản
          trước khi sản xuất.
        </p>

        <p style={S.articleTitle}>Điều 6. Quyền và nghĩa vụ của các bên</p>
        <p style={S.p}>
          6.1. Bên A: cung cấp đầy đủ, chính xác yêu cầu và tài liệu liên quan; duyệt thiết kế đúng thời
          hạn; thanh toán và nghiệm thu sản phẩm theo đúng thỏa thuận.
        </p>
        <p style={S.p}>
          6.2. Bên B: thiết kế và sản xuất đúng mẫu đã duyệt, đúng tiến độ; bảo mật thông tin, tài liệu
          và file thiết kế của Bên A; thông báo kịp thời cho Bên A các vấn đề phát sinh trong quá trình
          thực hiện.
        </p>

        <p style={S.articleTitle}>Điều 7. Chậm thanh toán</p>
        <p style={S.p}>Nếu Bên A chậm thanh toán, Bên B có quyền:</p>
        <p style={S.indent}>– Tạm ngừng thiết kế, sản xuất hoặc giao hàng;</p>
        <p style={S.indent}>– Điều chỉnh lại thời hạn hoàn thành tương ứng;</p>
        <p style={S.indent}>– Yêu cầu bồi thường các thiệt hại thực tế phát sinh.</p>

        <p style={S.articleTitle}>Điều 8. Xử lý sản phẩm không đạt</p>
        <p style={S.p}>
          8.1. Đối với sản phẩm được xác định là lỗi do Bên B, Bên B sẽ lựa chọn một hoặc nhiều phương
          án: sửa chữa; sản xuất bù; đổi sản phẩm; hoàn lại giá trị tương ứng của sản phẩm lỗi; hoặc giảm
          giá theo thỏa thuận.
        </p>
        <p style={S.p}>8.2. Bên B không chịu trách nhiệm đối với lỗi phát sinh do:</p>
        <p style={S.indent}>– Bên A sử dụng sai mục đích;</p>
        <p style={S.indent}>– Bảo quản không đúng hướng dẫn;</p>
        <p style={S.indent}>– Để sản phẩm tiếp xúc với nhiệt độ, tải trọng hoặc hóa chất vượt mức đã thống nhất;</p>
        <p style={S.indent}>– Tự ý sửa chữa, khoan, cắt, nung, sơn hoặc thay đổi kết cấu;</p>
        <p style={S.indent}>– Hao mòn tự nhiên;</p>
        <p style={S.indent}>– Hư hỏng trong quá trình vận chuyển thuộc trách nhiệm của đơn vị vận chuyển;</p>
        <p style={S.indent}>– Thiết kế, kích thước hoặc tài liệu kỹ thuật do Bên A cung cấp có sai sót.</p>

        <p style={S.articleTitle}>Điều 9. Sở hữu trí tuệ</p>
        <p style={S.p}>9.1. File thiết kế 3D thuộc quyền sở hữu của Bên A; Bên A được lưu file vĩnh viễn.</p>
        <p style={S.p}>
          9.2. Bên B không được sử dụng file thiết kế này để sản xuất, mua bán dưới bất kỳ hình thức nào
          nếu chưa được Bên A chấp thuận.
        </p>
        <p style={S.p}>
          9.3. Bên A cam kết nội dung đặt hàng không vi phạm quyền sở hữu trí tuệ của bên thứ ba và tự
          chịu trách nhiệm nếu phát sinh tranh chấp liên quan.
        </p>

        <p style={S.articleTitle}>Điều 10. Giới hạn mục đích sử dụng</p>
        <p style={S.p}>
          10.1. Trừ khi được hai bên thỏa thuận rõ bằng văn bản, sản phẩm không mặc nhiên được chứng nhận
          để sử dụng cho:
        </p>
        <p style={S.indent}>– Thiết bị y tế;</p>
        <p style={S.indent}>– Chi tiết an toàn của phương tiện giao thông;</p>
        <p style={S.indent}>– Chi tiết chịu tải trọng lớn;</p>
        <p style={S.indent}>– Thiết bị điện hoặc phòng cháy chữa cháy;</p>
        <p style={S.indent}>– Sản phẩm tiếp xúc trực tiếp với thực phẩm;</p>
        <p style={S.indent}>– Đồ chơi dành cho trẻ nhỏ;</p>
        <p style={S.indent}>– Vật dụng chịu nhiệt độ cao;</p>
        <p style={S.indent}>– Thiết bị bảo hộ;</p>
        <p style={S.indent}>– Các ứng dụng khác có thể gây nguy hiểm đến sức khỏe hoặc tính mạng.</p>
        <p style={S.p}>
          10.2. Bên A phải thông báo trước cho Bên B nếu sản phẩm được sử dụng cho một trong các mục đích
          trên.
        </p>
        <p style={S.p}>
          10.3. Bên B chỉ chịu trách nhiệm về khả năng sử dụng đặc biệt khi nội dung đó được ghi nhận rõ
          bằng văn bản và sản phẩm đã được kiểm tra theo tiêu chuẩn tương ứng.
        </p>

        <p style={S.articleTitle}>Điều 11. Bảo hành</p>
        <p style={S.p}>11.1. Thời hạn bảo hành: 30 (ba mươi) ngày kể từ ngày nghiệm thu.</p>
        <p style={S.p}>11.2. Phạm vi bảo hành áp dụng đối với:</p>
        <p style={S.indent}>– Lỗi gãy, nứt hoặc tách lớp do quá trình sản xuất;</p>
        <p style={S.indent}>– Lỗi lắp ráp do Bên B thực hiện;</p>
        <p style={S.indent}>– Thiếu hoặc sai phụ kiện;</p>
        <p style={S.indent}>– Sản phẩm không thực hiện được công năng đã thống nhất do lỗi sản xuất.</p>
        <p style={S.p}>11.3. Không thuộc phạm vi bảo hành:</p>
        <p style={S.indent}>– Trầy xước hoặc hao mòn trong quá trình sử dụng;</p>
        <p style={S.indent}>– Sản phẩm bị biến dạng do nhiệt;</p>
        <p style={S.indent}>– Sản phẩm bị rơi, va đập, chịu tải quá mức;</p>
        <p style={S.indent}>
          – Sản phẩm bị ngâm nước hoặc tiếp xúc hóa chất khi không được thiết kế cho mục đích đó;
        </p>
        <p style={S.indent}>– Hư hỏng do sử dụng sai hướng dẫn;</p>
        <p style={S.indent}>
          – Chênh lệch nhỏ về màu sắc, đường lớp in hoặc dấu support nằm trong giới hạn chấp nhận;
        </p>
        <p style={S.indent}>– Sản phẩm mẫu, hàng thanh lý hoặc hàng được thông báo không bảo hành.</p>

        <p style={S.articleTitle}>Điều 12. Sự kiện bất khả kháng</p>
        <p style={S.p}>
          12.1. Sự kiện bất khả kháng là sự kiện xảy ra khách quan, không thể dự đoán hợp lý và không thể
          khắc phục dù bên bị ảnh hưởng đã áp dụng các biện pháp cần thiết, bao gồm nhưng không giới hạn:
          thiên tai; hỏa hoạn; dịch bệnh; chiến tranh; bạo loạn; mất điện diện rộng kéo dài; hạn chế vận
          chuyển; quyết định của cơ quan nhà nước; sự cố hạ tầng nghiêm trọng ngoài khả năng kiểm soát.
        </p>
        <p style={S.p}>
          12.2. Bên bị ảnh hưởng phải: (a) thông báo cho bên còn lại trong thời gian sớm nhất; (b) cung
          cấp thông tin về mức độ ảnh hưởng; (c) áp dụng biện pháp hợp lý để hạn chế thiệt hại; (d) tiếp
          tục thực hiện nghĩa vụ ngay khi sự kiện chấm dứt.
        </p>
        <p style={S.p}>
          12.3. Thời hạn thực hiện hợp đồng được gia hạn tương ứng với thời gian bị ảnh hưởng. Nếu sự
          kiện kéo dài quá 05 ngày làm việc, hai bên sẽ thỏa thuận tiếp tục, điều chỉnh hoặc chấm dứt hợp
          đồng.
        </p>

        <p style={S.articleTitle}>Điều 13. Thông báo và xác nhận điện tử</p>
        <p style={S.p}>
          13.1. Các thông báo, xác nhận thiết kế, duyệt mẫu, báo giá phát sinh và thỏa thuận thực hiện
          qua các phương tiện sau được xem là bằng chứng giao dịch giữa hai bên: email; Zalo; Messenger;
          nền tảng quản lý công việc; chữ ký điện tử; tài liệu điện tử; hoặc phương tiện khác được hai
          bên thống nhất.
        </p>
        <p style={S.p}>13.2. Thông tin liên hệ chính thức:</p>
        <p style={S.indent}>
          – Bên A: {dots([data.partyA?.phone, data.partyA?.email].filter(Boolean).join(' – '))}
        </p>
        <p style={S.indent}>
          – Bên B: {dots([data.partyB?.phone, data.partyB?.email].filter(Boolean).join(' – '))}
        </p>
        <p style={S.p}>
          13.3. Mỗi bên phải thông báo bằng văn bản cho bên còn lại khi thay đổi thông tin liên hệ.
        </p>

        <p style={S.articleTitle}>Điều 14. Hủy hợp đồng và giải quyết tranh chấp</p>
        <p style={S.p}>
          14.1. Nếu Bên A hủy đơn hàng sau khi đã duyệt thiết kế hoặc sản phẩm đã được sản xuất, Bên A
          không được hoàn lại tiền tạm ứng và phải thanh toán giá trị phần công việc Bên B đã thực hiện.
        </p>
        <p style={S.p}>
          14.2. Trường hợp Bên A chậm thanh toán đợt 3 quá 05 ngày làm việc, Bên A chịu phạt 200% giá trị
          hợp đồng cho mỗi 05 ngày làm việc chậm, trừ trường hợp bất khả kháng.
        </p>
        <p style={S.p}>
          14.3. Mọi tranh chấp phát sinh được hai bên ưu tiên giải quyết bằng thương lượng, hòa giải; nếu
          không thành, tranh chấp được đưa ra Tòa án có thẩm quyền giải quyết theo quy định của pháp
          luật.
        </p>

        <p style={S.articleTitle}>Điều 15. Điều khoản chung</p>
        <p style={S.p}>
          15.1. Hợp đồng có hiệu lực kể từ ngày ký. Mọi sửa đổi, bổ sung phải được lập thành văn bản hoặc
          phụ lục có xác nhận của cả hai bên.
        </p>
        <p style={S.p}>
          15.2. Hợp đồng được lập thành 02 (hai) bản có giá trị pháp lý như nhau, mỗi bên giữ 01 (một)
          bản.
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '28px', textAlign: 'center' }}>
          <div>
            <p style={{ fontWeight: 700, margin: 0 }}>ĐẠI DIỆN BÊN A</p>
            <p style={{ fontStyle: 'italic', margin: '2px 0 70px' }}>(Ký, ghi rõ họ tên)</p>
            <p style={{ margin: 0 }}>{data.partyA?.representative || data.partyA?.name || ''}</p>
          </div>
          <div>
            <p style={{ fontWeight: 700, margin: 0 }}>ĐẠI DIỆN BÊN B</p>
            <p style={{ fontStyle: 'italic', margin: '2px 0 70px' }}>(Ký, ghi rõ họ tên)</p>
            <p style={{ margin: 0 }}>{data.partyB?.representative || data.partyB?.name || ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
