const fs = require('fs');

const filesToFix = [
  {
    path: 'components/templates/wedding-2/Experience.tsx',
    stateAnchor: 'const [showQR, setShowQR] = useState(false);',
    onCompleteRegex: /onComplete\?\.\(\{\}\)/g,
    nameInputRegex: /<input type="text" placeholder="Nhập Tên Bạn\.\.\." className="(.*?)" \/>/,
    phoneInputRegex: /<input type="text" placeholder="Số Điện Thoại\.\.\." className="(.*?)" \/>/,
    selectRegex: /<select className="(.*?)"(?: appearance-none)?>\s*<option>Xác Nhận Tham Dự\.\.\.<\/option>\s*<option>Có<\/option>\s*<option>Không<\/option>\s*<\/select>/
  },
  {
    path: 'components/templates/wedding-3/Experience.tsx',
    stateAnchor: 'const [showQR, setShowQR] = useState(false);',
    onCompleteRegex: /onComplete\?\.\(\{\}\)/g,
    nameInputRegex: /<input type="text" placeholder="Nhập Tên Bạn\.\.\." className="(.*?)" \/>/,
    phoneInputRegex: /<input type="text" placeholder="Số Điện Thoại\.\.\." className="(.*?)" \/>/,
    selectRegex: /<select className="(.*?)"(?: appearance-none)?>\s*<option>Xác Nhận Tham Dự\.\.\.<\/option>\s*<option>Có<\/option>\s*<option>Không<\/option>\s*<\/select>/
  },
  {
    path: 'components/templates/wedding-4/Experience.tsx',
    stateAnchor: 'const [showQR, setShowQR] = useState(false);',
    onCompleteRegex: /onComplete\?\.\(\{\}\)/g,
    nameInputRegex: /<input type="text" placeholder="Tên của bạn\.\.\." className="(.*?)" \/>/,
    phoneInputRegex: /<input type="text" placeholder="Số điện thoại\.\.\." className="(.*?)" \/>/
  },
  {
    path: 'components/templates/wedding-5/Experience.tsx',
    stateAnchor: 'const [showQR, setShowQR] = useState(false);',
    onCompleteRegex: /onComplete\?\.\(\{\}\)/g,
    nameInputRegex: /<input type="text" placeholder="Tên của bạn \*" className="(.*?)" \/>/,
    phoneInputRegex: /<input type="text" placeholder="Số điện thoại \*" className="(.*?)" \/>/
  },
  {
    path: 'components/templates/wedding-6/Experience.tsx',
    stateAnchor: 'const [showQR, setShowQR] = useState(false);',
    onCompleteRegex: /onComplete\?\.\(\{\}\)/g,
    nameInputRegex: /<input type="text" placeholder="Tên của bạn" className="(.*?)" \/>/,
    phoneInputRegex: /<input type="text" placeholder="Số điện thoại" className="(.*?)" \/>/
  }
];

filesToFix.forEach(config => {
  if (!fs.existsSync(config.path)) return;
  let content = fs.readFileSync(config.path, 'utf8');

  // Add states if missing
  if (!content.includes('const [rsvpName, setRsvpName] = useState("");')) {
    content = content.replace(
      config.stateAnchor,
      `${config.stateAnchor}\n  const [rsvpName, setRsvpName] = useState("");\n  const [rsvpPhone, setRsvpPhone] = useState("");`
    );
  }
  
  if (config.path.includes('wedding-2') || config.path.includes('wedding-3')) {
    if (!content.includes('const [rsvpCount, setRsvpCount]')) {
      content = content.replace(
        'const [rsvpPhone, setRsvpPhone] = useState("");',
        `const [rsvpPhone, setRsvpPhone] = useState("");\n  const [rsvpCount, setRsvpCount] = useState("Có");\n  const [customCount, setCustomCount] = useState("");`
      );
    }
  }

  // Update inputs
  if (config.nameInputRegex) {
    content = content.replace(config.nameInputRegex, (match, p1) => {
      // keep original placeholder if possible
      const placeholderMatch = match.match(/placeholder="(.*?)"/);
      const placeholder = placeholderMatch ? placeholderMatch[1] : "Tên của bạn";
      return `<input type="text" value={rsvpName} onChange={e => setRsvpName(e.target.value)} placeholder="${placeholder}" className="${p1}" />`;
    });
  }
  if (config.phoneInputRegex) {
    content = content.replace(config.phoneInputRegex, (match, p1) => {
      const placeholderMatch = match.match(/placeholder="(.*?)"/);
      const placeholder = placeholderMatch ? placeholderMatch[1] : "Số điện thoại";
      return `<input type="text" value={rsvpPhone} onChange={e => setRsvpPhone(e.target.value)} placeholder="${placeholder}" className="${p1}" />`;
    });
  }

  // For wedding-2 and wedding-3, replace select
  if (config.selectRegex && (config.path.includes('wedding-2') || config.path.includes('wedding-3'))) {
    content = content.replace(config.selectRegex, (match, p1) => {
      return `<select value={rsvpCount} onChange={e => setRsvpCount(e.target.value)} className="${p1} appearance-none">
                <option value="Có">Có tham dự</option>
                <option value="Không">Không tham dự</option>
                <option value="Khác">Có, dắt theo người thân</option>
              </select>
              {rsvpCount === "Khác" && (
                <input type="number" min="1" value={customCount} onChange={e => setCustomCount(e.target.value)} placeholder="Nhập tổng số người..." className="${p1.replace('mb-4', '').trim()} mt-2" required />
              )}`;
    });
  }

  // Update onComplete
  content = content.replace(config.onCompleteRegex, `onComplete?.({ name: rsvpName, phone: rsvpPhone, count: rsvpCount === "Khác" ? customCount : rsvpCount })`);

  fs.writeFileSync(config.path, content, 'utf8');
});
console.log('Fixed RSVP fields!');
