const fs = require('fs');
const path = require('path');

const templates = [
  {
    name: 'wedding-2',
    color1: '#0047AB', // Mời bạn dùng cỗ
    color2: '#7A1F1F', // button bg, dashed border
    regexToInjectAfter: /\{\/\* Dashed Invite Box \*\/\}[\s\S]*?<\/motion\.div>/,
  },
  {
    name: 'wedding-3',
    color1: '#7A1F1F', // default dark red for this template
    color2: '#7A1F1F',
    regexToInjectAfter: /\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>/,
  },
  {
    name: 'wedding-4',
    color1: '#2C3B2E',
    color2: '#2C3B2E',
    regexToInjectAfter: /\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>/,
  },
  {
    name: 'wedding-5',
    color1: '#3A4D39',
    color2: '#3A4D39',
    regexToInjectAfter: /\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>/,
  },
  {
    name: 'wedding-6',
    color1: '#E67E22',
    color2: '#E67E22',
    regexToInjectAfter: /\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>/,
  }
];

function generateJSX(t) {
  return `
          {hasTiecMung && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="border border-dashed border-[${t.color2}] rounded-lg p-6 flex flex-col items-center text-center w-full mb-16 bg-[#FFFDF9]">
              <p className="text-xs font-bold text-[${t.color1}] uppercase tracking-widest mb-4">TIỆC MỪNG {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                Vào lúc {tiecTrai.time} | {tiecTrai.date}
              </p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                {customData?.tiecName}
              </p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[200px] font-bold">
                {customData?.tiecAddress}
              </p>
              {customData?.tiecMapUrl && (
                <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="bg-[${t.color2}] text-[#FFFFFF] text-[10px] px-8 py-3 rounded-full uppercase tracking-widest font-bold shadow-md opacity-90 hover:opacity-100">
                  Xem Chỉ Đường
                </a>
              )}
            </motion.div>
          )}

          {hasTiecMungGai && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="border border-dashed border-[${t.color2}] rounded-lg p-6 flex flex-col items-center text-center w-full mb-16 bg-[#FFFDF9]">
              <p className="text-xs font-bold text-[${t.color1}] uppercase tracking-widest mb-4">TIỆC MỪNG (NHÀ GÁI)</p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                Vào lúc {tiecGai.time} | {tiecGai.date}
              </p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-2 uppercase max-w-[200px] font-bold">
                {customData?.tiecNameGai}
              </p>
              <p className="text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[200px] font-bold">
                {customData?.tiecAddressGai}
              </p>
              {customData?.tiecMapUrlGai && (
                <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="bg-[${t.color2}] text-[#FFFFFF] text-[10px] px-8 py-3 rounded-full uppercase tracking-widest font-bold shadow-md opacity-90 hover:opacity-100">
                  Xem Chỉ Đường
                </a>
              )}
            </motion.div>
          )}
`;
}

templates.forEach(t => {
  let file = path.join(__dirname, 'components/templates', t.name, 'Experience.tsx');
  if (!fs.existsSync(file)) return;
  
  let c = fs.readFileSync(file, 'utf8');
  
  if (c.includes('hasTiecMung')) {
    console.log(t.name + ' already has Tiệc Mừng');
    return;
  }
  
  // 1. Add customData to Props
  c = c.replace(/brideQR\?:\s*string;/, 'brideQR?: string;\n  customData?: any;');
  
  // 2. Destructure customData in component signature
  c = c.replace(/brideQR,([\s\S]*?)}:/, 'brideQR,\n  customData,$1}:');
  
  // 3. Add parse logic and hooks after `const [giftTab...`
  const parsingLogic = `
  const hasTiecMung = !!customData?.tiecName;
  const hasTiecMungGai = !!customData?.tiecNameGai;

  const parseTiec = (dateString?: string) => {
    if (!dateString) return { date: '', time: '' };
    const dt = new Date(dateString);
    if (isNaN(dt.getTime())) return { date: '', time: '' };
    return {
      date: dt.toLocaleDateString('vi-VN'),
      time: dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const tiecTrai = parseTiec(customData?.tiecDate);
  const tiecGai = parseTiec(customData?.tiecDateGai);
`;
  c = c.replace(/(const containerRef = useRef.*?;\n)/, '$1' + parsingLogic);
  
  // 4. Inject JSX
  let match = c.match(t.regexToInjectAfter);
  if (match) {
    c = c.replace(t.regexToInjectAfter, match[0] + '\n' + generateJSX(t));
    fs.writeFileSync(file, c, 'utf8');
    console.log('Fixed ' + t.name);
  } else {
    console.log('Failed to match inject regex in ' + t.name);
  }
});
