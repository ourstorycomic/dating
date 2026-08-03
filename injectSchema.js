const fs = require('fs');
const file = 'd:/dating/components/dashboard/OrderBuilderForm.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `                  } else if (selectedComponentKey === 'videowedding-1') {
                    schema.push(
                      { section: "2. Chỉnh sửa Video", key: "text1", label: "Tiêu đề Scene 1", type: "text", default: "Our Journey" },
                      { section: "2. Chỉnh sửa Video", key: "text2", label: "Nội dung Scene 1", type: "text", default: "Bắt đầu từ những điều giản đơn nhất..." },
                      { section: "2. Chỉnh sửa Video", key: "text3", label: "Tiêu đề Scene 2", type: "text", default: "Forever Yours" },
                      { section: "2. Chỉnh sửa Video", key: "text4", label: "Nội dung Scene 2", type: "text", default: "Cùng nhau đi qua mọi thăng trầm của cuộc sống." }
                    );`;

const replacement = `                  } else if (selectedComponentKey === 'videowedding-1') {
                    schema.push(
                      { section: "2. Chỉnh sửa Video", key: "text1", label: "Tiêu đề Scene 1", type: "text", default: "Our Journey" },
                      { section: "2. Chỉnh sửa Video", key: "text2", label: "Nội dung Scene 1", type: "text", default: "Bắt đầu từ những điều giản đơn nhất..." },
                      { section: "2. Chỉnh sửa Video", key: "text3", label: "Tiêu đề Scene 2", type: "text", default: "Forever Yours" },
                      { section: "2. Chỉnh sửa Video", key: "text4", label: "Nội dung Scene 2", type: "text", default: "Cùng nhau đi qua mọi thăng trầm của cuộc sống." },
                      { section: "2. Chỉnh sửa Video", key: "voiceUrl", label: "Giọng MC (Voiceover)", type: "audio" }
                    );
                    // Remove features not supported in Video templates
                    schema = schema.filter((f: any) => f.key !== 'bankAccountName' && f.key !== 'bankAccountNumber' && f.key !== 'bankName' && f.key !== 'qrCodeImage');
                  } else if (selectedComponentKey === 'videowedding-2') {
                    schema.push(
                      { section: "2. Chỉnh sửa Video", key: "text1", label: "Tiêu đề Scene 1", type: "text", default: "SAVE THE DATE" },
                      { section: "2. Chỉnh sửa Video", key: "text2", label: "Nội dung Scene 1", type: "text", default: "WE ARE GETTING MARRIED!" },
                      { section: "2. Chỉnh sửa Video", key: "text5", label: "Storytelling 1", type: "text", default: "Two souls, one heart." },
                      { section: "2. Chỉnh sửa Video", key: "text3", label: "Tiêu đề Scene 2", type: "text", default: "OUR JOURNEY" },
                      { section: "2. Chỉnh sửa Video", key: "text6", label: "Storytelling 2", type: "text", default: "A love story written in the stars." },
                      { section: "2. Chỉnh sửa Video", key: "text7", label: "Storytelling 3", type: "text", default: "From this day forward..." },
                      { section: "2. Chỉnh sửa Video", key: "text4", label: "Nội dung Scene 2", type: "text", default: "Thank You" },
                      { section: "2. Chỉnh sửa Video", key: "voiceUrl", label: "Giọng MC (Voiceover)", type: "audio" }
                    );`;

if (content.includes("Our Journey")) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Success");
} else {
    console.log("Target not found");
}
