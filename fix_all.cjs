const { execSync } = require('child_process');
const fs = require('fs');

// ============================================================
// PATCH 1: Fix OrderBuilderForm.tsx
// ============================================================
let form = fs.readFileSync('d:\\dating\\components\\dashboard\\OrderBuilderForm.tsx', 'utf8');

// 1a. Add page3SecretText + page3ButtonText to initial valentine2Config state
form = form.replace(
  `    page3Hint: "Kéo ruy băng nhé",`,
  `    page3Hint: "Kéo ruy băng nhé",\n    page3SecretText: "Tớ có một món quà bí mật, nhưng cậu phải tự tay giành lấy nó nhé!",\n    page3ButtonText: "Đi lấy quà 🕹️",`
);

// 1b. Add to loadOrder merge
form = form.replace(
  `        page3Hint: cd.page3Hint ?? current.page3Hint,\n        confessionText: cd.confessionText ?? current.confessionText,`,
  `        page3Hint: cd.page3Hint ?? current.page3Hint,\n        page3SecretText: cd.page3SecretText ?? current.page3SecretText,\n        page3ButtonText: cd.page3ButtonText ?? current.page3ButtonText,\n        confessionText: cd.confessionText ?? current.confessionText,`
);

// 1c. Add form inputs for page3SecretText and page3ButtonText
form = form.replace(
  `                    <TextInput label="Gợi ý kéo ruy băng" value={valentine2Config.page3Hint} onChange={(v) => setValentine2Config({ ...valentine2Config, page3Hint: v })} />`,
  `                    <TextInput label="Gợi ý kéo ruy băng" value={valentine2Config.page3Hint} onChange={(v) => setValentine2Config({ ...valentine2Config, page3Hint: v })} />\n                    <div className="mt-4" />\n                    <TextArea label="Nội dung bí mật trong túi" value={valentine2Config.page3SecretText} onChange={(v) => setValentine2Config({ ...valentine2Config, page3SecretText: v })} />\n                    <div className="mt-4" />\n                    <TextInput label="Nút lấy quà" value={valentine2Config.page3ButtonText} onChange={(v) => setValentine2Config({ ...valentine2Config, page3ButtonText: v })} />`
);

// Verify
console.log('Form patch checks:');
console.log('  page3SecretText state:', form.includes('page3SecretText: "Tớ'));
console.log('  page3SecretText loadOrder:', form.includes('page3SecretText: cd.page3SecretText'));
console.log('  page3SecretText input:', form.includes('Nội dung bí mật trong túi'));

fs.writeFileSync('d:\\dating\\components\\dashboard\\OrderBuilderForm.tsx', form, 'utf8');

// ============================================================
// PATCH 2: Restore + patch Scrapbook.tsx from clean git source
// ============================================================
const rawBuf = execSync('git cat-file -p d48aa71:components/templates/valentine-2/components/Scrapbook.tsx', {
  cwd: 'd:\\dating',
  maxBuffer: 5 * 1024 * 1024
});

let c = rawBuf.toString('utf8');

// Verify clean source
console.log('\nScrapbook source check: "món quà":', c.includes('m\u00f3n qu\u00e0'));

// Polaroid layout fixes
c = c.replace(
  `className="relative w-full flex-shrink-0" style={{ height: '60%' }}`,
  `className="relative w-full flex-shrink-0 overflow-hidden" style={{ height: '52%' }}`
);
c = c.replace(
  `className="absolute bg-white p-2 pb-8 rounded shadow-lg drop-shadow-xl border border-gray-100"`,
  `className="absolute bg-white p-2 pb-5 rounded shadow-lg drop-shadow-xl border border-gray-100"`
);
c = c.replace(
  `top: i === 0 ? '8%' : '14%', `,
  `top: i === 0 ? '4%' : i === 1 ? '8%' : '4%', `
);
c = c.replace(
  `left: i === 0 ? '4%' : '22%',`,
  `left: i === 0 ? '3%' : i === 1 ? '30%' : '57%',`
);
c = c.replace(
  `rotate: i === 0 ? '-3deg' : '4deg',`,
  `rotate: i === 0 ? '-8deg' : i === 1 ? '0deg' : '8deg',`
);
c = c.replace(
  `width: '58%',`,
  `width: '38%',`
);
c = c.replace(
  `zIndex: i === 0 ? 1 : 2,`,
  `zIndex: i + 1,`
);
c = c.replace(
  `className="text-center font-[Caveat] text-lg text-slate-800 font-bold"`,
  `className="text-center font-[Caveat] text-sm leading-tight text-slate-800 font-bold"`
);

// Make page 3 secret text configurable
c = c.replace(
  `T\u1edb c\u00f3 m\u1ed9t m\u00f3n qu\u00e0 b\u00ed m\u1eadt, nh\u01b0ng c\u1eadu ph\u1ea3i t\u1ef1 tay gi\u00e0nh l\u1ea5y n\u00f3 nh\u00e9!`,
  `{data.page3SecretText || 'T\u1edb c\u00f3 m\u1ed9t m\u00f3n qu\u00e0 b\u00ed m\u1eadt, nh\u01b0ng c\u1eadu ph\u1ea3i t\u1ef1 tay gi\u00e0nh l\u1ea5y n\u00f3 nh\u00e9!'}`
);
c = c.replace(
  `\u0110i l\u1ea5y qu\u00e0 \uD83D\uDD79\uFE0F`,
  `{data.page3ButtonText || '\u0110i l\u1ea5y qu\u00e0 \uD83D\uDD79\uFE0F'}`
);

console.log('\nScrapbook patch checks:');
console.log('  height 52:', c.includes("'52%'"));
console.log('  fan layout 57:', c.includes("'57%'"));
console.log('  -8deg:', c.includes("'-8deg'"));
console.log('  width 38:', c.includes("'38%'"));
console.log('  page3SecretText dynamic:', c.includes('page3SecretText'));
console.log('  Vietnamese still ok:', c.includes('m\u00f3n qu\u00e0'));

fs.writeFileSync('d:\\dating\\components\\templates\\valentine-2\\components\\Scrapbook.tsx', c, 'utf8');
console.log('\nAll patches applied successfully!');
