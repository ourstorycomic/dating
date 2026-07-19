const fs = require('fs');

['wedding-3', 'wedding-4', 'wedding-6'].forEach(t => {
  let file = 'components/templates/'+t+'/Experience.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  if (!c.includes('customData?: any')) {
    c = c.replace(/brideQR\?:\s*string;/, 'brideQR?: string;\n  customData?: any;');
    c = c.replace(/brideQR,([\s\S]*?)}:/, 'brideQR,\n  customData,$1}:');
  }
  
  if (!c.includes('hasTiecMung')) {
    const p = `
  const hasTiecMung = !!customData?.tiecName;
  const hasTiecMungGai = !!customData?.tiecNameGai;

  const parseTiec = (dateString?: string) => {
    if (!dateString) return { date: '', time: '' };
    const dt = new Date(dateString);
    if (isNaN(dt.getTime())) return { date: '', time: '' };
    return {
      date: dt.toLocaleDateString('vi-VN'),
      time: dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const tiecTrai = parseTiec(customData?.tiecDate);
  const tiecGai = parseTiec(customData?.tiecDateGai);
`;
    c = c.replace(/(const containerRef = useRef.*?;\n)/, '$1' + p);
  }
  
  fs.writeFileSync(file, c);
  console.log('Fixed parsing in ' + t);
});
