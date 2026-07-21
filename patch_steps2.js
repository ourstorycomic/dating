const fs = require('fs');

const filesToPatch = [
  { path: 'components/templates/sorry-1/index.tsx', total: 6 },
  { path: 'components/templates/sorry-2/index.tsx', total: 5 },
  { path: 'components/templates/sorry-3/index.tsx', total: 6 },
  { path: 'components/templates/valentine-2/Valentine2WatchParty.tsx', total: 8 },
  { path: 'components/templates/valentine-3/Valentine3Diary.tsx', total: 6 },
];

for (const {path: file, total} of filesToPatch) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('onStepChange?.(')) continue;

  if (!c.includes('onStepChange')) {
    c = c.replace(/export (?:default )?function (\w+)\(\{\s*([^}]*?)\s*\}\s*(?::\s*any)?\)\s*\{/, (match, name, props) => {
      return match.replace(props, props + ', onStepChange');
    });
  }

  const importMatch = c.match(/import\s+.*?\s+from\s+['"]react['"];/);
  if (!c.includes('useEffect') && importMatch) {
    c = c.replace(importMatch[0], importMatch[0].replace('useState', 'useState, useEffect'));
  }

  const useEffectStr = `\n  useEffect(() => {\n    onStepChange?.(step - 1, ${total});\n  }, [step, onStepChange]);\n`;
  c = c.replace(/(const \[step, setStep\] = useState.*?\n)/, '$1' + useEffectStr);
  
  fs.writeFileSync(file, c);
  console.log('Patched', file);
}
