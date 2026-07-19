const fs = require('fs');
const path = require('path');

const templates = [
  {
    name: 'wedding-2',
    color1: '#0047AB',
    color2: '#7A1F1F',
    regexToInjectAfter: /(\{\/\* Dashed Invite Box \*\/\}[\s\S]*?<\/motion\.div>)/,
    calendarRegex: /\{isWedding && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}\s*\{isEngagement && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}/g,
    calendarReplace: `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#7A1F1F] opacity-20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    )}`
  },
  {
    name: 'wedding-3',
    color1: '#7A1F1F',
    color2: '#7A1F1F',
    regexToInjectAfter: /(\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>)/,
    calendarRegex: /\{isWedding && \(\s*<motion\.img[^>]+>\s*\)\}\s*\{isEngagement && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}/g,
    calendarReplace: `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#7A1F1F] opacity-20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    )}`
  },
  {
    name: 'wedding-4',
    color1: '#2C3B2E',
    color2: '#2C3B2E',
    regexToInjectAfter: /(\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>)/,
    calendarRegex: /\{isWedding && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}\s*\{isEngagement && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}/g,
    calendarReplace: `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#A67C52] opacity-20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    )}`
  },
  {
    name: 'wedding-5',
    color1: '#3A4D39',
    color2: '#3A4D39',
    regexToInjectAfter: /(\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>)/,
    calendarRegex: /\{isWedding && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}\s*\{isEngagement && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}/g,
    calendarReplace: `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#3A4D39] opacity-20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    )}`
  },
  {
    name: 'wedding-6',
    color1: '#E67E22',
    color2: '#E67E22',
    regexToInjectAfter: /(\{\/\* Lễ Thành Hôn \*\/\}[\s\S]*?<\/motion\.div>)/,
    calendarRegex: /\{isWedding && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}\s*\{isEngagement && \(\s*<motion\.div[^>]+>\s*<\/?motion\.div>\s*\)\}/g,
    calendarReplace: `{isWedding && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} className="absolute inset-0 flex items-center justify-center -z-10">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#E67E22] opacity-20">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                      </motion.div>
                    )}`
  }
];

function generateJSX(t) {
  let boxClasses = t.name === 'wedding-2' 
    ? `border border-dashed border-[${t.color2}] rounded-lg p-6 flex flex-col items-center text-center w-full mb-16 bg-[#FFFDF9]` 
    : `bg-white p-6 shadow-md w-full mb-8 relative border-t-4 border-[${t.color2}]`;
    
  let p1Classes = t.name === 'wedding-2'
    ? `text-xs font-bold text-[${t.color1}] uppercase tracking-widest mb-4`
    : `text-xs font-serif font-bold text-[${t.color1}] uppercase mb-4 tracking-[0.2em]`;
    
  let p2Classes = t.name === 'wedding-2'
    ? `text-[10px] text-[#5A5552] leading-relaxed mb-2 uppercase max-w-[200px] font-bold`
    : `text-[10px] text-[#2D2A28] uppercase font-bold tracking-widest mb-2`;
    
  let p3Classes = t.name === 'wedding-2'
    ? `text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[200px] font-bold`
    : `text-[10px] text-[#2D2A28] leading-relaxed mb-4`;
    
  let btnClasses = t.name === 'wedding-2'
    ? `bg-[${t.color2}] text-[#FFFFFF] text-[10px] px-8 py-3 rounded-full uppercase tracking-widest font-bold shadow-md hover:bg-opacity-80`
    : `w-full bg-[${t.color2}] text-[#FFFFFF] py-3 rounded-full flex items-center justify-center gap-2 mb-2 shadow-md hover:bg-opacity-80 text-[10px] uppercase tracking-widest font-bold`;

  return `
          {hasTiecMung && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="${boxClasses}">
              <h3 className="${p1Classes}">TIỆC MỪNG {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
              <p className="${p2Classes}">
                Vào lúc {tiecTrai.time} | {tiecTrai.date}
              </p>
              <h3 className="text-xs font-bold text-[#2D2A28] uppercase mt-2 mb-2">
                {customData?.tiecName}
              </h3>
              <p className="${p3Classes}">
                {customData?.tiecAddress}
              </p>
              {customData?.tiecMapUrl && (
                <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="${btnClasses}">
                  Xem Chỉ Đường
                </a>
              )}
            </motion.div>
          )}

          {hasTiecMungGai && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="${boxClasses}">
              <h3 className="${p1Classes}">TIỆC MỪNG (NHÀ GÁI)</h3>
              <p className="${p2Classes}">
                Vào lúc {tiecGai.time} | {tiecGai.date}
              </p>
              <h3 className="text-xs font-bold text-[#2D2A28] uppercase mt-2 mb-2">
                {customData?.tiecNameGai}
              </h3>
              <p className="${p3Classes}">
                {customData?.tiecAddressGai}
              </p>
              {customData?.tiecMapUrlGai && (
                <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="${btnClasses}">
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
  
  if (!c.includes('customData?: any')) {
    c = c.replace(/brideQR\?:\s*string;/, 'brideQR?: string;\n  customData?: any;');
    c = c.replace(/brideQR,([\s\S]*?)}:/, 'brideQR,\n  customData,$1}:');
  }
  
  if (!c.includes('const hasTiecMung =')) {
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
    c = c.replace(/(const containerRef = useRef[\s\S]*?;\r?\n)/, '$1' + parsingLogic);
  }
  
  if (!c.includes('TIỆC MỪNG')) {
    let match = c.match(t.regexToInjectAfter);
    if (match) {
      c = c.replace(t.regexToInjectAfter, match[1] + generateJSX(t));
    } else {
      console.log('Failed to match inject regex in ' + t.name);
    }
  }

  // Also replace calendar markers
  c = c.replace(t.calendarRegex, t.calendarReplace);
  
  // Also clean up any lingering tiecDateTime logic in customData parsing if it was already there (for some reason)
  c = c.replace(/tiecDateTimeGai/g, 'tiecDateGai');
  c = c.replace(/tiecDateTime/g, 'tiecDate');

  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed ' + t.name);
});
