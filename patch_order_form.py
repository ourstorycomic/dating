import re

with open('d:/dating/components/dashboard/OrderBuilderForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

state_code = '''
  const [dating2Config, setDating2Config] = useState<Record<string, any>>({
    previewStep: 1,
    pinCode: "0401",
    radioHint: "Chạm để dò đúng tần số của tớ nhé 📻",
    vibeTitle: "Xin chào!\\nHôm nay của cậu thế nào?",
    vibeOptions: ["Đang đói 🍕", "Hơi mệt 🥺", "Rất vui ✨"],
    vibeTooltip: "Thế thì để tớ sạc năng lượng cho cậu nhé! ⚡",
    scratchTitle: "Trạm sạc số 1:",
    scratchSubtitle: "Cào thẻ bên dưới nhé 🎁",
    scratchPrize: "Một buổi hẹn hò\\nbao trọn gói!",
    scratchBtn: "Dùng vé ngay 👉",
    wheelTitle: "Vòng Quay Hẹn Hò",
    wheelOptions: ["Nhà Hàng 🧑‍🍳", "Đi Bơi 🏊‍♀️", "Xem Phim 🎬", "Dạo phố 🍡", "Trà Sữa 🧋", "Cà Phê ☕"],
    wheelBtn: "Lên lịch thôi! 👉",
    dtTitle: "Chốt Thời Gian",
    dtDates: ["T7 Tuần Này", "CN Tuần Này", "T2 Tuần Sau", "Ngày khác"],
    dtTimes: ["Sáng (9h)", "Chiều (15h)", "Tối (19h)"],
    dtBtn: "Hoàn tất 💖",
    finaleLetterTitle: "Gửi Cậu,",
    finaleLetterBody: "Cậu biết không, kể từ ngày đầu tiên chúng mình nói chuyện, tớ đã cảm thấy ở cậu một sự ấm áp đặc biệt.\\n\\nTớ không hứa sẽ mang lại cho cậu những điều hoàn hảo nhất, nhưng tớ hứa sẽ luôn cố gắng để mang lại nụ cười cho cậu mỗi ngày.\\n\\nMọi thứ đã sẵn sàng. Cậu có muốn đi chơi với tớ vào {date}, {time} tới đây không?",
    finaleBtnNo: "TỪ CHỐI 🫣",
    finaleBtnYes: "ĐỒNG Ý 🥰",
    finaleBtnSuccess: "Chốt deal! 🎉"
  });
'''

if 'const [dating2Config' not in content:
    content = content.replace('  const [buyerName, setBuyerName] = useState("");', state_code + '  const [buyerName, setBuyerName] = useState("");')

# Add to customData
customData_code = '''
    ...(isDating2 ? dating2Config : {}),
'''
# find `...(!isBirthdayMagic ? {`
content = content.replace('    ...(!isBirthdayMagic ? {', customData_code + '    ...(!isBirthdayMagic ? {')

# Add isDating2 variable
if 'const isDating2 = selectedComponentKey === "dating-2";' not in content:
    content = content.replace('const isBirthdayMagic = selectedComponentKey === "birthday-magic";', 'const isBirthdayMagic = selectedComponentKey === "birthday-magic";\n  const isDating2 = selectedComponentKey === "dating-2";')

# Update loadOrder
load_code = '''
    if (cd.previewStep) setDating2Config(cd);
'''
content = content.replace('    if (cd.stage2Background) setStage2Background(cd.stage2Background);', '    if (cd.stage2Background) setStage2Background(cd.stage2Background);\n' + load_code)


with open('d:/dating/components/dashboard/OrderBuilderForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
