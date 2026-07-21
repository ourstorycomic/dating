const fs = require('fs');
const dirs = ['wedding-1', 'wedding-2', 'wedding-3', 'wedding-4', 'wedding-5', 'wedding-6'];

dirs.forEach(dir => {
  const p = `components/templates/${dir}/Experience.tsx`;
  if (!fs.existsSync(p)) return;
  let c = fs.readFileSync(p, 'utf8');

  // Find where groomFamily is rendered and add .replace(/\\\\n/g, '\\n')
  c = c.replace(/\{(groomFamily \s*\|\|[^}]*?)\}/g, "{$1.replace(/\\\\n/g, '\\n')}");
  c = c.replace(/\{(brideFamily \s*\|\|[^}]*?)\}/g, "{$1.replace(/\\\\n/g, '\\n')}");
  
  // also catch cases where it's just {groomFamily}
  // This is tricky, we can just replace the raw usages if they don't have replace yet
  // Or we can just look for `(groomFamily || "..." ).replace(...)`
  // Actually, we can just replace `{groomFamily}` with `{groomFamily?.replace(/\\\\n/g, '\\n')}` if not already
  
  c = c.replace(/\{groomFamily\}/g, "{groomFamily?.replace(/\\\\n/g, '\\n')}");
  c = c.replace(/\{brideFamily\}/g, "{brideFamily?.replace(/\\\\n/g, '\\n')}");
  
  // but if it was already something like `{(groomFamily || "...").replace(/ & /g, '\n')}`
  // we want to chain `.replace(/\\\\n/g, '\\n')` to it.
  c = c.replace(/replace\(\/ \& \/g,\s*'\\n'\)/g, "replace(/ & /g, '\\n').replace(/\\\\n/g, '\\n')");

  fs.writeFileSync(p, c);
  console.log('Fixed', p);
});
