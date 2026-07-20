const fs = require('fs');
let c = fs.readFileSync('components/templates/wedding-4/Experience.tsx', 'utf8');
c = c.replace('setEnvelopeState("opened");\r\n      setIsOpened(true);', 'setEnvelopeState("opened");\r\n      setIsOpened(true);\r\n      setAllowScroll(true);');
c = c.replace('setEnvelopeState("opened");\n      setIsOpened(true);', 'setEnvelopeState("opened");\n      setIsOpened(true);\n      setAllowScroll(true);');
fs.writeFileSync('components/templates/wedding-4/Experience.tsx', c);
