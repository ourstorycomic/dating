const fs = require('fs');
const path = require('path');

const templates = [
  {
    name: 'wedding-3',
    color1: '#7A1F1F',
    color2: '#7A1F1F',
  },
  {
    name: 'wedding-4',
    color1: '#7A1F1F',
    color2: '#D6C1A5',
  },
  {
    name: 'wedding-6',
    color1: '#E67E22',
    color2: '#E67E22',
  }
];

function generateJSX(t) {
  let boxClasses = t.name === 'wedding-3' 
    ? `bg-white p-6 shadow-[4px_4px_0px_0px_#7A1F1F] border border-[#7A1F1F] w-full max-w-[280px] mb-8 relative` 
    : t.name === 'wedding-4' 
      ? `w-full bg-[#FFFDF9] border border-[#D6C1A5]/50 p-6 rounded-sm text-center mb-12`
      : `bg-white p-6 shadow-md w-full mb-8 relative border-t-4 border-[${t.color2}]`;
    
  let p1Classes = t.name === 'wedding-3'
    ? `text-xs font-serif font-bold text-[#7A1F1F] uppercase mb-4 tracking-[0.2em] text-center`
    : t.name === 'wedding-4'
      ? `text-[12px] font-serif font-bold text-[#7A1F1F] mb-3 uppercase tracking-[0.2em]`
      : `text-xs font-serif font-bold text-[${t.color1}] uppercase mb-4 tracking-[0.2em]`;
    
  let p2Classes = t.name === 'wedding-3'
    ? `text-[10px] text-[#2D2A28] uppercase font-bold tracking-widest mb-2 text-center`
    : t.name === 'wedding-4'
      ? `text-[10px] text-[#A67C52] uppercase font-bold tracking-widest mb-2`
      : `text-[10px] text-[#2D2A28] uppercase font-bold tracking-widest mb-2`;
    
  let p3Classes = t.name === 'wedding-3'
    ? `text-[10px] text-[#2D2A28] leading-relaxed mb-4 text-center`
    : t.name === 'wedding-4'
      ? `text-[11px] text-[#5A5552] uppercase tracking-wider leading-relaxed px-2 font-medium mb-4`
      : `text-[10px] text-[#2D2A28] leading-relaxed mb-4`;
    
  let btnClasses = t.name === 'wedding-3'
    ? `w-full bg-[#7A1F1F] text-[#FFFFFF] py-3 rounded-sm flex items-center justify-center gap-2 mb-2 hover:bg-[#5a1515] transition-colors shadow-md`
    : t.name === 'wedding-4'
      ? `bg-[#7A1F1F] text-[#FFFFFF] text-[10px] uppercase font-bold tracking-widest px-6 py-3 rounded-full shadow-lg border border-white/30 whitespace-nowrap inline-block`
      : `w-full bg-[${t.color2}] text-[#FFFFFF] py-3 rounded-full flex items-center justify-center gap-2 mb-2 shadow-md hover:bg-opacity-80 text-[10px] uppercase tracking-widest font-bold`;

  return `
          {hasTiecMung && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="${boxClasses}">
              <h3 className="${p1Classes}">TIỆC MỪNG {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>
              <p className="${p2Classes}">
                Vào lúc {tiecTrai.time} | {tiecTrai.date}
              </p>
              <h3 className="text-xs font-bold text-[#2D2A28] uppercase mt-2 mb-2 text-center">
                {customData?.tiecName}
              </h3>
              <p className="${p3Classes}">
                {customData?.tiecAddress}
              </p>
              {customData?.tiecMapUrl && (
                <div className="text-center">
                  <a href={customData.tiecMapUrl} target="_blank" rel="noreferrer" className="${btnClasses}">
                    Xem Chỉ Đường
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {hasTiecMungGai && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8 }} className="${boxClasses}">
              <h3 className="${p1Classes}">TIỆC MỪNG (NHÀ GÁI)</h3>
              <p className="${p2Classes}">
                Vào lúc {tiecGai.time} | {tiecGai.date}
              </p>
              <h3 className="text-xs font-bold text-[#2D2A28] uppercase mt-2 mb-2 text-center">
                {customData?.tiecNameGai}
              </h3>
              <p className="${p3Classes}">
                {customData?.tiecAddressGai}
              </p>
              {customData?.tiecMapUrlGai && (
                <div className="text-center">
                  <a href={customData.tiecMapUrlGai} target="_blank" rel="noreferrer" className="${btnClasses}">
                    Xem Chỉ Đường
                  </a>
                </div>
              )}
            </motion.div>
          )}
`;
}

templates.forEach(t => {
  let file = path.join(__dirname, 'components/templates', t.name, 'Experience.tsx');
  if (!fs.existsSync(file)) return;
  
  let c = fs.readFileSync(file, 'utf8');
  
  if (!c.includes('TIỆC MỪNG')) {
    // Inject before {/* Calendar... */}
    c = c.replace(/(\s*\{\/\* Calendar)/, generateJSX(t) + '$1');
    fs.writeFileSync(file, c, 'utf8');
    console.log('Fixed ' + t.name);
  } else {
    console.log(t.name + ' already has Tiệc Mừng');
  }
});
