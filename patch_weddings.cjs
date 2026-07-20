const fs = require('fs');
const path = require('path');

function patch(file, replacements) {
    let content = fs.readFileSync(file, 'utf8');
    for (let r of replacements) {
        content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(file, content, 'utf8');
}

// 1. wedding-2
patch('components/templates/wedding-2/Experience.tsx', [
    { search: /text-\[10px\] font-medium text-\[\#555\] uppercase leading-relaxed mt-2">\{groomFamily/g, replace: 'text-sm font-medium text-[#555] uppercase leading-relaxed mt-2">{groomFamily' },
    { search: /text-\[10px\] font-medium text-\[\#555\] uppercase leading-relaxed mt-2">\{brideFamily/g, replace: 'text-sm font-medium text-[#555] uppercase leading-relaxed mt-2">{brideFamily' },
    { search: /Địa Điểm/g, replace: 'Địa điểm tổ chức Lễ thành hôn' },
    { search: /hover:bg-\[\#7a1f1f\]/g, replace: 'hover:bg-[#7A1F1F]' },
    { search: /hover:text-\[\#ffffff\]/g, replace: 'hover:text-white' }
]);

// 2. wedding-3
patch('components/templates/wedding-3/Experience.tsx', [
    { search: /setTimeout\(\(\) => setAllowScroll\(true\), 3500\)/g, replace: 'setTimeout(() => setAllowScroll(true), 1500)' },
    { search: /3500\); \/\/ Wait for door animation/g, replace: '1500); // Wait for door animation' },
    { search: /transition=\{\{ duration: 3\.5/g, replace: 'transition={{ duration: 1.5' },
    { search: /className="text-\[10px\] text-\[\#2D2A28\] font-bold whitespace-pre-line">\{groomFamily/g, replace: 'className="text-sm text-[#2D2A28] font-bold whitespace-pre-line">{groomFamily' },
    { search: /className="text-\[10px\] text-\[\#2D2A28\] font-bold whitespace-pre-line">\{brideFamily/g, replace: 'className="text-sm text-[#2D2A28] font-bold whitespace-pre-line">{brideFamily' },
    { 
        search: /<div className="w-16 h-40 bg-\[\#7A1F1F\] rounded-t-md rounded-b-md flex items-end justify-center pb-4 shadow-lg shrink-0">([\s\S]*?)<\/div>/,
        replace: `<div className="w-16 h-40 bg-[#7A1F1F] rounded-t-md rounded-b-md flex flex-col items-center justify-between py-4 shadow-lg shrink-0 relative overflow-hidden">
                <img src="/assets/wedding/wedding-3/ring.webp" alt="Ring" className="w-10 h-10 object-contain z-10" />
                <img src="/assets/wedding/wedding-3/textthiep.webp" alt="Thiệp Mời" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] z-10" />
              </div>`
    },
    { search: /Địa Điểm/g, replace: 'Địa điểm tổ chức Lễ thành hôn' },
    { search: /hover:bg-\[\#7a1f1f\]/g, replace: 'hover:bg-[#7A1F1F]' },
    { search: /hover:text-\[\#ffffff\]/g, replace: 'hover:text-white' }
]);

const calSearch3 = /\{monthDays\.map\(day => \{[\s\S]*?const isWedding = day === Number\(dDay\)[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}\)\}/;
const calReplace3 = `{monthDays.map(day => {
                const isWedding = day === Number(dDay) && parsedDDate.getMonth() + 1 === dMonthNumber && parsedDDate.getFullYear() === Number(dYear);
                let tiecDay = 0, tiecMonth = 0, tiecYear = 0;
                const tiecToUse = (side === 'trai' || !hasTiecMungGai) ? tiecTrai : tiecGai;
                if (tiecToUse && tiecToUse.date) {
                  const [td, tm, ty] = tiecToUse.date.split("/");
                  tiecDay = parseInt(td); tiecMonth = parseInt(tm); tiecYear = parseInt(ty);
                }
                const isTiec = tiecDay === day && tiecMonth === dMonthNumber && tiecYear === Number(dYear);
                return (
                  <div key={day} className="relative flex justify-center items-center w-7 h-7 mx-auto">
                    {isWedding && (
                      <motion.svg initial={{ scale: 0 }} whileInView={{ scale: 1.15 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }} className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </motion.svg>
                    )}
                    {isTiec && !isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 0.9 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 border-[1.5px] border-dashed border-[#7A1F1F] rounded-full bg-[#7A1F1F]/5" />
                    )}
                    <span className={\`relative z-10 \${isWedding ? "text-white font-bold text-[11px]" : isTiec ? "text-[#7A1F1F] font-bold" : "text-[#2D2A28]"}\`}>{day}</span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#7A1F1F] bg-white z-20" />
                    )}
                  </div>
                );
              })}`;

const legendSearch3 = /<div className="flex items-center gap-2 text-\[9px\] font-sans font-bold uppercase tracking-widest text-\[\#7A1F1F\]">[\s\S]*?Lễ Cưới[\s\S]*?<\/div>/;
const legendReplace3 = `<div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                <svg className="w-4 h-4 text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg> Lễ Cưới
              </div>
              {(hasTiecMung || hasTiecMungGai) && (
                <div className="flex items-center gap-2 text-[9px] font-sans font-bold uppercase tracking-widest text-[#7A1F1F]">
                  <div className="w-3.5 h-3.5 rounded-full border-[1.5px] border-dashed border-[#7A1F1F] bg-[#7A1F1F]/5"></div> Tiệc Mừng
                </div>
              )}`;

patch('components/templates/wedding-3/Experience.tsx', [
    { search: calSearch3, replace: calReplace3 },
    { search: legendSearch3, replace: legendReplace3 }
]);

// 3. wedding-4
patch('components/templates/wedding-4/Experience.tsx', [
    { search: /text-\[10px\] sm:text-\[11px\] text-\[\#5A5552\] uppercase leading-relaxed font-medium">\{groomFamily/g, replace: 'text-sm text-[#5A5552] uppercase leading-relaxed font-medium">{groomFamily' },
    { search: /text-\[10px\] sm:text-\[11px\] text-\[\#5A5552\] uppercase leading-relaxed font-medium">\{brideFamily/g, replace: 'text-sm text-[#5A5552] uppercase leading-relaxed font-medium">{brideFamily' },
    { search: /Địa Điểm/g, replace: 'Địa điểm tổ chức Lễ thành hôn' },
    { search: /hover:bg-\[\#7a1f1f\]/g, replace: 'hover:bg-[#7A1F1F]' },
    { search: /hover:text-\[\#ffffff\]/g, replace: 'hover:text-white' },
    {
        search: /<select className="w-full bg-transparent border-b border-\[\#D6C1A5\] text-\[\#2D2A28\] text-xs px-2 py-3 outline-none appearance-none">[\s\S]*?<\/select>/,
        replace: `<select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-transparent border-b border-[#D6C1A5] text-[#2D2A28] text-xs px-2 py-3 outline-none mt-4" required />
              )}`
    }
]);

const calSearch4 = /\{monthDays\.map\(day => \{[\s\S]*?const isWedding = day === Number\(dDate\)[\s\S]*?<\/div>[\s\S]*?\);[\s\S]*?\}\)\}/;
const calReplace4 = `{monthDays.map(day => {
                const isWedding = day === Number(dDate) && parsedDDate.getMonth() + 1 === dMonthNumber && parsedDDate.getFullYear() === Number(dYear);
                let tiecDay = 0, tiecMonth = 0, tiecYear = 0;
                const tiecToUse = (side === 'trai' || !hasTiecMungGai) ? tiecTrai : tiecGai;
                if (tiecToUse && tiecToUse.date) {
                  const [td, tm, ty] = tiecToUse.date.split("/");
                  tiecDay = parseInt(td); tiecMonth = parseInt(tm); tiecYear = parseInt(ty);
                }
                const isTiec = tiecDay === day && tiecMonth === dMonthNumber && tiecYear === Number(dYear);
                return (
                  <div key={day} className="relative flex justify-center items-center w-7 h-7 mx-auto">
                    {isWedding && (
                      <motion.svg initial={{ scale: 0 }} whileInView={{ scale: 1.15 }} viewport={{ once: true }} transition={{ delay: 0.5, type: "spring" }} className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] text-[#7A1F1F]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </motion.svg>
                    )}
                    {isTiec && !isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 0.9 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 border-[1.5px] border-dashed border-[#7A1F1F] rounded-full bg-[#7A1F1F]/5" />
                    )}
                    <span className={\`relative z-10 \${isWedding ? "text-[#FFFFFF] font-bold text-[11px]" : isTiec ? "text-[#7A1F1F] font-bold" : "text-[#5A5552]"}\`}>{day}</span>
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-[#7A1F1F] bg-[#FFFFFF] z-20" />
                    )}
                  </div>
                );
              })}`;

patch('components/templates/wedding-4/Experience.tsx', [
    { search: calSearch4, replace: calReplace4 },
    { search: legendSearch3, replace: legendReplace3 }
]);

// 4. wedding-5
patch('components/templates/wedding-5/Experience.tsx', [
    { search: /text-\[10px\] text-\[\#4a5a40\] uppercase leading-relaxed font-semibold">\{groomFamily/g, replace: 'text-sm text-[#4a5a40] uppercase leading-relaxed font-semibold">{groomFamily' },
    { search: /text-\[10px\] text-\[\#4a5a40\] uppercase leading-relaxed font-semibold">\{brideFamily/g, replace: 'text-sm text-[#4a5a40] uppercase leading-relaxed font-semibold">{brideFamily' },
    { search: /Địa Điểm/g, replace: 'Địa điểm tổ chức Lễ thành hôn' },
    { search: /hover:bg-\[\#7a1f1f\]/g, replace: 'hover:bg-[#7A1F1F]' },
    { search: /hover:text-\[\#ffffff\]/g, replace: 'hover:text-white' },
    {
        search: /<select className="w-full bg-transparent border-b border-\[\#c5b182\] text-\[\#2d2d2d\] text-xs px-2 py-2 outline-none focus:border-\[\#4a5a40\] transition-colors appearance-none">[\s\S]*?<\/select>/,
        replace: `<select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors appearance-none">
                  <option value="Có">Có tham dự</option>
                  <option value="Không">Không tham dự</option>
                  <option value="Khác">Có, dắt theo người thân</option>
                </select>
                {rsvpCount === "Khác" && (
                  <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-transparent border-b border-[#c5b182] text-[#2d2d2d] text-xs px-2 py-2 outline-none focus:border-[#4a5a40] transition-colors mt-4" required />
                )}`
    }
]);

// 5. wedding-6
patch('components/templates/wedding-6/Experience.tsx', [
    { search: /text-\[10px\] font-medium text-\[\#555\] uppercase leading-relaxed mt-2">\{groomFamily/g, replace: 'text-sm font-medium text-[#555] uppercase leading-relaxed mt-2">{groomFamily' },
    { search: /text-\[10px\] font-medium text-\[\#555\] uppercase leading-relaxed mt-2">\{brideFamily/g, replace: 'text-sm font-medium text-[#555] uppercase leading-relaxed mt-2">{brideFamily' },
    { search: /Địa Điểm/g, replace: 'Địa điểm tổ chức Lễ thành hôn' },
    { search: /hover:bg-\[\#7a1f1f\]/g, replace: 'hover:bg-[#7A1F1F]' },
    { search: /hover:text-\[\#ffffff\]/g, replace: 'hover:text-white' },
    {
        search: /<select className="w-full bg-\[\#fafafa\] text-\[\#333\] text-xs px-4 py-3 border border-\[\#eaeaea\] outline-none focus:border-\[\#e8c0c4\] transition-colors appearance-none">[\s\S]*?<\/select>/,
        replace: `<select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="w-full bg-[#fafafa] text-[#333] text-xs px-4 py-3 border border-[#eaeaea] outline-none focus:border-[#e8c0c4] transition-colors appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-[#fafafa] text-[#333] text-xs px-4 py-3 border border-[#eaeaea] outline-none focus:border-[#e8c0c4] transition-colors mt-4" required />
              )}`
    }
]);

console.log("Patched successfully!");
