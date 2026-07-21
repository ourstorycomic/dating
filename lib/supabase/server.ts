import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function createServerSupabaseClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase server environment variables");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type TemplateCatalogItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  tagline: string | null;
  component_key: string;
  visual_label: string | null;
  gradient: string | null;
  base_price: number;
  data_schema: unknown;
  sample_data: unknown;
  status_label: string;
  sort_order: number;
  template_categories: {
    slug: string;
    name: string;
    description: string | null;
  } | null;
};

const allowedTemplateMatches = [
  "valentine-1",
  "valentine #1",
  "valentine-2",
  "valentine #2",
  "valentine-3",
  "valentine #3",
  "val-starry-constellation",
  "dating-1",
  "dating #1",
  "will-you-date-me",
  "dating-2",
  "dating #2",
  "dating-3",
  "dating #3",
  "gacha",
  "birthday-1",
  "birthday #1",
  "birthday-magic",
  "birthday-2",
  "birthday #2",
  "birthday 2",
  "birthday2",
  "birthday_2",
  "sorry-1",
  "sorry #1",
  "sorry-2",
  "sorry #2",
  "sorry-3",
  "sorry #3",
  "birthday-3",
  "birthday #3",
  "wedding-1",
  "wedding #1",
  "wedding-2",
  "wedding #2",
  "wedding-3",
  "wedding #3",
  "wedding-4",
  "wedding #4",
  "wedding-5",
  "wedding #5",
  "wedding-6",
  "wedding #6",
];

const futureWeddingDate = new Date();
futureWeddingDate.setDate(futureWeddingDate.getDate() + 30);
futureWeddingDate.setHours(11, 30, 0, 0);

const futureEngagementDate = new Date();
futureEngagementDate.setDate(futureEngagementDate.getDate() + 28);
futureEngagementDate.setHours(9, 0, 0, 0);

const formatDateTimeLocal = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mockWeddingDate = formatDateTimeLocal(futureWeddingDate);
const mockEngagementDate = formatDateTimeLocal(futureEngagementDate);

