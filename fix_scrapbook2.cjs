const { execSync } = require('child_process');
const fs = require('fs');

// Get raw bytes from git 
const buf = execSync('git cat-file -p d48aa71:components/templates/valentine-2/components/Scrapbook.tsx', { cwd: 'd:\\dating', maxBuffer: 5 * 1024 * 1024 });
console.log('Raw size:', buf.length);

// Detect encoding
const str = buf.toString('utf8');
console.log('UTF8 check - "món quà":', str.includes('m\u00f3n qu\u00e0'));
console.log('UTF8 check - "Tớ":', str.includes('T\u1edb'));

let content = str;

// ===== POLAROID LAYOUT FIXES =====
// Fix container height + overflow-hidden
content = content.replace(
  `className="relative w-full flex-shrink-0" style={{ height: '60%' }}`,
  `className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '52%' }}`
);

// Fix polaroid padding bottom
content = content.replace(
  `className="absolute bg-white p-2 pb-8 rounded shadow-lg drop-shadow-xl border border-gray-100"`,
  `className="absolute bg-white p-2 pb-5 rounded shadow-lg drop-shadow-xl border border-gray-100"`
);

// Fix positions (fan layout spread horizontally)
content = content.replace(
  `top: i === 0 ? '8%' : '14%', `,
  `top: i === 0 ? '4%' : i === 1 ? '8%' : '4%', `
);
content = content.replace(
  `left: i === 0 ? '4%' : '22%',`,
  `left: i === 0 ? '3%' : i === 1 ? '30%' : '57%',`
);
content = content.replace(
  `rotate: i === 0 ? '-3deg' : '4deg',`,
  `rotate: i === 0 ? '-8deg' : i === 1 ? '0deg' : '8deg',`
);
content = content.replace(
  `width: '58%',`,
  `width: '38%',`
);
content = content.replace(
  `zIndex: i === 0 ? 1 : 2,`,
  `zIndex: i + 1,`
);

// Fix caption font size
content = content.replace(
  `className="text-center font-[Caveat] text-lg text-slate-800 font-bold"`,
  `className="text-center font-[Caveat] text-sm leading-tight text-slate-800 font-bold"`
);

// ===== MAKE PAGE 3 TEXT CONFIGURABLE =====
// Replace hardcoded "Tớ có một món quà..." with customizable from data
content = content.replace(
  `Tớ có một món quà bí mật, nhưng cậu phải tự tay giành lấy nó nhé!`,
  `{data.page3SecretText || 'T\u1edb c\u00f3 m\u1ed9t m\u00f3n qu\u00e0 b\u00ed m\u1eadt, nh\u01b0ng c\u1eadu ph\u1ea3i t\u1ef1 tay gi\u00e0nh l\u1ea5y n\u00f3 nh\u00e9!'}`
);

// Replace hardcoded button text
content = content.replace(
  `Đi lấy quà 🕹️`,
  `{data.page3ButtonText || '\u0110i l\u1ea5y qu\u00e0 \uD83D\uDD79\uFE0F'}`
);

console.log('After fix - "món quà":', content.includes('m\u00f3n qu\u00e0'));
console.log('After fix - fan layout:', content.includes("'57%'"));
console.log('After fix - height 52:', content.includes("'52%'"));

// Write back as UTF-8
fs.writeFileSync('d:\\dating\\components\\templates\\valentine-2\\components\\Scrapbook.tsx', content, 'utf8');
console.log('Written successfully');
