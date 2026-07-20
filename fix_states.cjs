const fs = require('fs');

['wedding-4', 'wedding-5', 'wedding-6'].forEach(w => {
  const f = 'components/templates/' + w + '/Experience.tsx';
  let c = fs.readFileSync(f, 'utf8');
  
  if (!c.includes('const [rsvpCount')) {
    c = c.replace(/const \[showQR, setShowQR\] = useState\(false\);/, 'const [showQR, setShowQR] = useState(false);\n  const [rsvpCount, setRsvpCount] = useState("Có");\n  const [customCount, setCustomCount] = useState("");');
    fs.writeFileSync(f, c);
    console.log('Added states to ' + w);
  }
});
