const fs = require('fs');
let c = fs.readFileSync('components/dashboard/OrderBuilderForm.tsx', 'utf8');
c = c.replace(/join\("\\\\n"\)/g, 'join("\\n")');
c = c.replace(/const separator = "\\\\n";/g, 'const separator = "\\n";');
fs.writeFileSync('components/dashboard/OrderBuilderForm.tsx', c);
console.log('Fixed newlines');
