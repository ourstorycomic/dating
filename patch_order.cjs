const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'components/dashboard/OrderBuilderForm.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Add states
c = c.replace(
  /const \[dynamicData, setDynamicData\] = useState<Record<string, any>>\(\{\}\);/,
  `const [dynamicData, setDynamicData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<"trai" | "gai">("trai");
  const isGoi3 = selectedPackage?.includes("goi3") || false;
  const isGoi2 = selectedPackage?.includes("goi2") || false;
  const isGoi1 = selectedPackage?.includes("goi1") || false;

  const getVal = (key: string) => (isGoi3 && activeTab === "gai") ? (dynamicData.gai?.[key] ?? dynamicData[key] ?? "") : (dynamicData[key] ?? "");
  const setVal = (key: string, val: any) => setDynamicData((d: any) => {
    if (isGoi3 && activeTab === "gai") {
      return { ...d, gai: { ...(d.gai || {}), [key]: val } };
    }
    return { ...d, [key]: val };
  });`
);

// 2. customData injection
c = c.replace(
  /\.\.\.dynamicData,\n\s*\};\n\n\s*useEffect\(\(\) => \{/g,
  `...(isWedding ? {
      hasTiecMung: !!(dynamicData.tiecName || dynamicData.tiecDate),
      hasTiecMungGai: isGoi2 ? !!(dynamicData.tiecNameGai || dynamicData.tiecDateGai) : false,
    } : {}),
    ...dynamicData,
  };

  useEffect(() => {`
);

// 3. Replace Wedding sections
const oldWeddingSections = `<Section title="Thông tin chung">
                  <TextInput label="Tên Chú rể" value={dynamicData.groomName} placeholder="Ví dụ: Minh Khang" onChange={(v) => setDynamicData(d => ({ ...d, groomName: v }))} />
                  <TextInput label="Tên Cô dâu" value={dynamicData.brideName} placeholder="Ví dụ: Thu Hương" onChange={(v) => setDynamicData(d => ({ ...d, brideName: v }))} />
                  <DateInput 
                    label="Thời gian diễn ra lễ cưới" 
                    value={dynamicData.weddingDate || "2025-12-14T11:30"} 
                    onChange={(v) => {
                      if (!v) return setDynamicData(d => ({ ...d, weddingDate: v }));
                      const date = new Date(v);
                      if (isNaN(date.getTime())) return setDynamicData(d => ({ ...d, weddingDate: v }));
                      
                      const dayOfWeekNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                      
                      setDynamicData(d => ({
                        ...d, 
                        weddingDate: v,
                        weddingDay: date.getDate().toString(),
                        weddingMonth: \`Tháng \${date.getMonth() + 1}\`,
                        weddingYear: date.getFullYear().toString(),
                        weddingDayOfWeek: dayOfWeekNames[date.getDay()]
                      }));
                    }} 
                  />
                </Section>
                <Section title="Hình ảnh nổi bật">
                  <MediaInput label="Ảnh cover / Hero Image" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, heroImage: url }))} />
                  <MediaInput label="Ảnh Cô dâu" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, brideImage: url }))} />
                  <MediaInput label="Ảnh Chú rể" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, groomImage: url }))} />
                  <MediaInput label="Ảnh ngăn cách (Divider)" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, dividerImage: url }))} />
                  <MediaInput label="Ảnh cuối trang (Footer)" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, footerImage: url }))} />
                </Section>
                <Section title="Lời mời & Thông tin gia đình">
                  <TextArea label="Lời mời chân thành" value={dynamicData.letterText} placeholder="Được sự đồng thuận của gia đình hai bên\nChúng tôi trân trọng kính mời quý khách tới dự bữa tiệc chung vui cùng gia đình chúng tôi" onChange={(v) => setDynamicData(d => ({ ...d, letterText: v }))} />
                  <TextInput label="Họ tên bố chú rể" value={dynamicData.groomFather} placeholder="Ví dụ: Ông Trần Văn Nam" onChange={(v) => setDynamicData(d => ({ ...d, groomFather: v }))} />
                  <TextInput label="Họ tên mẹ chú rể" value={dynamicData.groomMother} placeholder="Ví dụ: Bà Nguyễn Thị My" onChange={(v) => setDynamicData(d => ({ ...d, groomMother: v }))} />
                  <TextInput label="Họ tên bố cô dâu" value={dynamicData.brideFather} placeholder="Ví dụ: Ông Nguyễn Văn Cường" onChange={(v) => setDynamicData(d => ({ ...d, brideFather: v }))} />
                  <TextInput label="Họ tên mẹ cô dâu" value={dynamicData.brideMother} placeholder="Ví dụ: Bà Lê Thị Dung" onChange={(v) => setDynamicData(d => ({ ...d, brideMother: v }))} />
                </Section>
                <Section title="Bản đồ & Sự kiện">
                  <TextArea label="Địa chỉ tổ chức" value={dynamicData.eventAddress} placeholder="Trung tâm tiệc cưới Asora Center, 123 Phố Mới, Quận 1, TP. HCM" onChange={(v) => setDynamicData(d => ({ ...d, eventAddress: v }))} />
                  <TextInput label="Link Google Maps" value={dynamicData.mapUrl} placeholder="https://maps.app.goo.gl/xxx" onChange={(v) => setDynamicData(d => ({ ...d, mapUrl: v }))} />
                  <MediaInput label="Ảnh bản đồ (Screenshot)" accept="image/*" onChange={(url) => setDynamicData(d => ({ ...d, mapImage: url }))} />
                </Section>`;

// Ensure we strip carriage returns for robust matching
const cleanOriginalContent = c.replace(/\r\n/g, '\n');
const cleanOldSections = oldWeddingSections.replace(/\r\n/g, '\n');

const newWeddingSections = `
                {isGoi3 && (
                  <div className="mb-6 flex gap-2">
                    <button type="button" onClick={() => setActiveTab("trai")} className={\`flex-1 rounded-xl py-3 text-sm font-bold transition-colors \${activeTab === "trai" ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}\`}>Thiệp Nhà Trai</button>
                    <button type="button" onClick={() => setActiveTab("gai")} className={\`flex-1 rounded-xl py-3 text-sm font-bold transition-colors \${activeTab === "gai" ? "bg-pink-500 text-white" : "bg-white/5 text-white/60 hover:bg-white/10"}\`}>Thiệp Nhà Gái</button>
                  </div>
                )}
                
                <Section title="Thông tin chung">
                  <TextInput label="Tên Chú rể" value={getVal("groomName")} placeholder="Ví dụ: Minh Khang" onChange={(v) => setVal("groomName", v)} />
                  <TextInput label="Tên Cô dâu" value={getVal("brideName")} placeholder="Ví dụ: Thu Hương" onChange={(v) => setVal("brideName", v)} />
                </Section>
                <Section title="Hình ảnh nổi bật">
                  <MediaInput label="Ảnh cover / Hero Image" accept="image/*" onChange={(url) => setVal("heroImage", url)} />
                  <MediaInput label="Ảnh Cô dâu" accept="image/*" onChange={(url) => setVal("brideImage", url)} />
                  <MediaInput label="Ảnh Chú rể" accept="image/*" onChange={(url) => setVal("groomImage", url)} />
                  <MediaInput label="Ảnh ngăn cách (Divider)" accept="image/*" onChange={(url) => setVal("dividerImage", url)} />
                  <MediaInput label="Ảnh cuối trang (Footer)" accept="image/*" onChange={(url) => setVal("footerImage", url)} />
                </Section>
                <Section title="Lời mời & Thông tin gia đình">
                  <TextArea label="Lời mời chân thành" value={getVal("letterText")} placeholder="Được sự đồng thuận của gia đình hai bên\\nChúng tôi trân trọng kính mời quý khách tới dự bữa tiệc chung vui cùng gia đình chúng tôi" onChange={(v) => setVal("letterText", v)} />
                  <TextInput label="Họ tên bố chú rể" value={getVal("groomFather")} placeholder="Ví dụ: Ông Trần Văn Nam" onChange={(v) => setVal("groomFather", v)} />
                  <TextInput label="Họ tên mẹ chú rể" value={getVal("groomMother")} placeholder="Ví dụ: Bà Nguyễn Thị My" onChange={(v) => setVal("groomMother", v)} />
                  <TextInput label="Họ tên bố cô dâu" value={getVal("brideFather")} placeholder="Ví dụ: Ông Nguyễn Văn Cường" onChange={(v) => setVal("brideFather", v)} />
                  <TextInput label="Họ tên mẹ cô dâu" value={getVal("brideMother")} placeholder="Ví dụ: Bà Lê Thị Dung" onChange={(v) => setVal("brideMother", v)} />
                </Section>
                
                {/* LỄ THÀNH HÔN */}
                <Section title="Lễ Thành Hôn (Tại Tư Gia)">
                  <div className="md:col-span-2 rounded-xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200/80 mb-2">
                    📍 <strong>Lưu ý:</strong> Đây là khối thông tin hiển thị phần làm lễ tại nhà. Vui lòng CHỈ NHẬP thời gian và địa chỉ nhà (Tư gia).
                  </div>
                  <DateInput 
                    label="Thời gian diễn ra lễ cưới" 
                    value={getVal("weddingDate") || "2025-12-14T11:30"} 
                    onChange={(v) => {
                      if (!v) return setVal("weddingDate", v);
                      const date = new Date(v);
                      if (isNaN(date.getTime())) return setVal("weddingDate", v);
                      const dayOfWeekNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
                      
                      setDynamicData(d => {
                        const newD = { ...d };
                        let target = newD;
                        if (isGoi3 && activeTab === "gai") {
                          if (!newD.gai) newD.gai = {};
                          target = newD.gai;
                        }
                        
                        target.weddingDate = v;
                        target.weddingDay = date.getDate().toString();
                        target.weddingMonth = \`Tháng \${date.getMonth() + 1}\`;
                        target.weddingYear = date.getFullYear().toString();
                        target.weddingDayOfWeek = dayOfWeekNames[date.getDay()];
                        
                        return newD;
                      });
                    }} 
                  />
                  <TextArea label="Địa chỉ Tư gia" value={getVal("eventAddress")} placeholder="Số 10, Đường Vườn Lài, Tân Phú, TP. HCM" onChange={(v) => setVal("eventAddress", v)} />
                  <TextInput label="Link Google Maps (Tư gia)" value={getVal("mapUrl")} placeholder="https://maps.app.goo.gl/xxx" onChange={(v) => setVal("mapUrl", v)} />
                  <MediaInput label="Ảnh bản đồ (Screenshot)" accept="image/*" onChange={(url) => setVal("mapImage", url)} />
                </Section>

                {/* TIỆC MỪNG NHÀ TRAI */}
                <Section title="Tiệc Mừng Lễ Thành Hôn — Nhà Trai">
                  <div className="md:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-200/80 mb-2">
                    🎉 <strong>Thiết lập Tiệc Mừng:</strong> Thông tin sẽ hiển thị ở Khối 2. Nếu trống tên nhà hàng hoặc ngày, khối Tiệc Mừng sẽ bị ẩn đi.
                  </div>
                  <DateInput label="Thời gian diễn ra Tiệc" value={getVal("tiecDate")} onChange={(v) => setVal("tiecDate", v)} />
                  <TextInput label="Tên Địa Điểm Tiệc" value={getVal("tiecName")} placeholder="Ví dụ: Nhà Hàng Hoàng Yến" onChange={(v) => setVal("tiecName", v)} />
                  <TextArea label="Địa chỉ chi tiết" value={getVal("tiecAddress")} placeholder="123 ABC, P.XYZ, Quận M" onChange={(v) => setVal("tiecAddress", v)} />
                  <TextInput label="Link Google Maps" value={getVal("tiecMapUrl")} placeholder="https://maps.app.goo.gl/xxx" onChange={(v) => setVal("tiecMapUrl", v)} />
                </Section>

                {/* TIỆC MỪNG NHÀ GÁI (Chỉ gói 2) */}
                {isGoi2 && (
                  <Section title="Tiệc Mừng Lễ Thành Hôn — Nhà Gái">
                    <div className="md:col-span-2 rounded-xl border border-pink-500/20 bg-pink-500/10 px-4 py-3 text-sm text-pink-200/80 mb-2">
                      💖 <strong>Dành riêng cho Gói 2:</strong> Thông tin tiệc nhà gái sẽ hiển thị chung trên cùng 1 thiệp.
                    </div>
                    <DateInput label="Thời gian diễn ra Tiệc" value={getVal("tiecDateGai")} onChange={(v) => setVal("tiecDateGai", v)} />
                    <TextInput label="Tên Địa Điểm Tiệc" value={getVal("tiecNameGai")} placeholder="Ví dụ: Nhà Hàng The Adora" onChange={(v) => setVal("tiecNameGai", v)} />
                    <TextArea label="Địa chỉ chi tiết" value={getVal("tiecAddressGai")} placeholder="456 DEF, P.XYZ, Quận M" onChange={(v) => setVal("tiecAddressGai", v)} />
                    <TextInput label="Link Google Maps" value={getVal("tiecMapUrlGai")} placeholder="https://maps.app.goo.gl/xxx" onChange={(v) => setVal("tiecMapUrlGai", v)} />
                  </Section>
                )}

                {/* QR MỪNG CƯỚI */}
                <Section title="QR Mừng Cưới (Tùy chọn)">
                  <TextInput label="Link QR Chú rể (VietQR hoặc URL ảnh)" value={getVal("groomQR")} placeholder="https://img.vietqr.io/image/..." onChange={(v) => setVal("groomQR", v)} />
                  <TextInput label="Link QR Cô dâu (VietQR hoặc URL ảnh)" value={getVal("brideQR")} placeholder="https://img.vietqr.io/image/..." onChange={(v) => setVal("brideQR", v)} />
                </Section>

                {(isGoi3 && activeTab === "trai") && (
                  <div className="md:col-span-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center mb-8">
                    <p className="text-sm font-semibold text-pink-200 uppercase tracking-widest">💍 Đang cấu hình: Thiệp Nhà Trai</p>
                    <p className="text-xs text-white/50 mt-1">Chuyển sang tab "Thiệp Nhà Gái" ở trên để nhập dữ liệu riêng cho thiệp thứ hai.</p>
                  </div>
                )}`;

if (cleanOriginalContent.includes(cleanOldSections)) {
  c = cleanOriginalContent.replace(cleanOldSections, newWeddingSections);
  console.log("Wedding sections successfully patched!");
} else {
  console.log("Could not find exact old wedding sections.");
  // Let's try to just replace from <Section title="Thông tin chung"> to </Section> before </> of isWedding
  const fallbackRegex = /<Section title="Thông tin chung">[\s\S]*?<Section title="Bản đồ & Sự kiện">[\s\S]*?<\/Section>/;
  if (fallbackRegex.test(cleanOriginalContent)) {
    c = cleanOriginalContent.replace(fallbackRegex, newWeddingSections);
    console.log("Wedding sections patched using fallback regex!");
  } else {
    console.log("Fallback regex also failed.");
  }
}

// 4. Floating Save Button
const oldSaveBtnHtml = `<div className="mt-8 space-y-4">
            {isConfigMode && (
              <button
                disabled={isSavingEdits}
                onClick={handleSaveEdits}
                className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 font-bold text-white shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all"
              >
                {isSavingEdits ? "Đang lưu..." : "Lưu chỉnh sửa"}
              </button>
            )}`;

const newSaveBtnHtml = `<div className="mt-8 space-y-4 pb-24"></div>
      
      {/* Floating Save Button */}
      {isConfigMode && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] md:left-[450px] lg:left-[500px] border-t border-white/10 bg-[#0f0a0c]/90 backdrop-blur-xl p-4 sm:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          <div className="mx-auto max-w-3xl flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col">
              {error ? <span className="text-red-400 text-sm font-medium">{error}</span> : null}
              {saveMessage ? <span className="text-green-400 text-sm font-medium">{saveMessage}</span> : null}
              {!error && !saveMessage && <span className="text-white/60 text-sm">Nhớ lưu lại trước khi xem trước nhé!</span>}
            </div>
            
            <button
              disabled={isSavingEdits}
              onClick={handleSaveEdits}
              className="w-full sm:w-auto min-w-[200px] rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 py-4 px-8 font-bold text-white shadow-lg hover:opacity-90 active:scale-[0.98] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
            >
              {isSavingEdits ? (
                <>
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang lưu...
                </>
              ) : "Lưu chỉnh sửa"}
            </button>
          </div>
        </div>
      )}`;

if (c.includes(oldSaveBtnHtml)) {
  c = c.replace(oldSaveBtnHtml, newSaveBtnHtml);
  console.log("Floating save button applied!");
} else {
  console.log("Could not find exact save button HTML.");
  // Let's use a regex
  const saveBtnRegex = /<div className="mt-8 space-y-4">\s*\{isConfigMode && \(\s*<button[\s\S]*?Lưu chỉnh sửa"\}\s*<\/button>\s*\)\}/;
  if (saveBtnRegex.test(c)) {
    c = c.replace(saveBtnRegex, newSaveBtnHtml);
    console.log("Floating save button applied via regex!");
  }
}

fs.writeFileSync(file, c, 'utf8');
console.log("Patch completed!");
