const fs = require('fs');
const path = require('path');

for (let i = 3; i <= 6; i++) {
  const filePath = path.join(__dirname, `components/templates/wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  // Fix Khối 2 titles
  content = content.replace(
    /TIỆC MỪNG \{hasTiecMungGai \? "\([^)]*\)" : ""\}/g,
    'TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}'
  );
  content = content.replace(
    /TIỆC MỪNG \(NHÀ GÁI\)/g,
    'TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)'
  );
  
  // In wedding 3-6, there's a tiecName block. Let's find it and remove it, then merge with address.
  // Generally it looks like:
  // <p className="text-[10px]...">{customData?.tiecName}</p>
  // <p className="text-[10px]...">{customData?.tiecAddress}</p>
  
  content = content.replace(
    /<(p|h3) className="([^"]*?)">\s*\{customData\?\.tiecName\}\s*<\/(p|h3)>\s*<p className="([^"]*?)">\s*\{customData\?\.tiecAddress\}\s*<\/p>/g,
    '<p className="$4">\n                <span className="block font-bold mb-1">{customData?.tiecName}</span>\n                {customData?.tiecAddress}\n              </p>'
  );

  content = content.replace(
    /<(p|h3) className="([^"]*?)">\s*\{customData\?\.tiecNameGai\}\s*<\/(p|h3)>\s*<p className="([^"]*?)">\s*\{customData\?\.tiecAddressGai\}\s*<\/p>/g,
    '<p className="$4">\n                <span className="block font-bold mb-1">{customData?.tiecNameGai}</span>\n                {customData?.tiecAddressGai}\n              </p>'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Done patching tiec_mung names 3-6!");
