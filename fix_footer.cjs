const fs = require('fs');
const path = require('path');

const baseDir = 'components/templates';
const weddingFolders = fs.readdirSync(baseDir).filter(f => f.startsWith('wedding-') && fs.statSync(path.join(baseDir, f)).isDirectory());

for (const folder of weddingFolders) {
  const expPath = path.join(baseDir, folder, 'Experience.tsx');
  if (!fs.existsSync(expPath)) continue;

  let c = fs.readFileSync(expPath, 'utf8');

  // 1. Remove ALL existing <WeddingFooter />
  c = c.replace(/[ \t]*<WeddingFooter \/>\r?\n?/g, '');
  
  // 2. We want to insert it right before the final `    </div>\n  );\n}`
  // Let's find the LAST occurrence of `</div>` before the final return closing.
  // The structure of the file ends with:
  //    </div>
  //  );
  //}
  
  const lastReturn = c.lastIndexOf('  );\n}');
  if (lastReturn !== -1) {
    const lastDiv = c.lastIndexOf('</div>', lastReturn);
    if (lastDiv !== -1) {
      c = c.substring(0, lastDiv) + '<WeddingFooter />\n      ' + c.substring(lastDiv);
    }
  }

  fs.writeFileSync(expPath, c, 'utf8');
  console.log(`Fixed ${folder}`);
}
