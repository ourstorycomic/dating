const fs = require('fs');
['wedding-2', 'wedding-3', 'wedding-4', 'wedding-5', 'wedding-6'].forEach(t => {
  let file = 'components/templates/'+t+'/Experience.tsx';
  let c = fs.readFileSync(file, 'utf8');
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
  if (!c.includes('const hasTiecMung =')) {
    c = c.replace(/(const containerRef = useRef[\s\S]*?;\r?\n)/, '$1' + p);
    fs.writeFileSync(file, c);
    console.log('Fixed parsing in ' + t);
  }
});
