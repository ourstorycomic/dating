const fs = require('fs');
const path = require('path');

for (let i = 1; i <= 6; i++) {
  const filePath = path.join(__dirname, `components/templates/wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(filePath)) continue;

  let content = fs.readFileSync(filePath, 'utf8');

  if (i === 1) {
    content = content.replace(
      /TIỆC MỪNG \{hasTiecMungGai \? "\([^)]*\)" : ""\}<\/p>[\s\S]*?<h3[^>]*>\{customData\?\.tiecName\}<\/h3>/,
      'TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</p>\n                <h3 className="text-xl @sm:text-2xl text-[#333] font-medium tracking-wide mb-6">TIỆC MỪNG LỄ THÀNH HÔN</h3>'
    );
    content = content.replace(
      /<p className="text-\[11px\] font-sans text-\[\#444\] leading-relaxed uppercase tracking-wide px-4 mb-6">\s*\{customData\?\.tiecAddress\}\s*<\/p>/,
      '<p className="text-[11px] font-sans text-[#444] leading-relaxed uppercase tracking-wide px-4 mb-6">\n                  <strong>{customData?.tiecName}</strong><br/>\n                  {customData?.tiecAddress}\n                </p>'
    );
    
    // Do the same for Gái
    content = content.replace(
      /TIỆC MỪNG \(NHÀ GÁI\)<\/p>[\s\S]*?<h3[^>]*>\{customData\?\.tiecNameGai\}<\/h3>/,
      'TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</p>\n                <h3 className="text-xl @sm:text-2xl text-[#333] font-medium tracking-wide mb-6">TIỆC MỪNG LỄ THÀNH HÔN</h3>'
    );
    content = content.replace(
      /<p className="text-\[11px\] font-sans text-\[\#444\] leading-relaxed uppercase tracking-wide px-4 mb-6">\s*\{customData\?\.tiecAddressGai\}\s*<\/p>/,
      '<p className="text-[11px] font-sans text-[#444] leading-relaxed uppercase tracking-wide px-4 mb-6">\n                  <strong>{customData?.tiecNameGai}</strong><br/>\n                  {customData?.tiecAddressGai}\n                </p>'
    );
  } else if (i === 2) {
    content = content.replace(
      /TIỆC MỪNG \{hasTiecMungGai \? "\([^)]*\)" : ""\}<\/h3>/,
      'TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>'
    );
    // In wedding 2, tiecName is already a separate <p>, let's just make sure we remove it and prepend to address
    content = content.replace(
      /<p className="text-\[10px\] text-\[\#A67C52\] uppercase tracking-widest font-bold\s*my-4">\{customData\?\.tiecName\}<\/p>\s*<p className="text-\[10px\] text-\[\#5A5552\] leading-relaxed mb-6 uppercase max-w-\[180px\] font-bold">\s*\{customData\?\.tiecAddress\}\s*<\/p>/,
      '<p className="text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[180px] font-bold">\n                  <span className="text-[#A67C52] block mb-1">{customData?.tiecName}</span>\n                  {customData?.tiecAddress}\n                </p>'
    );
    
    // For Gái
    content = content.replace(
      /TIỆC MỪNG \(NHÀ GÁI\)<\/h3>/,
      'TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>'
    );
    content = content.replace(
      /<p className="text-\[10px\] text-\[\#A67C52\] uppercase tracking-widest font-bold\s*my-4">\{customData\?\.tiecNameGai\}<\/p>\s*<p className="text-\[10px\] text-\[\#5A5552\] leading-relaxed mb-6 uppercase max-w-\[180px\] font-bold">\s*\{customData\?\.tiecAddressGai\}\s*<\/p>/,
      '<p className="text-[10px] text-[#5A5552] leading-relaxed mb-6 uppercase max-w-[180px] font-bold">\n                  <span className="text-[#A67C52] block mb-1">{customData?.tiecNameGai}</span>\n                  {customData?.tiecAddressGai}\n                </p>'
    );
  } else {
    // Other templates were injected via the patch script
    content = content.replace(
      /TIỆC MỪNG \{hasTiecMungGai \? "\([^)]*\)" : ""\}<\/p>/,
      'TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</p>'
    );
    content = content.replace(
      /TIỆC MỪNG \(NHÀ GÁI\)<\/p>/,
      'TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</p>'
    );
    
    content = content.replace(
      /<p className="([^"]*?)">\s*\{customData\?\.tiecName\}\s*<\/p>\s*<p className="([^"]*?)">\s*\{customData\?\.tiecAddress\}\s*<\/p>/,
      '<p className="$2">\n                <strong>{customData?.tiecName}</strong><br/>\n                {customData?.tiecAddress}\n              </p>'
    );
    content = content.replace(
      /<p className="([^"]*?)">\s*\{customData\?\.tiecNameGai\}\s*<\/p>\s*<p className="([^"]*?)">\s*\{customData\?\.tiecAddressGai\}\s*<\/p>/,
      '<p className="$2">\n                <strong>{customData?.tiecNameGai}</strong><br/>\n                {customData?.tiecAddressGai}\n              </p>'
    );
    
    // Fix wedding-6 specifically which might use h3 instead of p for the title
    if (i === 6) {
      content = content.replace(
        /TIỆC MỪNG \{hasTiecMungGai \? "\([^)]*\)" : ""\}<\/h3>/,
        'TIỆC MỪNG LỄ THÀNH HÔN {hasTiecMungGai ? "(NHÀ TRAI)" : ""}</h3>'
      );
      content = content.replace(
        /TIỆC MỪNG \(NHÀ GÁI\)<\/h3>/,
        'TIỆC MỪNG LỄ THÀNH HÔN (NHÀ GÁI)</h3>'
      );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
}
console.log("Done patching tiec_mung names!");