export const MOCK_TEMPLATES: any[] = [
  {
    id: "sorry-1-mock",
    slug: "sorry-1",
    name: "Sorry #1",
    component_key: "sorry-1",
    description: "Trải nghiệm 6 bước xoa dịu cơn giận từ việc đập tan lớp băng giá đến bản hiệp ước hòa bình hồng rực rỡ.",
    tagline: "Làm Hòa",
    base_price: 2000,
    visual_label: "HOT",
    gradient: "from-slate-400 to-rose-400",
    status_label: "Mới",
    sort_order: 20,
    data_schema: [
      { section: "P1. Lớp Băng", key: "iceTitle", label: "Tiêu đề", type: "text", default: "đang giận tớ lắm đúng không...?" },
      { section: "P1. Lớp Băng", key: "iceSubtitle", label: "Phụ đề", type: "text", default: "Bấm vào màn hình để đập vỡ lớp băng này nhé, lạnh quá..." },
      
      { section: "P2. Thú Tội", key: "confessText", label: "Lời thú tội", type: "textarea", default: "Tớ biết tớ sai rồi. Tớ vô tâm, tớ hư, tớ đáng bị đòn..." },
      { section: "P2. Thú Tội", key: "confessBtn", label: "Nút bấm", type: "text", default: "Đúng, cậu rất đáng đòn! 😡" },
      
      { section: "P3. Vòng Quay", key: "wheelTitle", label: "Tiêu đề", type: "text", default: "Vòng Quay Đền Tội" },
      { section: "P3. Vòng Quay", key: "wheelSubtitle", label: "Phụ đề", type: "text", default: "Trước khi tha lỗi, cho cậu quyền phạt tớ đấy! Quay đi, tớ chịu hết!" },
      { section: "P3. Vòng Quay", key: "wheelBtn", label: "Nút quay", type: "text", default: "QUAY NGAY" },
      { section: "P3. Vòng Quay", key: "wheelOpt1", label: "Lựa chọn 1", type: "text", default: "Trà sữa 1 tuần" },
      { section: "P3. Vòng Quay", key: "wheelOpt2", label: "Lựa chọn 2", type: "text", default: "Đấm 3 cái" },
      { section: "P3. Vòng Quay", key: "wheelOpt3", label: "Lựa chọn 3", type: "text", default: "Rửa bát 1 tháng" },
      { section: "P3. Vòng Quay", key: "wheelOpt4", label: "Lựa chọn 4", type: "text", default: "Làm osin 1 ngày" },
      { section: "P3. Vòng Quay", key: "wheelOpt5", label: "Lựa chọn 5", type: "text", default: "Mua quà xịn" },
      { section: "P3. Vòng Quay", key: "wheelOpt6", label: "Lựa chọn 6", type: "text", default: "Bao đi ăn tối" },
      { section: "P3. Vòng Quay", key: "wheelNextBtn", label: "Nút tiếp tục", type: "text", default: "Tạm bớt giận 👉" },

      { section: "P4. Kỷ Niệm", key: "memory1", label: "Ảnh kỷ niệm 1", type: "media" },
      { section: "P4. Kỷ Niệm", key: "memory2", label: "Ảnh kỷ niệm 2", type: "media" },
      { section: "P4. Kỷ Niệm", key: "memory3", label: "Ảnh kỷ niệm 3", type: "media" },
      { section: "P4. Kỷ Niệm", key: "nostalgiaText", label: "Lời nhắn", type: "textarea", default: "\"Tớ không muốn vì một phút ngu ngốc mà đánh mất những nụ cười này...\"" },
      { section: "P4. Kỷ Niệm", key: "nostalgiaBtn", label: "Nút xem tiếp", type: "text", default: "Xem tiếp" },
      
      { section: "P5. Thư Xin Lỗi", key: "letterText", label: "Nội dung thư", type: "textarea", default: "Anh biết lỗi rồi. Anh đã quá vô tâm và trẻ con. Anh hứa sẽ không bao giờ như vậy nữa. Tha lỗi cho anh nha, chiều nay tớ qua đón đi ăn đền tội, chịu không? ❤️" },
      { section: "P5. Thư Xin Lỗi", key: "letterBtn", label: "Nút chốt hạ", type: "text", default: "Chốt hạ" },
      
      { section: "P6. Ký Tên", key: "treatyTitle", label: "Tiêu đề", type: "text", default: "Hiệp Ước Hòa Bình" },
      { section: "P6. Ký Tên", key: "treatySubtitle", label: "Phụ đề", type: "text", default: "Quyết định nằm trong tay cậu. Xin hãy nương tay..." },
      { section: "P6. Ký Tên", key: "treatyBtnYes", label: "Nút tha thứ", type: "text", default: "KÝ TÊN, THA MẠNG CHÓ 🐾" },
      { section: "P6. Ký Tên", key: "treatyBtnNo", label: "Nút không tha", type: "text", default: "GIẬN TIẾP, KHÔNG THA 😤" },
      
      { section: "P7. Thành Công", key: "successTitle", label: "Tiêu đề", type: "text", default: "Cảm ơn cậu! ❤️" },
      { section: "P7. Thành Công", key: "successDesc", label: "Lời nhắn", type: "text", default: "Tớ qua đón cậu đi ăn đền tội ngay đây!" },
      { section: "P7. Thành Công", key: "musicUrl", label: "Nhạc nền", type: "audio" }
    ],
    sample_data: { screens: ["Đập băng", "Thú tội", "Vòng quay", "Kỷ niệm", "Ký tên"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  },
  {
    id: "sorry-2-mock",
    slug: "sorry-2",
    name: "Sorry #2",
    component_key: "sorry-2",
    description: "Đập tan cơn tức giận với minigame 'Whack-a-Lover' rồi xoa dịu bằng lời hứa chân thành và trà sữa.",
    tagline: "Xả Giận",
    base_price: 2000,
    visual_label: "FUN",
    gradient: "from-orange-400 to-rose-400",
    status_label: "Mới",
    sort_order: 21,
    data_schema: [
      { section: "P1. Cảnh Báo", key: "warnTitle", label: "Tiêu đề", type: "text", default: "Cảnh Báo Xả Giận" },
      { section: "P1. Cảnh Báo", key: "warnDesc", label: "Mô tả", type: "textarea", default: "Người này đã làm bạn giận. Bạn có quyền được xả giận ngay bây giờ!" },
      { section: "P1. Cảnh Báo", key: "warnBtn", label: "Nút bắt đầu", type: "text", default: "Bắt đầu xả giận" },
      
      { section: "P2. Vũ Khí", key: "weaponTitle", label: "Tiêu đề", type: "text", default: "Chọn Vũ Khí" },
      { section: "P2. Vũ Khí", key: "weapon1", label: "Vũ khí 1", type: "text", default: "Dép lào" },
      { section: "P2. Vũ Khí", key: "weapon2", label: "Vũ khí 2", type: "text", default: "Chổi chà" },
      
      { section: "P3. Game", key: "gameTarget", label: "Điểm mục tiêu", type: "text", default: "20" },
      
      { section: "P4. Băng Bó", key: "bandageTitle", label: "Tiêu đề", type: "text", default: "Á ui... đau quá!" },
      { section: "P4. Băng Bó", key: "bandageDesc", label: "Lời nhắn", type: "textarea", default: "Cậu xả giận xong chưa? Đau xót ruột luôn rồi nè 😭" },
      { section: "P4. Băng Bó", key: "bandageBtn", label: "Nút tiếp tục", type: "text", default: "Nghe giải thích" },
      
      { section: "P5. Xin Lỗi", key: "apologyText", label: "Lời xin lỗi", type: "textarea", default: "Anh biết lỗi rồi..." },
      { section: "P5. Xin Lỗi", key: "apologyBtn", label: "Nút chốt", type: "text", default: "Tha thứ" },
      
      { section: "P6. Tha Thứ", key: "successTitle", label: "Tiêu đề", type: "text", default: "Hòa nhé!" },
      { section: "P6. Tha Thứ", key: "successDesc", label: "Lời nhắn", type: "text", default: "Cảm ơn cậu đã tha lỗi. Mãi iu ❤️" },
      { section: "P6. Tha Thứ", key: "musicUrl", label: "Nhạc nền", type: "audio" }
    ],
    sample_data: { screens: ["Châm ngòi", "Chọn vũ khí", "Xả giận", "Băng bó", "Xin lỗi", "Tha thứ"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  },
  {
    id: "sorry-3-mock",
    slug: "sorry-3",
    name: "Sorry #3",
    component_key: "sorry-3",
    description: "Hành trình chuộc lỗi đầy tính công nghệ và hài hước, từ màn hình xanh tử thần đến minigame khủng long.",
    tagline: "Chuộc Lỗi",
    base_price: 2000,
    visual_label: "FUN",
    gradient: "from-blue-400 to-indigo-400",
    status_label: "Mới",
    sort_order: 22,
    data_schema: [
      { section: "P1. Màn Hình Xanh", key: "bsodTitle", label: "Tiêu đề lỗi", type: "text", default: "LỖI HỆ THỐNG" },
      { section: "P1. Màn Hình Xanh", key: "bsodMessage", label: "Mô tả lỗi", type: "textarea", default: "MỐI QUAN HỆ ĐANG BỊ GIÁN ĐOẠN." },
      { section: "P1. Màn Hình Xanh", key: "reason", label: "Nguyên nhân lỗi", type: "text", default: "mải chơi game quên nhắn tin" },
      { section: "P1. Màn Hình Xanh", key: "bsodCode", label: "Mã lỗi", type: "text", default: "LOVE_NOT_FOUND_404" },
      { section: "P1. Màn Hình Xanh", key: "bsodButton", label: "Nút bấm", type: "text", default: "[ Tái khởi động ]" },
      
      { section: "P2. Mất Kết Nối", key: "noConnTitle", label: "Tiêu đề", type: "text", default: "Không có kết nối" },
      { section: "P2. Mất Kết Nối", key: "noConnMessage", label: "Mô tả", type: "textarea", default: "Mất kết nối với trái tim của người yêu." },
      { section: "P2. Mất Kết Nối", key: "noConnHint1", label: "Gợi ý 1", type: "text", default: "Kiểm tra lại độ thành tâm" },
      { section: "P2. Mất Kết Nối", key: "noConnHint2", label: "Gợi ý 2", type: "text", default: "Chuẩn bị sẵn lời xin lỗi" },
      { section: "P2. Mất Kết Nối", key: "noConnHint3", label: "Gợi ý 3", type: "text", default: "Chạy qua nhà đền tội ngay lập tức" },
      
      { section: "P3. Khủng Long", key: "dinoTitle", label: "Tiêu đề Game Over", type: "text", default: "ERR_HEART_BROKEN" },
      { section: "P3. Khủng Long", key: "dinoHelpText", label: "Hướng dẫn chơi", type: "text", default: "Bấm phím Space hoặc chạm vào màn hình để thử lại." },
      
      { section: "P4. Cảnh Báo", key: "alertTitle", label: "Tiêu đề", type: "text", default: "Cảnh_Báo.exe" },
      { section: "P4. Cảnh Báo", key: "alertMessage", label: "Nội dung cảnh báo", type: "textarea", default: "CẢNH BÁO: Tên ngốc này đã nhận ra lỗi lầm!\n\nHắn thừa nhận mình vô tâm, trẻ con và hứa sẽ sửa đổi. Bạn có muốn xem bằng chứng không?" },
      { section: "P4. Cảnh Báo", key: "alertBtnYes", label: "Nút Đồng ý", type: "text", default: "Xem bằng chứng" },
      { section: "P4. Cảnh Báo", key: "alertBtnNo", label: "Nút Từ chối", type: "text", default: "Hủy" },
      
      { section: "P5. Thùng Rác", key: "trashMessage", label: "Nội dung", type: "textarea", default: "Tớ đã lỡ vứt những thói quen xấu vào thùng rác rồi.<br/>Bù lại, tớ tìm thấy cái này..." },
      { section: "P5. Thùng Rác", key: "trashBtn", label: "Nút Xem tiếp", type: "text", default: "Xem tiếp" },
      { section: "P5. Thùng Rác", key: "memory1", label: "Ảnh kỷ niệm 1", type: "media" },
      { section: "P5. Thùng Rác", key: "memory2", label: "Ảnh kỷ niệm 2", type: "media" },
      { section: "P5. Thùng Rác", key: "memory3", label: "Ảnh kỷ niệm 3", type: "media" },
      
      { section: "P6. Cài Đặt", key: "installStep1", label: "Tiến trình 1", type: "text", default: "Đang tải... Sự quan tâm" },
      { section: "P6. Cài Đặt", key: "installStep2", label: "Tiến trình 2", type: "text", default: "Đang cài đặt... Tính tự giác" },
      { section: "P6. Cài Đặt", key: "installStep3", label: "Tiến trình 3", type: "text", default: "Đang xóa bỏ... Thói quen vô tâm" },
      { section: "P6. Cài Đặt", key: "installSuccess", label: "Hoàn tất", type: "text", default: "Hoàn tất! Hệ thống đã được nâng cấp." },
      
      { section: "P7. Hộp Thư", key: "letterTitle", label: "Tiêu đề hộp thư", type: "text", default: "INBOX" },
      { section: "P7. Hộp Thư", key: "letter", label: "Nội dung bức thư", type: "textarea", default: "Anh biết lỗi rồi. Anh đã quá vô tâm và trẻ con. Anh hứa sẽ không bao giờ như vậy nữa. Tha lỗi cho anh nha, chiều nay tớ qua đón đi ăn đền tội, chịu không? ❤️" },
      { section: "P7. Hộp Thư", key: "letterBtn", label: "Nút xem lựa chọn", type: "text", default: "Xem lựa chọn" },
      
      { section: "P8. Chốt Kèo", key: "choiceTitle", label: "Tiêu đề lựa chọn", type: "text", default: "Trả lời thế nào đây?" },
      { section: "P8. Chốt Kèo", key: "acceptText", label: "Nút đồng ý", type: "text", default: "ĐỒNG Ý (CÓ TRÀ SỮA) 🧋" },
      { section: "P8. Chốt Kèo", key: "rejectText", label: "Nút từ chối", type: "text", default: "KHÔNG THA 😤" },
      { section: "P8. Chốt Kèo", key: "successTitle", label: "Tiêu đề thành công", type: "text", default: "Chốt kèo!" },
      { section: "P8. Chốt Kèo", key: "successMessage", label: "Lời nhắn thành công", type: "text", default: "Tớ qua ngay đây! 🛵💨" }
    ],
    sample_data: { screens: ["Lỗi hệ thống", "Mất kết nối", "Khủng long vượt ải", "Cảnh báo", "Thùng rác", "Cài đặt lại", "Tin nhắn", "Chốt kèo"] },
    template_categories: { slug: "sorry", name: "Sorry", description: null }
  },
  {
    id: "birthday-3-mock",
    slug: "birthday-3",
    name: "Birthday #3",
    component_key: "birthday-3",
    description: "Lộ trình sinh nhật 8 bước sang trọng, từ gõ cửa, bật đèn, đập bóng bay đến xé quà bất ngờ.",
    tagline: "Sinh Nhật",
    base_price: 2000,
    visual_label: "LUXURY",
    gradient: "from-amber-200 to-yellow-500",
    status_label: "Mới",
    sort_order: 12,
    data_schema: [
      { section: "P1. Mở Thư", key: "doorSign", label: "Tiêu đề", type: "text", default: "A SPECIAL GIFT 💌" },
      { section: "P1. Mở Thư", key: "doorInstruction", label: "Hướng dẫn", type: "text", default: "Chạm 3 lần để mở thư!" },
      
      { section: "P2. Phòng Tối", key: "darkRoomText", label: "Lời nhắn", type: "text", default: "Phòng tối quá... Cậu bật đèn giúp tớ với!" },
      { section: "P2. Phòng Tối", key: "switchBtn", label: "Nút bật đèn", type: "text", default: "Bật đèn" },
      
      { section: "P3. Bóng Bay", key: "balloonText", label: "Lời nhắn", type: "text", default: "Trời ơi, bóng bay nhiều quá! Đập vỡ chúng đi!" },
      
      { section: "P4. Thổi Nến", key: "cakeTitle", label: "Tiêu đề", type: "text", default: "Happy Birthday!" },
      { section: "P4. Thổi Nến", key: "cakeInstruction", label: "Hướng dẫn", type: "text", default: "Hãy nhắm mắt, ước một điều và thổi nến nhé!" },
      { section: "P4. Thổi Nến", key: "blowBtn", label: "Nút thổi nến", type: "text", default: "Phùuuu 💨" },
      
      { section: "P5. Lật Thiệp", key: "cardTitle", label: "Tiêu đề thiệp", type: "text", default: "Happy Birthday!" },
      { section: "P5. Lật Thiệp", key: "cardMessage", label: "Nội dung thiệp", type: "textarea", default: "Mong mọi điều tốt đẹp nhất sẽ đến với cậu. Tuổi mới thật rực rỡ nhé!" },
      { section: "P5. Lật Thiệp", key: "cardBtn", label: "Nút xem ảnh", type: "text", default: "Xem ảnh kỷ niệm" },
      
      { section: "P6. Kỷ Niệm", key: "memory1", label: "Ảnh 1", type: "media" },
      { section: "P6. Kỷ Niệm", key: "memory2", label: "Ảnh 2", type: "media" },
      { section: "P6. Kỷ Niệm", key: "memory3", label: "Ảnh 3", type: "media" },
      { section: "P6. Kỷ Niệm", key: "memoryWish1", label: "Lời chúc 1", type: "textarea", default: "Chúc bé tuổi mới luôn xinh đẹp, rạng rỡ và ngập tràn niềm vui nhé! 💖" },
      { section: "P6. Kỷ Niệm", key: "memoryWish2", label: "Lời chúc 2", type: "textarea", default: "Tuổi 22 sẽ là một năm đầy hứa hẹn. Chúc mọi dự định của cậu đều thành công rực rỡ! ✨" },
      { section: "P6. Kỷ Niệm", key: "memoryWish3", label: "Lời chúc 3", type: "textarea", default: "Dù có chuyện gì xảy ra thì vẫn luôn có tớ ở đây ủng hộ cậu. Happy Birthday! 🎂" },
      { section: "P6. Kỷ Niệm", key: "memoryWish4", label: "Lời chúc cuối", type: "textarea", default: "Cảm ơn vì đã xuất hiện và làm thanh xuân của tớ trở nên tuyệt vời hơn rất nhiều. 🥰" },
      { section: "P6. Kỷ Niệm", key: "memoryBtn", label: "Nút nhận quà", type: "text", default: "Nhận quà nè 🎁" },
      
      { section: "P7. Mở Quà", key: "giftInstruction", label: "Hướng dẫn", type: "text", default: "Xé giấy gói quà đi nào!" },
      
      { section: "P8. Quà Tặng", key: "giftName", label: "Tên món quà", type: "text", default: "VOUCHER BAO ĐI ĂN BUFFET & XEM PHIM 🎟️" },
      { section: "P8. Quà Tặng", key: "giftImage", label: "Ảnh món quà", type: "media" },
      { section: "P8. Quà Tặng", key: "musicUrl", label: "Nhạc nền", type: "audio" },
    ],
    sample_data: { screens: ["Gõ cửa", "Bật đèn", "Bóng bay", "Thổi nến", "Lật thiệp", "Ảnh kỷ niệm", "Xé quà", "Nhận quà"] },
    template_categories: { slug: "birthday", name: "Birthday", description: null }
  },
  ...[
    { slug: 'wedding-1', name: 'Classic Romance', groom: 'Minh Khang', bride: 'Thu Hương', groomFam: 'Ông Trần Văn Nam\\nBà Nguyễn Thị My', brideFam: 'Ông Nguyễn Văn Cường\\nBà Lê Thị Dung' },
    { slug: 'wedding-2', name: 'Elegant Beige', groom: 'Minh Hoàng', bride: 'Mai Hương', groomFam: 'Ông Phạm Văn Dư\\nBà Trần Thị Hiền', brideFam: 'Ông Nguyễn Văn Bình\\nBà Nguyễn Thị Thủy' },
    { slug: 'wedding-3', name: 'Floral Garden', groom: 'Minh Hoàng', bride: 'Mai Hương', groomFam: 'Ông Phạm Văn Dư\\nBà Trần Thị Hiền', brideFam: 'Ông Nguyễn Văn Bình\\nBà Nguyễn Thị Thủy' },
    { slug: 'wedding-4', name: 'Blue Envelope', groom: 'Minh Hoàng', bride: 'Mai Hương', groomFam: 'Ông Phạm Văn Dư\\nBà Trần Thị Hiền', brideFam: 'Ông Nguyễn Văn Bình\\nBà Nguyễn Thị Thủy' },
    { slug: 'wedding-5', name: 'Earth & Greenery', groom: 'Minh Hoàng', bride: 'Mai Hương', groomFam: 'Ông Phạm Văn Dư\\nBà Trần Thị Hiền', brideFam: 'Ông Nguyễn Văn Bình\\nBà Nguyễn Thị Thủy' },
    { slug: 'wedding-6', name: 'Double Happiness', groom: 'Minh Khang', bride: 'Thu Hương', groomFam: 'Ông Phạm Văn Long\\nBà Lê Thị Mai', brideFam: 'Ông Nguyễn Văn Hùng\\nBà Trần Thị Hoa' }
  ].map(temp => ({
    id: `${temp.slug}-mock`,
    slug: temp.slug,
    name: temp.name,
    component_key: temp.slug,
    description: "Mẫu thiệp cưới",
    tagline: "Sang Trọng",
    base_price: 0,
    visual_label: "HOT",
    gradient: "from-amber-100 to-yellow-900",
    status_label: "Mới",
    sort_order: 30,
    data_schema: [
      { section: "1. Chú Rể & Cô Dâu", key: "groomName", label: "Tên Chú Rể", type: "text", default: temp.groom },
      { section: "1. Chú Rể & Cô Dâu", key: "brideName", label: "Tên Cô Dâu", type: "text", default: temp.bride },
      { section: "1. Chú Rể & Cô Dâu", key: "heroImage", label: "Ảnh Cover (Dọc)", type: "media" },
      { section: "2. Thời Gian", key: "weddingDate", label: "Ngày & Giờ Cưới", type: "datetime", default: mockWeddingDate },
      { section: "2. Thời Gian", key: "engagementDate", label: "Ngày & Giờ Ăn Hỏi", type: "datetime", default: mockEngagementDate },
      { section: "3. Lời Mời", key: "letterText", label: "Nội dung thiệp", type: "textarea", default: "Được sự đồng thuận của gia đình hai bên\\nChúng tôi trân trọng kính mời quý khách tới dự bữa tiệc chung vui cùng gia đình chúng tôi" },
      { section: "3. Lời Mời", key: "groomFather", label: "Họ tên bố chú rể", type: "text", default: temp.groomFam.split('\\n')[0].trim() },
      { section: "3. Lời Mời", key: "groomMother", label: "Họ tên mẹ chú rể", type: "text", default: temp.groomFam.split('\\n')[1]?.trim() || '' },
      { section: "3. Lời Mời", key: "brideFather", label: "Họ tên bố cô dâu", type: "text", default: temp.brideFam.split('\\n')[0].trim() },
      { section: "3. Lời Mời", key: "brideMother", label: "Họ tên mẹ cô dâu", type: "text", default: temp.brideFam.split('\\n')[1]?.trim() || '' },
      { section: "4. Địa Điểm", key: "eventAddress", label: "Tên & Địa chỉ nhà hàng", type: "textarea", default: "Trống Đồng Palace, 72 Trần Đăng Ninh, Cầu Giấy" },
      { section: "4. Địa Điểm", key: "mapUrl", label: "Link Google Maps", type: "text", default: "https://maps.app.goo.gl/xxx" },
      ...(temp.slug === 'wedding-1' ? [
        { section: "4. Địa Điểm", key: "mapImage", label: "Ảnh bản đồ", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "groomImage", label: "Ảnh Chú Rể", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "brideImage", label: "Ảnh Cô Dâu", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "dividerImage", label: "Ảnh ngang (Divider)", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "footerImage", label: "Ảnh Footer", type: "media" }
      ] : [
        { section: "5. Thư Viện Ảnh", key: "gallery1", label: "Ảnh Gallery 1", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery2", label: "Ảnh Gallery 2", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery3", label: "Ảnh Gallery 3", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery4", label: "Ảnh Gallery 4", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery5", label: "Ảnh Gallery 5", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery6", label: "Ảnh Gallery 6", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery7", label: "Ảnh Gallery 7", type: "media" },
        { section: "5. Thư Viện Ảnh", key: "gallery8", label: "Ảnh Gallery 8", type: "media" }
      ]),
      { section: "6. Âm Nhạc", key: "musicUrl", label: "Nhạc nền", type: "audio" },
      { section: "7. Mừng Cưới", key: "groomQR", label: "QR Chú rể", type: "media" },
      { section: "7. Mừng Cưới", key: "brideQR", label: "QR Cô dâu", type: "media" }
    ],
    sample_data: { screens: ["Thiệp Mời", "Lời Ngỏ", "Thư Viện Ảnh", "Xác Nhận"] },
    template_categories: { slug: "wedding", name: "Wedding", description: null }
  }))
];

function isSupportedTemplate(template: Pick<TemplateCatalogItem, "component_key" | "name" | "slug">) {
  const searchable = `${template.component_key} ${template.name} ${template.slug}`.toLowerCase();
  return allowedTemplateMatches.some((match) => searchable.includes(match));
}

function normalizeTemplateRelations(item: unknown) {
  const template = item as TemplateCatalogItem & {
    template_categories: TemplateCatalogItem["template_categories"] | TemplateCatalogItem["template_categories"][];
  };

  return {
    ...template,
    template_categories: Array.isArray(template.template_categories)
      ? template.template_categories[0] ?? null
      : template.template_categories,
  } as TemplateCatalogItem;
}

export async function getPublishedTemplates() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, slug, name, description, tagline, component_key, visual_label, gradient, base_price, data_schema, sample_data, status_label, sort_order, thumbnail_url, template_categories(slug, name, description)",
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load templates", error);
    return [];
  }

  const dbTemplates = (data ?? []).map(normalizeTemplateRelations).filter(isSupportedTemplate);
  
  // Gộp data_schema từ mock vào DB nếu DB chưa có, và tránh nhân bản
  const result = dbTemplates.map(dbTemp => {
    const mock = MOCK_TEMPLATES.find(m => m.slug === dbTemp.slug);
    if (mock) {
      return {
        ...dbTemp,
        data_schema: (mock.slug.startsWith('wedding-') || !(Array.isArray(dbTemp.data_schema) && dbTemp.data_schema.length > 0)) ? mock.data_schema : dbTemp.data_schema,
        sample_data: (mock.slug.startsWith('wedding-') || !(typeof dbTemp.sample_data === 'object' && dbTemp.sample_data !== null && Object.keys(dbTemp.sample_data).length > 0)) ? mock.sample_data : dbTemp.sample_data
      };
    }
    return dbTemp;
  });

  const dbSlugs = new Set(result.map(t => t.slug));
  const missingMocks = MOCK_TEMPLATES.filter(m => !dbSlugs.has(m.slug));

  return [...result, ...missingMocks] as any[];
}

export async function getTemplateBySlug(slug: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("templates")
    .select(
      "id, slug, name, description, tagline, component_key, visual_label, gradient, base_price, data_schema, sample_data, status_label, sort_order, thumbnail_url, template_categories(slug, name, description)",
    )
    .or(`slug.eq.${slug},component_key.eq.${slug}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    // Fallback to mock if not in DB
    const mock = MOCK_TEMPLATES.find(m => m.slug === slug);
    if (mock) return mock;
    return null;
  }

  let template = normalizeTemplateRelations(data);
  
  // Merge schema from mock if DB is missing it
  const mock = MOCK_TEMPLATES.find(m => m.slug === template.slug);
  if (mock) {
    template = {
      ...template,
      data_schema: (mock.slug.startsWith('wedding-') || !(Array.isArray(template.data_schema) && template.data_schema.length > 0)) ? mock.data_schema : template.data_schema,
      sample_data: (mock.slug.startsWith('wedding-') || !(typeof template.sample_data === 'object' && template.sample_data !== null && Object.keys(template.sample_data).length > 0)) ? mock.sample_data : template.sample_data
    };
  }

  return isSupportedTemplate(template) ? template : null;
}

export async function getDashboardCounts() {
  const supabase = createServerSupabaseClient();

  const [orders, templates, users, logs] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).gt("amount", 0),
    supabase.from("templates").select("id", { count: "exact", head: true }),
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase.from("order_logs").select("id", { count: "exact", head: true }),
  ]);

  return {
    orders: orders.count ?? 0,
    templates: templates.count ?? 0,
    users: users.count ?? 0,
    logs: logs.count ?? 0,
  };
}

export async function getRecentOrders(filters?: { query?: string; status?: string; startDate?: string; endDate?: string }) {
  const supabase = createServerSupabaseClient();
  let query = supabase
    .from("orders")
    .select(
      "id, public_id, buyer_name, buyer_contact, recipient_name, amount, status, created_at, templates(name), users(name)",
    )
    .order("created_at", { ascending: false });

  if (filters?.query) {
    query = query.or(`public_id.ilike.%${filters.query}%,buyer_name.ilike.%${filters.query}%,buyer_contact.ilike.%${filters.query}%`);
  }
  if (filters?.status && filters.status !== "ALL") {
    query = query.eq("status", filters.status);
  }
  if (filters?.startDate) {
    query = query.gte("created_at", filters.startDate);
  }
  if (filters?.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  // Allow up to 50 items if filtering, else default 8
  const hasFilters = filters?.query || (filters?.status && filters.status !== "ALL") || filters?.startDate || filters?.endDate;
  query = query.limit(hasFilters ? 50 : 8);

  const { data, error } = await query;

  if (error) {
    console.error("Failed to load recent orders", error);
    return [];
  }

  return data ?? [];
}

export async function getOrdersByCreator(userId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id, public_id, template_id, buyer_name, buyer_contact, recipient_name, custom_data, amount, status, created_at, expires_at, templates(id, name, component_key), payments(payment_code, status, paid_at)")
    .eq("created_by_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) {
    console.error("Failed to load creator orders", error);
    return [];
  }

  return data ?? [];
}

export async function getUsers() {
  const supabase = createServerSupabaseClient();
  const withCustomRole = await supabase
    .from("users")
    .select("id, name, email, role, custom_role_id, is_active, manager_id, created_at, custom_roles(id, name, base_role, commission_percentage)")
    .order("created_at", { ascending: false });

  if (!withCustomRole.error) {
    return withCustomRole.data ?? [];
  }

  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, is_active, manager_id, created_at")
    .order("created_at", { ascending: false });

  if (error) return [];

  return (data ?? []).map((user) => ({
    ...user,
    custom_role_id: null,
    custom_roles: null,
  }));
}

export async function getCustomRoles() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("custom_roles")
    .select("id, name, description, base_role, permissions, commission_percentage, is_active, created_at, role_commission_rules(template_id, percentage, is_active)")
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getOrderLogs(page = 1, limit = 10, filters?: { query?: string; status?: string; date?: string }) {
  const supabase = createServerSupabaseClient();
  
  // Since we need to search across relations (users, orders, templates) which is complex in Supabase JS,
  // and we want exact pagination, we fetch up to 1000 logs if there's a search query to filter in memory.
  // If no search query, we do direct DB pagination for performance.
  
  let dbQuery = supabase
    .from("order_logs")
    .select("id, action, metadata, created_at, users(name, email), orders(id, public_id, buyer_name, buyer_contact, recipient_name, amount, status, custom_data, created_at, expires_at, templates(name, component_key, visual_label), payments(payment_code, amount, status, qr_code_url, paid_at), creator:users!orders_created_by_id_fkey(name, email))", { count: 'exact' })
    .order("created_at", { ascending: false });

  // Status and date can be partially pushed to DB or filtered in memory
  // DB level date filter
  if (filters?.date) {
    dbQuery = dbQuery.gte("created_at", `${filters.date}T00:00:00.000Z`).lte("created_at", `${filters.date}T23:59:59.999Z`);
  }

  // Fetch data
  const hasComplexSearch = !!(filters?.query || filters?.status);
  
  if (!hasComplexSearch) {
    // Pure DB pagination
    dbQuery = dbQuery.range((page - 1) * limit, page * limit - 1);
  } else {
    // Fetch up to 1000 items and filter in memory for complex search
    dbQuery = dbQuery.limit(1000);
  }

  const { data, error, count } = await dbQuery;

  if (error) {
    console.error("Failed to load order logs", error);
    return { logs: [], totalCount: 0 };
  }

  let result = data ?? [];

  if (hasComplexSearch) {
    const keyword = (filters?.query || "").trim().toLowerCase();
    
    result = result.filter((log: any) => {
      const order = log.orders;
      
      if (keyword) {
        const textToSearch = `${log.action} ${log.users?.name ?? ""} ${log.users?.email ?? ""} ${order?.public_id ?? ""} ${order?.buyer_name ?? ""} ${order?.buyer_contact ?? ""} ${order?.recipient_name ?? ""} ${order?.templates?.name ?? ""}`.toLowerCase();
        if (!textToSearch.includes(keyword)) return false;
      }

      if (filters?.status && order?.status !== filters.status) return false;

      return true;
    });
    
    const totalCount = result.length;
    result = result.slice((page - 1) * limit, page * limit);
    return { logs: result, totalCount };
  }

  return { logs: result, totalCount: count ?? 0 };
}

export async function getOrderByPublicId(publicId: string) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, public_id, buyer_name, recipient_name, custom_data, amount, status, gift_opened_at, recipient_response, response_text, responded_at, created_at, expires_at, templates(component_key, visual_label, gradient, name, thumbnail_url), payments(payment_code, amount, status, qr_code_url)",
    )
    .eq("public_id", publicId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Failed to load order", error);
    return null;
  }

  return data as unknown as {
    id: string;
    public_id: string;
    buyer_name: string | null;
    recipient_name: string | null;
    custom_data: Record<string, unknown>;
    amount: number;
    status: string;
    gift_opened_at: string | null;
    recipient_response: string | null;
    response_text: string | null;
    responded_at: string | null;
    created_at: string;
    templates: {
      component_key: string;
      visual_label: string | null;
      gradient: string | null;
      name?: string | null;
      thumbnail_url?: string | null;
    } | null;
    payments:
      | {
          payment_code: string;
          amount: number;
          status: string;
          qr_code_url: string | null;
        }
      | Array<{
          payment_code: string;
          amount: number;
          status: string;
          qr_code_url: string | null;
        }>
      | null;
  };
}

export async function getCommissionRules() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("commission_rules")
    .select("recipient_type, percentage, is_active, updated_at")
    .order("recipient_type", { ascending: true });

  if (error) {
    console.error("Failed to load commission rules", error);
    return [];
  }

  return data ?? [];
}

export async function getEmployeeDailyStats({ days = 14 }: { days?: number } = {}) {
  const supabase = createServerSupabaseClient();
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("id, amount, status, created_at, created_by_id, users!orders_created_by_id_fkey(id, name, email)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load employee daily stats", error);
    return [];
  }

  const map = new Map<string, {
    activeOrders: number;
    commissionEarned: number;
    createdOrders: number;
    date: string;
    employeeEmail: string;
    employeeId: string;
    employeeName: string;
    pendingOrders: number;
    revenue: number;
  }>();

  for (const order of data ?? []) {
    const employee = Array.isArray(order.users) ? order.users[0] : order.users;
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(order.created_at));
    const employeeId = order.created_by_id;
    const key = `${date}:${employeeId}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        date,
        employeeEmail: employee?.email ?? "",
        employeeId,
        employeeName: employee?.name ?? "Không rõ",
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (!row) continue;

    const amount = Number(order.amount ?? 0);
    if (amount > 0) {
      row.createdOrders += 1;
      if (order.status === "ACTIVE" || order.status === "RESPONDED") {
        row.activeOrders += 1;
        row.revenue += amount;
      }
      if (order.status === "PENDING_PAYMENT") {
        row.pendingOrders += 1;
      }
    }
  }

  const { data: commissions } = await supabase
    .from("commissions")
    .select("amount, user_id, created_at, users(name, email)")
    .gte("created_at", since.toISOString())
    .eq("status", "EARNED");

  for (const commission of commissions ?? []) {
    const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(commission.created_at));
    const employeeId = commission.user_id;
    const key = `${date}:${employeeId}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        date,
        employeeEmail: user?.email ?? "",
        employeeId,
        employeeName: user?.name ?? "Không rõ",
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (row) row.commissionEarned += Number(commission.amount ?? 0);
  }

  return Array.from(map.values()).sort((a, b) => b.date.localeCompare(a.date) || b.createdOrders - a.createdOrders);
}

export async function getEmployeeMonthlyStats({ months = 12 }: { months?: number } = {}) {
  const supabase = createServerSupabaseClient();
  const since = new Date();
  since.setMonth(since.getMonth() - months + 1);
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("orders")
    .select("id, amount, status, created_at, created_by_id, users!orders_created_by_id_fkey(id, name, email)")
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load employee monthly stats", error);
    return [];
  }

  const map = new Map<string, {
    activeOrders: number;
    commissionEarned: number;
    createdOrders: number;
    employeeEmail: string;
    employeeId: string;
    employeeName: string;
    month: string;
    pendingOrders: number;
    revenue: number;
  }>();

  for (const order of data ?? []) {
    const employee = Array.isArray(order.users) ? order.users[0] : order.users;
    const month = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
    }).format(new Date(order.created_at));
    const key = `${month}:${order.created_by_id}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        employeeEmail: employee?.email ?? "",
        employeeId: order.created_by_id,
        employeeName: employee?.name ?? "Không rõ",
        month,
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (!row) continue;
    const amount = Number(order.amount ?? 0);
    if (amount > 0) {
      row.createdOrders += 1;
      if (order.status === "ACTIVE" || order.status === "RESPONDED") {
        row.activeOrders += 1;
        row.revenue += amount;
      }
      if (order.status === "PENDING_PAYMENT") row.pendingOrders += 1;
    }
  }

  const { data: commissions } = await supabase
    .from("commissions")
    .select("amount, user_id, created_at, users(name, email)")
    .gte("created_at", since.toISOString())
    .eq("status", "EARNED");

  for (const commission of commissions ?? []) {
    const user = Array.isArray(commission.users) ? commission.users[0] : commission.users;
    const month = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
    }).format(new Date(commission.created_at));
    const key = `${month}:${commission.user_id}`;

    if (!map.has(key)) {
      map.set(key, {
        activeOrders: 0,
        commissionEarned: 0,
        createdOrders: 0,
        employeeEmail: user?.email ?? "",
        employeeId: commission.user_id,
        employeeName: user?.name ?? "Không rõ",
        month,
        pendingOrders: 0,
        revenue: 0,
      });
    }

    const row = map.get(key);
    if (row) row.commissionEarned += Number(commission.amount ?? 0);
  }

  return Array.from(map.values()).sort((a, b) => b.month.localeCompare(a.month) || b.createdOrders - a.createdOrders);
}

export async function getCommissionSummary() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("commissions")
    .select("id, user_id, amount, percentage, recipient_type, status, created_at, users(name, email), affiliates(name, ref_code), orders(public_id)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Failed to load commission summary", error);
    return [];
  }

  return data ?? [];
}

export async function getUserDetails(userId: string) {
  const supabase = createServerSupabaseClient();
  
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, name, email, role, is_active, created_at")
    .eq("id", userId)
    .single();

  if (userError || !user) return null;

  const [ordersResponse, commissionsResponse] = await Promise.all([
    supabase
      .from("orders")
      .select("id, public_id, amount, status, created_at")
      .eq("created_by_id", userId)
      .order("created_at", { ascending: false }),
    supabase
      .from("commissions")
      .select("id, amount, percentage, status, created_at, order_id, orders(public_id, status)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
  ]);

  return {
    user,
    orders: ordersResponse.data ?? [],
    commissions: commissionsResponse.data ?? [],
  };
}
