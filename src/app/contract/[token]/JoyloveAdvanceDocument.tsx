'use client';

import { numberToVietnameseWords } from './ContractDocument';

/**
 * Template JOYLOVE_ADVANCE — dựng theo mẫu JOYLOVE_Luxe_Glow_Hop_dong.pdf (15 Điều + Phụ lục 01, 02).
 * Mirror backend joylove-advance-pdf.definition.ts và frontend-admin JoyloveAdvanceDocument.tsx —
 * sửa văn bản phải sửa cả 3 nơi.
 */

interface DocParty {
  name: string;
  address: string;
  representative: string;
  position: string;
  phone: string;
  email: string;
  taxCode: string;
}

/** Kiểu cấu trúc tối thiểu — tương thích cả ContractDocData (admin) lẫn PublicContract (user) */
export interface JoyloveDocData {
  contractNo: string;
  createdAt?: string;
  items: { productId?: string; productCode: string; productName: string; quantity: number; unitPrice: number; subtotal: number }[];
  totalAmount: number;
  partyA: DocParty;
  partyB: DocParty;
  technicalRequirements: string;
  paymentSchedule: { percent: number; timing: string }[];
  bankAccountNumber: string;
  bankName: string;
  bankAccountHolder: string;
  deliveryDate?: string;
  deliveryAddress: string;
}

const NAVY = '#1f2a44';
const DOTS = '………………………………';
const SHORT_DOTS = '……………………';
const DOTS_LONG = '……………………………………';

function dots(value?: string | number | null, fallback = DOTS): string {
  if (value === null || value === undefined) return fallback;
  const s = String(value).trim();
  return s || fallback;
}

function dmy(value?: string | null): string {
  if (!value) return '……/……/…………';
  const d = new Date(value);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const num = (n: number) => n.toLocaleString('vi-VN');

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
    padding: '32px 48px 48px',
    boxSizing: 'border-box',
    position: 'relative',
  },
  runningHeader: { textAlign: 'right', fontSize: '10px', color: '#6b7280', margin: '0 0 18px', letterSpacing: '0.3px' },
  centerBold: { textAlign: 'center', fontWeight: 700, margin: 0 },
  title: { textAlign: 'center', fontWeight: 700, fontSize: '17px', color: NAVY, margin: '12px 0 0' },
  section: { fontWeight: 700, color: NAVY, fontSize: '14px', margin: '14px 0 4px' },
  article: { fontWeight: 700, color: NAVY, margin: '12px 0 4px' },
  p: { margin: '4px 0', textAlign: 'justify' },
  line: { margin: '2px 0' },
  sub: { margin: '2px 0 4px 18px', textAlign: 'justify' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '6px 0', fontSize: '12.5px' },
  th: { border: '1px solid #b8c0cc', padding: '4px 6px', fontWeight: 700, textAlign: 'left', background: '#e8edf5', color: NAVY },
  td: { border: '1px solid #b8c0cc', padding: '4px 6px', verticalAlign: 'top' },
  pageBreak: { breakBefore: 'page', pageBreakBefore: 'always', borderTop: '1px dashed #cbd5e1', marginTop: '28px', paddingTop: '20px' },
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
    fontSize: '90px',
    fontWeight: 800,
    color: 'rgba(220, 38, 38, 0.10)',
    transform: 'rotate(-28deg)',
    whiteSpace: 'nowrap',
    letterSpacing: '8px',
  },
};

function Clause({ no, children }: { no: string; children: React.ReactNode }) {
  return (
    <p style={S.p}>
      <b>{no}</b> {children}
    </p>
  );
}

function Label({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p style={S.line}>
      <b>{label}:</b> {children}
    </p>
  );
}

function Signatures({ title, names }: { title: string; names?: [string, string] }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '22px', textAlign: 'center' }}>
      {(['A', 'B'] as const).map((side, i) => (
        <div key={side}>
          <p style={{ fontWeight: 700, color: NAVY, margin: 0 }}>
            {title} BÊN {side} – {side === 'A' ? 'JOYLOVE' : 'LUXE GLOW'}
          </p>
          <p style={{ fontStyle: 'italic', margin: names ? '2px 0 64px' : '2px 0 0' }}>
            (Ký trực tiếp hoặc ký điện tử hợp lệ)
          </p>
          {names && <p style={{ margin: 0 }}>{names[i]}</p>}
        </div>
      ))}
    </div>
  );
}

