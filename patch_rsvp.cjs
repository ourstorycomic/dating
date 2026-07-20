const fs = require('fs');
const path = require('path');

const baseDir = 'components/templates';
for (let i = 1; i <= 6; i++) {
  const p = path.join(__dirname, baseDir, `wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(p)) continue;
  
  let c = fs.readFileSync(p, 'utf8');

  // wedding-1
  if (i === 1) {
    if (!c.includes('customCount')) {
      c = c.replace(/const \[rsvpCount, setRsvpCount\] = useState\("1"\);/, 'const [rsvpCount, setRsvpCount] = useState("1");\n  const [customCount, setCustomCount] = useState("");');
      
      const targetStr = '</div>\n                </div>\n                <button type="submit"';
      if (c.includes(targetStr)) {
        c = c.replace(targetStr, `</div>\n                    {rsvpCount === "Khác" && (\n                      <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập số lượng..." className="w-full mt-3 px-4 py-2 bg-[#f9f8f6] border border-[#d6cfc5] text-sm focus:border-[#8c7b6b] focus:outline-none placeholder:text-xs placeholder:text-gray-400" required />\n                    )}\n                </div>\n                <button type="submit"`);
      }
    }
  } else {
    // wedding-2 to 6
    if (!c.includes('customCount')) {
       if (c.includes('<select')) {
         c = c.replace(/const \[showQR, setShowQR\] = useState\(false\);/, 'const [showQR, setShowQR] = useState(false);\n  const [rsvpCount, setRsvpCount] = useState("Có");\n  const [customCount, setCustomCount] = useState("");');
         
         // In some templates the select is slightly different.
         c = c.replace(/<select className="(.*?)">\s*<option>Xác Nhận Tham Dự\.\.\.<\/option>\s*<option>Có<\/option>\s*<option>Không<\/option>\s*<\/select>/g, 
         `<select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="$1">\n                 <option value="Có">Có tham dự</option>\n                 <option value="Không">Không tham dự</option>\n                 <option value="Khác">Có, dắt theo người thân</option>\n               </select>\n               {rsvpCount === "Khác" && (\n                 <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="w-full bg-white text-[#2D2A28] text-xs px-4 py-3 rounded-md outline-none" required />\n               )}`);
       }
    }
  }

  // Address text fix
  c = c.replace(/Địa điểm tổ chức/g, 'Địa điểm tổ chức Lễ thành hôn');
  
  // Tiec Mung Date parsing and calendar mark
  // Search for parsedDDate
  if (c.includes('parsedDDate.getMonth() + 1 === dMonth')) {
    if (!c.includes('const isTiec = ')) {
       // We need to inject tiecTrai parsed logic into monthDays map
       c = c.replace(
         /const isWedding = day === dDate && parsedDDate\.getMonth\(\) \+ 1 === dMonth && parsedDDate\.getFullYear\(\) === dYear;/,
         `const isWedding = day === dDate && parsedDDate.getMonth() + 1 === dMonth && parsedDDate.getFullYear() === dYear;
                let tiecDay = 0, tiecMonth = 0, tiecYear = 0;
                const tiecToUse = (side === 'trai' || !hasTiecMungGai) ? tiecTrai : tiecGai;
                if (tiecToUse && tiecToUse.date) {
                  const [td, tm, ty] = tiecToUse.date.split('/');
                  tiecDay = parseInt(td); tiecMonth = parseInt(tm); tiecYear = parseInt(ty);
                }
                const isTiec = tiecDay === day && tiecMonth === (parsedDDate.getMonth() + 1) && tiecYear === parsedDDate.getFullYear();`
       );
       
       // And render the mark
       c = c.replace(
         /\{isWedding && \(\s*<motion\.div initial=\{\{ scale: 0 \}\} animate=\{\{ scale: 1 \}\} transition=\{\{ delay: 2\.5, type: "spring" \}\} className="absolute inset-0 border border-\[(.*?)\] rounded-full scale-125 opacity-80" \/>\s*\)\}/g,
         `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 border border-[$1] rounded-full scale-125 opacity-80" />
                    )}
                    {isTiec && !isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6, type: "spring" }} className="absolute inset-0 border border-dashed border-[$1] rounded-full scale-110 opacity-70" />
                    )}
                    {isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.6, type: "spring" }} className="absolute inset-0 border border-dashed border-[$1] rounded-full scale-150 opacity-70" />
                    )}`
       );
    }
  }

  // Google Map Hover Text White Bug
  // Some templates have: hover:text-white or something that makes it white when hovered
  if (c.includes('hover:text-white') && c.includes('Xem bản đồ')) {
    // If the map button background turns white on hover, and text turns white... wait. 
    // The user said: "hover vào google map thì bị biến thành màu trắng trùng với nền nè"
    // So the background might be getting white, or text getting white.
    // Let's replace hover:text-white with hover:text-[#7A1F1F] or something if bg becomes white?
    // In wedding-3, map button:
    // <a ... className="bg-[#FFFFFF] text-[#2D2A28] ... hover:bg-[#FFFFFF] hover:text-[#2D2A28]" />
    // Wait! In wedding-2:
  }
  
  // Year font issue
  // The year is using a different font from "Tháng 12". The user said "1 số font còn khá lỗi như cái 2026 kìa đang không đồng bộ với tháng 12".
  // "Tháng 12" is often rendered with font-serif or font-sans. The year is usually next to it.
  c = c.replace(/<span className="font-sans">(.*?)<\/span>/g, (match, p1) => {
    if (p1.includes('parsedDDate.getFullYear()')) return `<span>${p1}</span>`;
    return match;
  });
  c = c.replace(/<span className="font-sans text-xl">(.*?)<\/span>/g, (match, p1) => {
    if (p1.includes('getFullYear')) return `<span className="text-xl">${p1}</span>`;
    return match;
  });

  fs.writeFileSync(p, c, 'utf8');
  console.log('patched ' + i);
}
