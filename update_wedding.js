const fs = require('fs');
const path = require('path');

const dirs = [1, 2, 3, 4, 5, 6].map(i => path.join('d:/dating/components/templates/wedding-' + i, 'Experience.tsx'));

dirs.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  const insertIndex = content.indexOf('}) {');
  if (insertIndex !== -1) {
    const splitIndex = insertIndex + 4;
    const before = content.slice(0, splitIndex);
    const after = content.slice(splitIndex);
    
    if (!after.includes('const parsedDDate')) {
      const insertion = `
  const parsedDDate = new Date(weddingDate || '2025-02-15T09:00:00.000Z');
  const dDay = parsedDDate.getDate().toString().padStart(2, '0');
  const dMonth = 'Tháng ' + (parsedDDate.getMonth() + 1);
  const dYear = parsedDDate.getFullYear().toString();
  const dDayOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][parsedDDate.getDay()];
  const dHours = parsedDDate.getHours().toString().padStart(2, '0');
  const dMinutes = parsedDDate.getMinutes().toString().padStart(2, '0');
  const dTime = \`\${dHours}:\${dMinutes}\`;
`;
      
      let newAfter = insertion + after;
      
      newAfter = newAfter.replace(/\bweddingDay\b/g, 'dDay');
      newAfter = newAfter.replace(/\bweddingMonth\b/g, 'dMonth');
      newAfter = newAfter.replace(/\bweddingYear\b/g, 'dYear');
      newAfter = newAfter.replace(/\bweddingDayOfWeek\b/g, 'dDayOfWeek');
      
      // Attempt to replace 09:00 hardcodes
      newAfter = newAfter.replace(/>09:00</g, '>{dTime}<');
      newAfter = newAfter.replace(/09:00, /g, '{dTime}, ');
      newAfter = newAfter.replace(/09:00\n/g, '{dTime}\n');
      newAfter = newAfter.replace(/09:00 /g, '{dTime} ');
      
      fs.writeFileSync(file, before + newAfter);
      console.log('Updated ' + file);
    } else {
      console.log('Already updated ' + file);
    }
  }
});