export default function JoyloveAdvanceDocument({
  data,
  watermark,
}: {
  data: JoyloveDocData;
  watermark?: string;
}) {
  const A = data.partyA;
  const B = data.partyB;
  const total = num(data.totalAmount);
  const schedule = data.paymentSchedule ?? [];
  const partyASigner = A?.representative || A?.name || '';
  const partyBSigner = B?.representative || B?.name || '';

  // Phụ lục 02 — tối thiểu 3 dòng như mẫu
  const handoverPadding = Math.max(0, 3 - data.items.length);

  return (
    <div id="contract-doc" style={S.page}>
      {watermark && (
        <div style={S.watermark}>
          <span style={S.watermarkText}>{watermark}</span>
        </div>
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={S.runningHeader}>HỢP ĐỒNG THIẾT KẾ &amp; SẢN XUẤT IN 3D &nbsp;|&nbsp; DỰ ÁN JOYLOVE</p>

        <p style={S.centerBold}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
        <p style={{ ...S.centerBold, margin: '2px 0', textDecoration: 'underline' }}>Độc lập – Tự do – Hạnh phúc</p>
        <p style={S.title}>HỢP ĐỒNG THIẾT KẾ VÀ SẢN XUẤT SẢN PHẨM IN 3D</p>
        <p style={{ ...S.centerBold, color: NAVY }}>(DÀNH CHO DỰ ÁN JOYLOVE)</p>
        <p style={{ textAlign: 'center', margin: '2px 0 12px' }}>Số: {dots(data.contractNo, '…………/HĐ-…………')}</p>

        <p style={S.p}>
          Căn cứ Bộ luật Dân sự năm 2015; Luật Thương mại năm 2005; Luật Giao dịch điện tử năm 2023 và các quy
          định pháp luật hiện hành có liên quan;
        </p>
        <p style={S.p}>
          Căn cứ nhu cầu đặt hàng của Bên A và khả năng cung cấp dịch vụ thiết kế, sản xuất in 3D của Bên B;
        </p>
        <p style={S.p}>
          Ngày lập văn bản: {dmy(data.createdAt)}. Ngày ký và thời điểm có hiệu lực được xác định theo Điều 15.2
          của Hợp đồng.
        </p>

        <p style={S.section}>BÊN A – BÊN ĐẶT HÀNG (DỰ ÁN JOYLOVE)</p>
        <Label label="Tên pháp nhân/hộ kinh doanh/cá nhân ký hợp đồng">{dots(A?.name)}</Label>
        <Label label="Tên thương mại/nhãn hiệu sử dụng trong đơn hàng">JOYLOVE</Label>
        <Label label="Địa chỉ đăng ký">{dots(A?.address)}</Label>
        <Label label="Mã số thuế / Số đăng ký / CCCD">{dots(A?.taxCode)}</Label>
        <p style={S.line}>
          <b>Đại diện:</b> {dots(A?.representative, SHORT_DOTS)} &nbsp;&nbsp;&nbsp; Chức vụ: {dots(A?.position, SHORT_DOTS)}
        </p>
        <p style={S.line}>
          <b>Điện thoại:</b> {dots(A?.phone, SHORT_DOTS)} &nbsp;&nbsp;&nbsp; Email: {dots(A?.email, SHORT_DOTS)}
        </p>

        <p style={S.section}>BÊN B – BÊN THIẾT KẾ VÀ SẢN XUẤT (LUXE GLOW)</p>
        <p style={S.line}>
          <b>Tên đăng ký kinh doanh:</b> {dots(B?.name)} (thương hiệu: Luxe Glow)
        </p>
        <Label label="Địa chỉ đăng ký">{dots(B?.address)}</Label>
        <Label label="Mã số thuế / Số đăng ký">{dots(B?.taxCode)}</Label>
        <Label label="Đại diện/chủ hộ">{dots(B?.representative)}</Label>
        <p style={S.line}>
          <b>Điện thoại:</b> {dots(B?.phone, SHORT_DOTS)} &nbsp;&nbsp;&nbsp; Email: {dots(B?.email, SHORT_DOTS)}
        </p>
        <p style={{ ...S.p, marginTop: '8px' }}>
          Sau khi thỏa thuận, Bên A và Bên B (sau đây gọi chung là “Hai Bên”) thống nhất ký kết Hợp đồng với các
          điều khoản sau:
        </p>

        {/* ── Điều 1 ── */}
        <p style={S.article}>Điều 1. Đối tượng và phạm vi hợp đồng</p>
        <Clause no="1.1.">
          Bên A giao và Bên B nhận thiết kế, sản xuất sản phẩm in 3D cho dự án JOYLOVE. Danh mục sản phẩm, số
          lượng, vật liệu, màu sắc, kích thước, đơn giá, tiêu chuẩn và phương án đóng gói được ghi tại Phụ lục 01,
          là bộ phận không tách rời của Hợp đồng.
        </Clause>
        <Clause no="1.2.">
          Sản phẩm được sản xuất theo mẫu thực tế/bản thiết kế hoặc mẫu tham chiếu được Bên A phê duyệt, cùng các
          yêu cầu kỹ thuật và dung sai chấp nhận ghi trong Phụ lục 01. Chỉ các thông số đã được hai bên xác nhận
          mới là cơ sở bắt buộc để đánh giá.
        </Clause>
        <Clause no="1.3.">
          Bên B không tự ý thay đổi vật liệu, màu sắc, kích thước, kết cấu, công năng hoặc thông số đã cam kết nếu
          thay đổi ảnh hưởng đến chất lượng sản phẩm, trừ khi Bên A chấp thuận bằng văn bản. Bên B được chủ động
          tối ưu thông số và quy trình kỹ thuật nội bộ (ví dụ: hướng in, nhiệt độ, tốc độ, support) với điều kiện
          sản phẩm đáp ứng yêu cầu đã duyệt.
        </Clause>
        <Clause no="1.4.">
          Bên A được từ chối nghiệm thu phần sản phẩm có sai lệch được xác định khách quan so với mẫu, bản vẽ hoặc
          tiêu chuẩn đã duyệt; việc khắc phục được thực hiện theo Điều 8 của Hợp đồng.
        </Clause>

        {/* ── Điều 2 ── */}
        <p style={S.article}>Điều 2. Thiết kế, chỉnh sửa và phê duyệt mẫu</p>
        <Clause no="2.1.">
          Bên B thực hiện thiết kế 3D dựa trên thông tin, hình ảnh, mẫu hoặc dữ liệu do Bên A cung cấp; Bên A chịu
          trách nhiệm về tính chính xác và quyền sử dụng hợp pháp của các tài liệu này.
        </Clause>
        <Clause no="2.2.1.">
          Bên A được yêu cầu tối đa 05 vòng chỉnh sửa miễn phí trong phạm vi yêu cầu ban đầu đã thống nhất. Một
          vòng chỉnh sửa là một lần Bên A tổng hợp và gửi phản hồi đối với một phiên bản thiết kế do Bên B bàn
          giao; từ vòng thứ 06, phí chỉnh sửa là 50.000 đồng/vòng, nếu không thuộc trường hợp tại Điều 2.2.2 hoặc
          2.2.3.
        </Clause>
        <Clause no="2.2.2.">
          Các sửa đổi nhằm khắc phục lỗi, thiếu sót hoặc nội dung không phù hợp yêu cầu đã được hai bên xác nhận
          do trách nhiệm của Bên B không tính vào số vòng miễn phí và không phát sinh chi phí bổ sung cho Bên A.
        </Clause>
        <Clause no="2.2.3.">
          Thay đổi vượt phạm vi thiết kế ban đầu, thay đổi đáng kể cấu trúc/công năng/độ phức tạp hoặc phát sinh
          công việc mới phải được hai bên thống nhất bằng văn bản về nội dung, chi phí và tiến độ trước khi thực
          hiện; không áp dụng mặc định mức 50.000 đồng/vòng đối với các thay đổi này.
        </Clause>
        <Clause no="2.3.">
          Bên B chỉ triển khai sản xuất hàng loạt sau khi Bên A xác nhận duyệt mẫu/thiết kế qua kênh quy định tại
          Điều 13 và sau khi Bên B nhận đủ thanh toán đợt 1. Phiên bản được duyệt phải có mã phiên bản hoặc tài
          liệu nhận diện rõ ràng.
        </Clause>
        <Clause no="2.4.">
          Thay đổi sau khi đã duyệt mẫu được xem là yêu cầu phát sinh. Hai Bên thống nhất lại chi phí, ảnh hưởng
          tiến độ và cách xử lý vật tư/sản phẩm đã làm trước khi thực hiện. Thời gian Bên A chậm cung cấp dữ liệu
          hoặc chậm duyệt mẫu làm gia hạn tiến độ tương ứng với ảnh hưởng thực tế.
        </Clause>

        {/* ── Điều 3 ── */}
        <p style={S.article}>Điều 3. Giá trị hợp đồng, thuế và thanh toán</p>
        <Clause no="3.1.">
          Tổng giá trị Hợp đồng: <b>{total} đồng</b> (bằng chữ: <i>{numberToVietnameseWords(data.totalAmount)}</i>).
          Đây là giá trọn gói cho phạm vi tại Phụ lục 01, đã tính đến nghĩa vụ thuế, phí mà Bên B phải thực hiện
          theo chế độ thuế thực tế áp dụng (nếu có), nhưng CHƯA bao gồm phí vận chuyển. Bên B cung cấp hóa
          đơn/chứng từ hợp pháp theo chế độ đăng ký; điều khoản này không đồng nghĩa với cam kết phát hành hóa đơn
          GTGT theo phương pháp khấu trừ nếu Bên B không thuộc đối tượng áp dụng.
        </Clause>
        <Clause no="3.2.">
          Thanh toán bằng chuyển khoản hoặc hình thức hợp pháp khác mà hai bên thống nhất, chia thành{' '}
          {String(schedule.length).padStart(2, '0')} đợt:
        </Clause>
        {schedule.map((installment, i) => {
          const amount = Math.round((data.totalAmount * installment.percent) / 100);
          return (
            <p style={S.sub} key={i}>
              {String.fromCharCode(97 + i)}) Đợt {i + 1}: {installment.percent}% giá trị Hợp đồng, tương đương{' '}
              {num(amount)} đồng, {dots(installment.timing, SHORT_DOTS)}.
              {i === 0 &&
                ' Bên B bắt đầu triển khai theo Điều 4 sau khi nhận đủ khoản thanh toán này và đủ tài liệu đầu vào cần thiết.'}
              {i > 0 && i === schedule.length - 1 &&
                ' Đối với nghiệm thu từng phần, khoản phải trả được xác định theo giá trị phần đã nghiệm thu; Bên A không giữ lại thanh toán của phần đạt yêu cầu chỉ vì phần khác còn lỗi.'}
            </p>
          );
        })}
        <Clause no="3.3.">
          Tài khoản thụ hưởng: {dots(data.bankAccountNumber)}; Ngân hàng: {dots(data.bankName)}; Chủ tài khoản:{' '}
          {dots(data.bankAccountHolder)}. Nội dung chuyển khoản ghi rõ mã Hợp đồng và đợt thanh toán.
        </Clause>
        <Clause no="3.4.">
          Mọi thay đổi làm phát sinh giá trị Hợp đồng chỉ có hiệu lực sau khi người có thẩm quyền của hai bên xác
          nhận qua kênh chính thức tại Điều 13.
        </Clause>

        {/* ── Điều 4 ── */}
        <p style={S.article}>Điều 4. Tiến độ, giao hàng và nghiệm thu</p>
        <Clause no="4.1.">
          Thời gian hoàn thiện thiết kế: ........ ngày làm việc kể từ khi Bên B nhận đủ tiền đợt 1 và dữ liệu đầu
          vào; thời gian sản xuất: ........ ngày làm việc kể từ ngày Bên A duyệt mẫu và các điều kiện khởi động sản
          xuất được đáp ứng. Lịch giao cụ thể: {data.deliveryDate ? dmy(data.deliveryDate) : DOTS_LONG}. Bất kỳ
          điều chỉnh nào do Bên A chậm duyệt, thay đổi yêu cầu hoặc bất khả kháng được xử lý theo Điều 2 và Điều
          12.
        </Clause>
        <Clause no="4.2.">
          Địa điểm giao hàng: {dots(data.deliveryAddress)}. Người nhận: {SHORT_DOTS}. Phí vận chuyển do hai bên
          thỏa thuận và xác nhận bằng văn bản trước khi gửi hàng; không nằm trong giá trị Hợp đồng tại Điều 3.1.
        </Clause>
        <Clause no="4.3.1.">
          Bên B giao đúng số lượng, chất lượng, thông số, địa điểm và thời hạn đã thỏa thuận; thông báo trước thông
          tin lô hàng, hình thức vận chuyển và chứng từ giao nhận cần thiết.
        </Clause>
        <Clause no="4.3.2.">
          Khi nhận hàng, Bên A kiểm tra sơ bộ số lượng kiện, tình trạng bao bì và lỗi ngoại quan có thể phát hiện
          bằng kiểm tra thông thường. Việc ký nhận hàng không đồng nghĩa với nghiệm thu cuối cùng hoặc từ bỏ quyền
          khiếu nại lỗi tiềm ẩn.
        </Clause>
        <Clause no="4.3.3.">
          Bên A thông báo bằng văn bản các sai lệch số lượng/lỗi ngoại quan thông thường trong 05 ngày làm việc kể
          từ ngày nhận hàng, kèm bằng chứng. Nếu hết thời hạn này mà không có phản hồi hợp lệ, phần hàng không có
          khiếu nại được coi là đã nghiệm thu để xác định nghĩa vụ thanh toán; quyền bảo hành lỗi tiềm ẩn theo
          Điều 11 vẫn được bảo lưu.
        </Clause>
        <Clause no="4.3.4.">
          Lỗi kỹ thuật hoặc lỗi tiềm ẩn không thể nhận biết bằng kiểm tra thông thường được thông báo trong thời
          hạn bảo hành tại Điều 11, trừ khi hai bên có thỏa thuận khác hoặc pháp luật có quy định bắt buộc. Hai bên
          lập biên bản nghiệm thu theo mẫu Phụ lục 02 hoặc xác nhận tương đương qua kênh chính thức.
        </Clause>
        <Clause no="4.3.5.">
          Nếu Bên B giao hàng chậm do lỗi của mình, Bên A thông báo yêu cầu khắc phục trong thời hạn hợp lý. Quyền
          phạt vi phạm, bồi thường hoặc chấm dứt chỉ áp dụng khi có đủ điều kiện theo Hợp đồng và pháp luật; chậm
          trễ do Bên A hoặc sự kiện bất khả kháng được xem xét miễn/trừ trách nhiệm tương ứng theo quy định.
        </Clause>
        <Clause no="4.3.6.">
          Chi phí vận chuyển, đổi trả hoặc thay thế hàng không đạt do lỗi của Bên B do Bên B chịu. Đối với hư hỏng
          trong vận chuyển, trách nhiệm được xác định trên cơ sở nghĩa vụ đóng gói, bên tổ chức vận chuyển và thỏa
          thuận về thời điểm chuyển giao rủi ro tại Phụ lục 01.
        </Clause>

        {/* ── Điều 5 ── */}
        <p style={S.article}>Điều 5. Tiêu chuẩn chất lượng, dung sai và đóng gói</p>
        <Clause no="5.1.">
          Sản phẩm phải đúng mẫu/phương án được duyệt, vật liệu, màu sắc, số lượng và công năng đã cam kết; không
          gãy, nứt, thiếu chi tiết ảnh hưởng công năng; bộ phận lắp ghép hoạt động theo yêu cầu; bề mặt làm sạch và
          phụ kiện/đóng gói theo Phụ lục 01.
        </Clause>
        <Clause no="5.2.">
          Dung sai kích thước, điều kiện ngoại quan, mức chấp nhận đường lớp in 3D, dấu support, sắc độ màu và
          phương pháp kiểm tra được quy định tại Phụ lục 01 hoặc mẫu thực tế đã duyệt. Không mặc nhiên áp dụng cùng
          một dung sai cho mọi kích thước hay bộ phận lắp ghép.
        </Clause>
        <Clause no="5.3.">
          Nếu một tiêu chí chất lượng chưa được thỏa thuận cụ thể, hai bên ưu tiên đối chiếu với mẫu đã được duyệt,
          đặc tính thông thường của công nghệ/vật liệu sản xuất và mục đích sử dụng đã được Bên A công bố. Việc
          đánh giá phải có căn cứ khách quan, không chỉ dựa trên cảm nhận chủ quan.
        </Clause>

        {/* ── Điều 6 ── */}
        <p style={S.article}>Điều 6. Quyền và nghĩa vụ của các bên</p>
        <Clause no="6.1.">
          Bên A có trách nhiệm cung cấp chính xác tài liệu/mẫu/nhãn hiệu được phép sử dụng, phản hồi và duyệt mẫu
          trong thời hạn đã thống nhất; phối hợp xác minh lỗi; nhận hàng và thanh toán đúng hạn. Bên A chỉ sử dụng
          sản phẩm phù hợp mục đích và hướng dẫn đã được Bên B cung cấp.
        </Clause>
        <Clause no="6.2.1.">
          Bên B thiết kế, sản xuất đúng mẫu và tiêu chuẩn đã duyệt, bảo mật dữ liệu và thông báo kịp thời những trở
          ngại ảnh hưởng đáng kể đến tiến độ. Bên B không giao phần việc cốt lõi cho bên thứ ba nếu việc thuê ngoài
          ảnh hưởng đến bí mật hoặc chất lượng mà chưa được Bên A đồng ý; có thể sử dụng dịch vụ phụ trợ thông
          thường với điều kiện vẫn chịu trách nhiệm về kết quả.
        </Clause>
        <Clause no="6.2.2.">
          Bên B chịu trách nhiệm đối với lỗi sản phẩm và các hành vi vi phạm thuộc trách nhiệm của mình theo phạm
          vi Hợp đồng.
        </Clause>
        <Clause no="6.2.3.">
          Bên B không tự ý sử dụng tên, nhãn hiệu, logo, hình ảnh mẫu hoặc hình ảnh sản phẩm JOYLOVE trên website,
          mạng xã hội, hồ sơ năng lực, tài liệu chào bán hoặc quảng cáo khi chưa có sự đồng ý bằng văn bản của Bên
          A.
        </Clause>

        {/* ── Điều 7 ── */}
        <p style={S.article}>Điều 7. Chậm thanh toán và tạm ngừng công việc</p>
        <Clause no="7.1.">
          Trường hợp khoản thanh toán đến hạn không được thực hiện đầy đủ và không có tranh chấp hợp lệ, Bên B gửi
          thông báo bằng văn bản yêu cầu Bên A thanh toán, đồng thời dành tối thiểu 05 ngày làm việc để khắc phục
          kể từ khi Bên A nhận được thông báo.
        </Clause>
        <Clause no="7.2.">
          Hết thời hạn khắc phục mà Bên A vẫn không thanh toán, Bên B được tạm ngừng phần công việc/giao hàng chưa
          thực hiện sau khi thông báo; tiến độ tương ứng được gia hạn theo thời gian bị ảnh hưởng và Bên B được yêu
          cầu lãi chậm trả, bồi thường hoặc biện pháp khác theo Điều 14.2 và pháp luật.
        </Clause>
        <Clause no="7.3.">
          Việc tạm ngừng phải tương xứng với vi phạm, không làm mất quyền khiếu nại, nghiệm thu và bảo hành đối với
          phần hàng đã giao theo Hợp đồng.
        </Clause>

        {/* ── Điều 8 ── */}
        <p style={S.article}>Điều 8. Xử lý sản phẩm không đạt chất lượng</p>
        <Clause no="8.1.1.">
          Khi phát sinh sản phẩm không đạt số lượng, chất lượng, thông số hoặc mẫu đã duyệt mà nguyên nhân thuộc
          Bên B, hai bên xác minh lỗi trên cơ sở tiêu chuẩn và dung sai đã được thống nhất; mỗi bên có trách nhiệm
          phối hợp và cung cấp chứng cứ liên quan.
        </Clause>
        <Clause no="8.1.2.">
          Bên A gửi thông báo trong thời hạn quy định tại Điều 4 và Điều 11, kèm ảnh, video hoặc tài liệu xác minh;
          Bên B phản hồi trong 03 ngày làm việc kể từ khi nhận đủ thông tin cần thiết.
        </Clause>
        <Clause no="8.1.3.">
          Bên B được ưu tiên lựa chọn phương án phù hợp để khắc phục: (a) sửa chữa/hoàn thiện; (b) sản xuất bù/thay
          thế sản phẩm lỗi; hoặc (c) đề xuất giảm giá đối với sai lệch không ảnh hưởng công năng nếu Bên A chấp
          thuận. Thời hạn khắc phục được hai bên thống nhất bằng văn bản, căn cứ vào tính chất lỗi, số lượng và
          năng lực sản xuất thực tế.
        </Clause>
        <Clause no="8.1.4.">
          Nếu Bên B không thể khắc phục, không khắc phục trong thời hạn đã thống nhất mà không có lý do hợp lệ, hoặc
          sản phẩm sau khắc phục vẫn không đáp ứng yêu cầu, Bên A có quyền từ chối phần sản phẩm không đạt và yêu
          cầu hoàn trả giá trị tương ứng. Quyền áp dụng chế tài khác trong trường hợp vi phạm nghiêm trọng hoặc
          pháp luật có quy định được bảo lưu.
        </Clause>
        <Clause no="8.1.5.">
          Bên B chịu chi phí hợp lý cho việc sửa chữa, sản xuất bù, thay thế và giao nhận/đổi trả hàng lỗi do mình
          gây ra. Không áp dụng trùng lặp các biện pháp dẫn đến Bên A được hoàn tiền cho toàn bộ phần hàng lỗi đồng
          thời vẫn nhận phần thay thế đạt chất lượng mà không có căn cứ phù hợp.
        </Clause>
        <Clause no="8.1.6.">
          Bên A có quyền yêu cầu phạt vi phạm và bồi thường thiệt hại khi có đủ căn cứ theo Hợp đồng và pháp luật.
          Thiệt hại phải được chứng minh, có quan hệ nhân quả trực tiếp và áp dụng nghĩa vụ hạn chế tổn thất; không
          bồi hoàn hai lần cho cùng một khoản thiệt hại.
        </Clause>
        <Clause no="8.1.7.">
          Các trường hợp loại trừ trách nhiệm tại Điều 8.2 chỉ được áp dụng khi có căn cứ chứng minh nguyên nhân
          lỗi không thuộc trách nhiệm của Bên B.
        </Clause>
        <Clause no="8.2.">
          Bên B không chịu trách nhiệm đối với hư hỏng do Bên A hoặc người sử dụng dùng sai công năng; bảo quản
          trái hướng dẫn hợp lý; để tiếp xúc với nhiệt độ, hóa chất, tải trọng vượt giới hạn đã công bố; tự ý sửa
          đổi kết cấu; hao mòn tự nhiên; lỗi trong tài liệu hoặc thiết kế do Bên A cung cấp mà Bên B không có nghĩa
          vụ phải phát hiện theo thỏa thuận; hoặc sự cố vận chuyển không thuộc trách nhiệm Bên B. Quy định này
          không loại trừ trách nhiệm của Bên B đối với lỗi do chính mình gây ra.
        </Clause>

        {/* ── Điều 9 ── */}
        <p style={S.article}>Điều 9. Sở hữu trí tuệ và bảo mật</p>
        <Clause no="9.1.">
          Quyền sở hữu đối với file thiết kế được sáng tạo riêng cho dự án JOYLOVE và đã nằm trong phạm vi giá Hợp
          đồng được chuyển giao cho Bên A sau khi Bên A thanh toán đầy đủ, trừ nội dung có thỏa thuận khác và quyền
          nhân thân không thể chuyển giao theo luật. Danh sách file và định dạng bàn giao xác định tại Phụ lục 01.
        </Clause>
        <Clause no="9.2.">
          Các công cụ, thư viện, mẫu nền, phương pháp, module và tài sản trí tuệ có trước hoặc phát triển độc lập
          của Bên B không tự động được chuyển giao. Trong phạm vi cần thiết để Bên A khai thác sản phẩm/thiết kế đã
          thanh toán, Bên B cấp quyền sử dụng các thành phần được tích hợp theo mục đích đã thỏa thuận, trừ trường
          hợp có hạn chế từ chủ sở hữu hợp pháp khác đã được thông báo trước.
        </Clause>
        <Clause no="9.3.">
          Bên B không sử dụng file thiết kế riêng, mẫu sản phẩm mang nhận diện JOYLOVE hoặc nhãn hiệu JOYLOVE để sản
          xuất, mua bán, đăng tải hoặc quảng cáo ngoài phạm vi thực hiện Hợp đồng nếu chưa được Bên A chấp thuận
          bằng văn bản.
        </Clause>
        <Clause no="9.4.">
          Bên A cam kết có quyền sử dụng hợp pháp đối với hình ảnh, nhãn hiệu, mẫu, thiết kế và tài liệu cung cấp
          cho Bên B. Mỗi bên chịu trách nhiệm đối với hành vi xâm phạm quyền sở hữu trí tuệ do mình gây ra.
        </Clause>
        <Clause no="9.5.">
          Mỗi bên giữ bí mật thông tin thương mại, bản vẽ, dữ liệu và giá cả chưa công khai của bên kia, trừ khi
          phải cung cấp theo pháp luật, được chủ sở hữu đồng ý hoặc thông tin đã công khai hợp pháp không do lỗi
          bên nhận. Nghĩa vụ bảo mật tiếp tục có hiệu lực 02 năm sau khi Hợp đồng chấm dứt, trừ dữ liệu được pháp
          luật bảo vệ dài hơn.
        </Clause>

        {/* ── Điều 10 ── */}
        <p style={S.article}>Điều 10. Mục đích sử dụng và giới hạn kỹ thuật</p>
        <Clause no="10.1.">
          Trừ khi được thống nhất và thử nghiệm/chứng nhận theo tiêu chuẩn liên quan, sản phẩm không mặc nhiên phù
          hợp cho ứng dụng an toàn nghiêm ngặt như thiết bị y tế, bộ phận an toàn phương tiện, vật chịu tải lớn,
          thiết bị điện/phòng cháy chữa cháy, sản phẩm tiếp xúc trực tiếp thực phẩm, đồ chơi trẻ nhỏ, dụng cụ bảo
          hộ hoặc điều kiện nhiệt độ cao.
        </Clause>
        <Clause no="10.2.">
          Bên A phải thông báo trước nếu sản phẩm có mục đích sử dụng đặc biệt. Bên B chỉ chịu trách nhiệm về các
          yêu cầu đặc biệt đã được ghi nhận bằng văn bản và nằm trong phạm vi thử nghiệm/kiểm tra đã thỏa thuận.
        </Clause>

        {/* ── Điều 11 ── */}
        <p style={S.article}>Điều 11. Bảo hành</p>
        <Clause no="11.1.">
          Thời hạn bảo hành là 30 ngày kể từ ngày nghiệm thu tương ứng đối với mỗi phần hàng. Đối với sản phẩm được
          thay thế do lỗi bảo hành, thời hạn bảo hành của sản phẩm thay thế là 30 ngày kể từ ngày Bên A nhận hàng
          thay thế.
        </Clause>
        <Clause no="11.2.">
          Bảo hành các lỗi thuộc trách nhiệm sản xuất/lắp ráp của Bên B, bao gồm gãy, nứt, tách lớp, thiếu phụ kiện
          hoặc sản phẩm không thực hiện được công năng đã cam kết do lỗi sản xuất. Việc thông báo, xác minh và khắc
          phục thực hiện theo Điều 8.
        </Clause>
        <Clause no="11.3.">
          Không bảo hành hao mòn hoặc trầy xước do sử dụng; hư hỏng do rơi, va đập, tải trọng, nhiệt, nước/hóa chất
          ngoài mục đích thiết kế; việc sửa đổi trái hướng dẫn; hoặc khác biệt ngoại quan nằm trong giới hạn đã
          được duyệt tại Phụ lục 01. Các loại trừ chỉ áp dụng khi có căn cứ xác định nguyên nhân.
        </Clause>

        {/* ── Điều 12 ── */}
        <p style={S.article}>Điều 12. Bất khả kháng</p>
        <Clause no="12.1.">
          Bất khả kháng là sự kiện xảy ra khách quan, không thể lường trước và không thể khắc phục dù đã áp dụng
          biện pháp cần thiết trong khả năng cho phép theo pháp luật, ví dụ thiên tai nghiêm trọng, hỏa hoạn không
          do lỗi chủ quan, chiến tranh hoặc quyết định của cơ quan nhà nước trực tiếp cản trở thực hiện nghĩa vụ.
        </Clause>
        <Clause no="12.2.">
          Bên bị ảnh hưởng thông báo sớm cho bên còn lại, nêu mức độ ảnh hưởng và bằng chứng hợp lý, thực hiện biện
          pháp hạn chế thiệt hại và tiếp tục nghĩa vụ khi trở ngại chấm dứt. Khó khăn thông thường về nhân sự, vật
          tư hoặc dòng tiền không mặc nhiên là bất khả kháng nếu không đáp ứng điều kiện pháp luật.
        </Clause>
        <Clause no="12.3.">
          Tiến độ được gia hạn tương ứng với khoảng thời gian bị ảnh hưởng trực tiếp. Nếu sự kiện kéo dài trên 05
          ngày làm việc, hai bên trao đổi phương án điều chỉnh; nếu kéo dài quá 20 ngày làm việc và không thống nhất
          được cách tiếp tục, mỗi bên có quyền đề nghị chấm dứt, quyết toán theo phần nghĩa vụ đã thực hiện và quy
          định pháp luật.
        </Clause>
        <Clause no="12.4.">
          Khi Hợp đồng chấm dứt hợp pháp do bất khả kháng, các khoản đã thanh toán cho phần nghĩa vụ chưa thực hiện
          mà không có căn cứ pháp lý để giữ được hoàn trả sau khi xác định chi phí hợp lý, quyền và nghĩa vụ của
          mỗi bên theo Hợp đồng và quy định pháp luật.
        </Clause>

        {/* ── Điều 13 ── */}
        <p style={S.article}>Điều 13. Thông báo, phê duyệt và chứng cứ điện tử</p>
        <Clause no="13.1.">
          Hai bên thống nhất sử dụng email, Zalo, tài liệu điện tử, chữ ký điện tử hoặc hệ thống quản lý hợp đồng
          của Bên B (bao gồm việc Bên A truy cập đường dẫn bảo mật để xem và ký Hợp đồng) từ tài khoản/người đại
          diện được chỉ định để gửi yêu cầu, duyệt mẫu, xác nhận phát sinh, nghiệm thu và thông báo. Việc ký và xác
          nhận điện tử phải bảo đảm nhận diện người ký, thể hiện sự chấp thuận đối với nội dung Hợp đồng và đáp ứng
          điều kiện có hiệu lực theo pháp luật. Nhật ký giao dịch, thời điểm ký và bản PDF đã ký được lưu để đối
          chiếu khi cần.
        </Clause>
        <Clause no="13.2.">
          Kênh liên hệ chính thức Bên A: email {dots(A?.email, SHORT_DOTS)}; số điện thoại/Zalo{' '}
          {dots(A?.phone, SHORT_DOTS)}; người phụ trách {dots(partyASigner, SHORT_DOTS)}.
        </Clause>
        <Clause no="13.3.">
          Kênh liên hệ chính thức Bên B: email {dots(B?.email, SHORT_DOTS)}; số điện thoại/Zalo{' '}
          {dots(B?.phone, SHORT_DOTS)}; người phụ trách {dots(partyBSigner, SHORT_DOTS)}.
        </Clause>
        <Clause no="13.4.">
          Mỗi bên phải thông báo khi thay đổi thông tin liên hệ. Xác nhận từ tài khoản không nằm trong danh sách
          chính thức chỉ có hiệu lực sau khi được bên có thẩm quyền xác nhận lại.
        </Clause>

        {/* ── Điều 14 ── */}
        <p style={S.article}>Điều 14. Hủy bỏ, chấm dứt hợp đồng và chậm thanh toán</p>
        <Clause no="14.1.1.">
          Trường hợp Bên A chấm dứt/hủy bỏ do lỗi của Bên B: (a) nếu Bên B vi phạm nghiêm trọng nghĩa vụ làm ảnh
          hưởng mục đích giao kết Hợp đồng, Bên A thông báo và cho Bên B tối thiểu 05 ngày làm việc để khắc phục,
          trừ vi phạm không thể khắc phục hoặc trường hợp pháp luật cho phép chấm dứt/hủy bỏ ngay; (b) nếu Bên B
          không khắc phục hợp lệ, Bên A được chấm dứt/hủy bỏ theo thỏa thuận và pháp luật; (c) việc hoàn trả khoản
          đã thanh toán tương ứng với phần nghĩa vụ chưa thực hiện/không đạt và xử lý phần công việc đã làm tuân
          theo hậu quả pháp lý của hình thức chấm dứt/hủy bỏ được áp dụng; (d) Bên A được yêu cầu chế tài khác khi
          có đủ căn cứ.
        </Clause>
        <Clause no="14.1.2.">
          Trường hợp Bên A tự chấm dứt vì lý do riêng không xuất phát từ lỗi Bên B: Bên A phải thông báo bằng văn
          bản; Bên B dừng các công việc chưa cần thiết và hợp lý hạn chế phát sinh. Hai bên quyết toán (i) giá trị
          thiết kế/sản phẩm/công việc đã hoàn thành phù hợp Hợp đồng; (ii) chi phí vật liệu, gia công, sản xuất thử
          và các chi phí hợp lý thực tế phát sinh, có chứng từ hoặc tài liệu chứng minh, không thể thu hồi hoặc sử
          dụng hợp lý cho đơn hàng khác; (iii) các nghĩa vụ hợp pháp khác đã được thỏa thuận. Không tính trùng chi
          phí đã nằm trong giá trị công việc hoàn thành.
        </Clause>
        <Clause no="14.1.3.">
          Khoản Bên A đã thanh toán được đối trừ vào giá trị quyết toán tại Điều 14.1.2; Bên B hoàn lại phần chênh
          lệch nếu đã nhận vượt, hoặc Bên A thanh toán bổ sung phần còn thiếu. Bên B gửi bảng quyết toán và tài
          liệu chứng minh trong 05 ngày làm việc từ ngày nhận thông báo chấm dứt; Bên A phản hồi trong 05 ngày làm
          việc kể từ ngày nhận đủ hồ sơ; phần tiền hai bên đã thống nhất được thanh toán/hoàn lại trong 07 ngày làm
          việc sau khi ký biên bản quyết toán.
        </Clause>
        <Clause no="14.1.4.">
          Tài liệu chứng minh chi phí có thể là đơn hàng, chứng từ mua vật tư, chứng từ thanh toán, file thiết kế,
          ảnh/video, nhật ký sản xuất, hồ sơ tiến độ và giấy tờ liên quan. Nếu có tranh chấp giá trị quyết toán,
          hai bên thực hiện thương lượng theo Điều 15; phần tiền không có tranh chấp vẫn phải được thanh toán đúng
          hạn.
        </Clause>
        <Clause no="14.2.1.">
          Nếu Bên A chậm thanh toán khoản đến hạn không có tranh chấp hợp lệ, Bên B gửi văn bản yêu cầu thanh toán
          và dành ít nhất 05 ngày làm việc để khắc phục. Hết thời hạn mà Bên A không thanh toán, Bên B được áp dụng
          Điều 7, yêu cầu lãi chậm trả và biện pháp khác theo Hợp đồng và pháp luật.
        </Clause>
        <Clause no="14.2.2.">
          Phạt vi phạm (nếu có) chỉ được áp dụng khi có thỏa thuận hợp pháp cụ thể và không vượt giới hạn pháp luật
          áp dụng; đối với quan hệ thuộc Luật Thương mại, mức phạt thông thường không quá 8% giá trị phần nghĩa vụ
          bị vi phạm. Không áp dụng mức phạt 200% giá trị hợp đồng hoặc mức phạt tự động trên toàn bộ giá trị hợp
          đồng khi không có căn cứ.
        </Clause>

        {/* ── Điều 15 ── */}
        <p style={S.article}>Điều 15. Giải quyết tranh chấp và điều khoản chung</p>
        <Clause no="15.1.">
          Hai bên ưu tiên thương lượng/hòa giải trong vòng 15 ngày làm việc kể từ ngày một bên thông báo tranh
          chấp. Nếu không giải quyết được, tranh chấp được đưa ra Tòa án có thẩm quyền theo quy định pháp luật Việt
          Nam.
        </Clause>
        <Clause no="15.2.">
          Hợp đồng có hiệu lực kể từ thời điểm bên ký sau cùng hoàn tất việc ký hợp lệ (ký trực tiếp hoặc ký điện
          tử đáp ứng điều kiện pháp luật), trừ khi hai bên xác nhận một ngày có hiệu lực khác. Đối với chữ ký thông
          qua hệ thống quản lý hợp đồng, thời điểm ký được xác định theo hồ sơ giao dịch do hệ thống ghi nhận. Mọi
          sửa đổi, bổ sung phải được người có thẩm quyền của hai bên xác nhận theo hình thức phù hợp pháp luật.
          Trong trường hợp mâu thuẫn, văn bản sửa đổi ký sau cùng được ưu tiên đối với phạm vi sửa đổi; Phụ lục 01
          là căn cứ xác định thông số sản phẩm.
        </Clause>
        <Clause no="15.3.">
          Hợp đồng bao gồm 15 điều và Phụ lục 01 (Thông số đơn hàng - nghiệm thu), Phụ lục 02 (Biên bản giao nhận -
          nghiệm thu). Các phụ lục là bộ phận không tách rời của bản PDF mà Bên A truy cập và ký qua đường dẫn bảo
          mật. Bản PDF được ký điện tử hợp lệ có giá trị theo pháp luật; trường hợp ký giấy, Hợp đồng được lập 02
          bản có giá trị như nhau, mỗi bên giữ 01 bản.
        </Clause>

        <Signatures title="ĐẠI DIỆN" names={[partyASigner, partyBSigner]} />

        {/* ── Phụ lục 01 ── */}
        <div style={S.pageBreak}>
          <p style={{ ...S.centerBold, color: NAVY }}>PHỤ LỤC 01</p>
          <p style={{ ...S.centerBold, color: NAVY, margin: '2px 0 8px' }}>
            DANH MỤC ĐƠN HÀNG – THÔNG SỐ VÀ TIÊU CHUẨN NGHIỆM THU
          </p>
          <p style={S.p}>
            Đính kèm Hợp đồng số {dots(data.contractNo)}. Phụ lục này phải được hai bên hoàn thiện và xác nhận
            trước khi sản xuất hàng loạt.
          </p>

          <p style={S.section}>A. Danh mục sản phẩm và giá trị đơn hàng</p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '40px' }}>STT</th>
                <th style={S.th}>Mã/tên sản phẩm</th>
                <th style={{ ...S.th, width: '70px' }}>SL (cái)</th>
                <th style={{ ...S.th, width: '100px' }}>Đơn giá (đ)</th>
                <th style={{ ...S.th, width: '110px' }}>Thành tiền (đ)</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={`${item.productId ?? item.productCode}-${i}`}>
                  <td style={{ ...S.td, textAlign: 'center' }}>{i + 1}</td>
                  <td style={S.td}>{item.productCode} – {item.productName}</td>
                  <td style={{ ...S.td, textAlign: 'center' }}>{item.quantity}</td>
                  <td style={{ ...S.td, textAlign: 'right' }}>{num(item.unitPrice)}</td>
                  <td style={{ ...S.td, textAlign: 'right' }}>{num(item.subtotal)}</td>
                </tr>
              ))}
              <tr>
                <td style={S.td} />
                <td style={{ ...S.td, fontWeight: 700 }}>TỔNG GIÁ TRỊ HỢP ĐỒNG</td>
                <td style={S.td} />
                <td style={S.td} />
                <td style={{ ...S.td, textAlign: 'right', fontWeight: 700 }}>{total}</td>
              </tr>
            </tbody>
          </table>
          <p style={S.p}>
            Ghi chú: Tổng các dòng hàng hóa/dịch vụ phải khớp {total} đồng; không bao gồm phí vận chuyển. Nếu có
            phí thiết kế riêng, ghi thành một dòng trong bảng.
          </p>

          <p style={S.section}>B. Thông số kỹ thuật và đối chứng duyệt mẫu</p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '40%' }}>Nội dung</th>
                <th style={S.th}>Thông tin được hai bên xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Công nghệ in, thiết bị, vật liệu', dots(data.technicalRequirements)],
                ['Màu sắc / hãng filament / mã màu', DOTS],
                ['Kích thước, dung sai, lắp ghép', DOTS],
                ['Yêu cầu ngoại quan, đường lớp, support', DOTS],
                ['Công năng, phụ kiện, logo, tem nhãn, đóng gói', DOTS],
                ['Mã file/mẫu, phiên bản và ngày duyệt', DOTS],
                ['Bàn giao file, kiểm tra, rủi ro vận chuyển', DOTS],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={S.td}>{label}</td>
                  <td style={{ ...S.td, whiteSpace: 'pre-wrap' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={S.section}>C. Lịch thực hiện và giao nhận</p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={{ ...S.th, width: '40%' }}>Mốc công việc</th>
                <th style={S.th}>Ngày/mốc xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Bàn giao thông tin thiết kế và nhận cọc đợt 1', DOTS],
                ['Ngày dự kiến duyệt thiết kế/mẫu', DOTS],
                ['Ngày dự kiến hoàn tất sản xuất', DOTS],
                ['Ngày giao hàng và đơn vị vận chuyển', data.deliveryDate ? dmy(data.deliveryDate) : DOTS],
                ['Phí vận chuyển và bên chịu phí', DOTS],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={S.td}>{label}</td>
                  <td style={S.td}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={S.p}>Mẫu/thiết kế được duyệt (ghi mã, phiên bản hoặc đường dẫn lưu trữ): {DOTS_LONG}</p>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '14px', textAlign: 'center' }}>
            <div>
              <p style={{ fontWeight: 700, color: NAVY, margin: 0 }}>XÁC NHẬN BÊN A – JOYLOVE</p>
              <p style={{ margin: '2px 0' }}>Ký/xác nhận: {SHORT_DOTS}</p>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: NAVY, margin: 0 }}>XÁC NHẬN BÊN B – LUXE GLOW</p>
              <p style={{ margin: '2px 0' }}>Ký/xác nhận: {SHORT_DOTS}</p>
            </div>
          </div>
        </div>

        {/* ── Phụ lục 02 ── */}
        <div style={S.pageBreak}>
          <p style={{ ...S.centerBold, color: NAVY }}>PHỤ LỤC 02</p>
          <p style={{ ...S.centerBold, color: NAVY, margin: '2px 0 8px' }}>BIÊN BẢN GIAO NHẬN VÀ NGHIỆM THU SẢN PHẨM</p>
          <p style={S.p}>Áp dụng cho Hợp đồng số {dots(data.contractNo)} - Dự án JOYLOVE</p>
          <p style={S.line}>
            <b>Ngày, giờ giao nhận:</b> {SHORT_DOTS} &nbsp;&nbsp;&nbsp; Địa điểm: {DOTS_LONG}
          </p>
          <Label label="Đại diện Bên A nhận hàng">{DOTS_LONG}</Label>
          <Label label="Đại diện Bên B/giao hàng">{DOTS_LONG}</Label>
          <Label label="Số phiếu giao hàng/vận đơn">{DOTS_LONG}</Label>

          <p style={S.section}>1. Danh sách hàng giao và kết quả kiểm tra</p>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Mã/tên hàng</th>
                <th style={{ ...S.th, width: '70px' }}>SL giao</th>
                <th style={{ ...S.th, width: '70px' }}>SL đạt</th>
                <th style={{ ...S.th, width: '90px' }}>SL cần xử lý</th>
                <th style={{ ...S.th, width: '170px' }}>Ghi chú lỗi/hồ sơ ảnh</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={`handover-${item.productId ?? item.productCode}-${i}`}>
                  <td style={S.td}>{item.productCode} – {item.productName}</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>{SHORT_DOTS}</td>
                </tr>
              ))}
              {Array.from({ length: handoverPadding }, (_, i) => (
                <tr key={`handover-pad-${i}`}>
                  <td style={S.td}>{SHORT_DOTS}</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>……</td>
                  <td style={S.td}>{SHORT_DOTS}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={S.section}>2. Xác nhận</p>
          <p style={S.line}>☐ Đã nhận hàng và nghiệm thu toàn bộ theo tiêu chuẩn đã thỏa thuận.</p>
          <p style={S.line}>☐ Đã nhận hàng, nghiệm thu phần đạt; phần chưa đạt được ghi rõ trong bảng trên.</p>
          <p style={S.line}>☐ Mới xác nhận giao nhận sơ bộ, chưa kết thúc thời hạn kiểm tra theo Điều 4.3.</p>
          <p style={S.p}>Mô tả lỗi, số lượng và yêu cầu xử lý: {DOTS_LONG}{DOTS_LONG}</p>
          <p style={S.p}>Thời hạn dự kiến khắc phục (nếu có): {DOTS_LONG}</p>
          <p style={S.p}>Giá trị phần được nghiệm thu để thanh toán: {DOTS_LONG} đồng.</p>
          <p style={S.p}>Ngày bắt đầu bảo hành của phần nghiệm thu: ……/……/…………</p>
          <p style={S.p}>
            Việc ký biên bản giao nhận sơ bộ không làm mất quyền thông báo lỗi tiềm ẩn trong thời hạn bảo hành theo
            Hợp đồng.
          </p>
          <Signatures title="ĐẠI DIỆN" />
        </div>
      </div>
    </div>
  );
}
