const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'components', 'templates');

// Utility to replace all groomName & brideName pairs with a vertically stacked version
function replaceNames(content, file) {
  // Regex to match {groomName} <span...>&amp;</span> {brideName}
  // OR {groomName} &amp; {brideName}
  // OR {groomName} & {brideName}
  const regex = /\{groomName\}\s*(?:<span[^>]*>)?(?:&amp;|&)(?:<\/span>)?\s*\{brideName\}/g;
  
  return content.replace(regex, (match) => {
    // Keep the original ampersand span if any
    let ampersand = '&amp;';
    const spanMatch = match.match(/<span[^>]*>.*?<\/span>/);
    if (spanMatch) {
      ampersand = spanMatch[0];
    } else {
      // Create a default span for the ampersand
      ampersand = `<span className="text-sm font-sans mx-2 opacity-80">&amp;</span>`;
    }

    return `<span className="flex flex-col items-center gap-1 sm:gap-2"><span>{groomName}</span> ${ampersand} <span>{brideName}</span></span>`;
  });
}

function processTemplates() {
  const folders = fs.readdirSync(templatesDir).filter(f => f.startsWith('wedding-'));
  folders.forEach(folder => {
    const filePath = path.join(templatesDir, folder, 'Experience.tsx');
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');

      // 1. Stack names (groomName & brideName)
      content = replaceNames(content, folder);

      // 2. Add padding to main containers to prevent long names from overflowing
      // Usually, there's a text-center div or a form container.
      // We will ensure px-4 or px-6 is present in major flex-col items-center containers
      content = content.replace(/className="([^"]*?w-full flex flex-col items-center[^"]*?)"/g, (m, p1) => {
        if (!p1.includes('px-')) {
          return `className="${p1} px-6"`;
        }
        return m;
      });

      // 3. Fix wedding-2 date alignment
      if (folder === 'wedding-2') {
        content = content.replace(/className="border-\[2px\] border-\[#A67C52\] p-6 text-center/g, 'className="border-[2px] border-[#A67C52] p-6 text-center flex flex-col items-center justify-center');
      }

      // 4. Add Footer to templates 2, 3, 4, 5, 6
      if (folder !== 'wedding-1') {
        // Find the last </motion.div> or similar before the end of the return statement
        if (!content.includes('Lovora Wedding')) {
          const footerCode = `
          {/* Footer */}
          <div className="w-full py-8 bg-[#1a1a1a] flex flex-col items-center justify-center text-center px-4 relative z-50">
            <p className="text-[#d6cfc5] text-[10px] uppercase tracking-widest font-sans font-semibold mb-2">Designed by</p>
            <a href="https://www.lovora.click/wedding" target="_blank" rel="noopener noreferrer" className="text-white text-lg font-bold tracking-wider hover:text-[#C5A880] transition-colors" style={{ fontFamily: 'var(--font-dancing)' }}>Lovora Wedding</a>
          </div>
        </main>`;
          
          content = content.replace(/<\/main>/g, footerCode);
        }
      }

      fs.writeFileSync(filePath, content, 'utf8');
    }
  });
}

processTemplates();
console.log('Templates patched!');
