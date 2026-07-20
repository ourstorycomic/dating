const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'components', 'templates', 'wedding-1', 'Experience.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Fix isWedding
content = content.replace('const isWedding = day.toString() === dDay && parsedDDate.getMonth() + 1 === dMonthNumber;', 
  'const isWedding = day === parsedDDate.getDate() && parsedDDate.getMonth() + 1 === dMonthNumber;');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed wedding-1 calendar');
