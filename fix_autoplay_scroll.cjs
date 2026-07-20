const fs = require('fs');

['wedding-2', 'wedding-3', 'wedding-6'].forEach(w => {
  const f = 'components/templates/' + w + '/Experience.tsx';
  let c = fs.readFileSync(f, 'utf8');
  
  // For wedding-2 and wedding-3
  c = c.replace(/if \(autoPlay\) \{\r?\n\s+const openTimer = setTimeout\(\(\) => \{\r?\n\s+setIsOpened\(true\);\r?\n\s+\}, 500\);/g, 
    'if (autoPlay) {\n      const openTimer = setTimeout(() => {\n        setIsOpened(true);\n        setTimeout(() => setAllowScroll(true), 1500);\n      }, 500);');

  // For wedding-6
  c = c.replace(/const openTimer = setTimeout\(\(\) => \{\r?\n\s+setIsOpened\(true\);\r?\n\s+\/\/ Cố gắng bật nhạc tự động/g, 
    'const openTimer = setTimeout(() => {\n      setIsOpened(true);\n      setTimeout(() => setAllowScroll(true), 1500);\n      // Cố gắng bật nhạc tự động');

  fs.writeFileSync(f, c);
  console.log('Fixed ' + w);
});
