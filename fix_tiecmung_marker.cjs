const fs = require('fs');

const fixTiecMung = (file, color, borderColor) => {
  let c = fs.readFileSync(file, 'utf8');
  
  // Replace the tiny dot with a surrounding dashed circle
  const regex = /\{isTiec && isWedding && \([\s\S]*?<div className=\"absolute -bottom-1[\s\S]*?<\/div>\r?\n\s+\)\}/;
  const regexMotion = /\{isTiec && isWedding && \([\s\S]*?<motion\.div[\s\S]*?className=\"absolute -bottom-1[\s\S]*?\/>\r?\n\s+\)\}/;
  
  const replacement = `{isTiec && isWedding && (
                      <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.6, type: "spring" }} className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] rounded-full border-[1.5px] border-dashed ${borderColor} z-0 opacity-70"></motion.div>
                    )}`;
  
  if (c.match(regex)) {
    c = c.replace(regex, replacement);
  } else if (c.match(regexMotion)) {
    c = c.replace(regexMotion, replacement);
  }
  
  fs.writeFileSync(file, c, 'utf8');
  console.log('Fixed', file);
};

fixTiecMung('components/templates/wedding-1/Experience.tsx', '#8c7b6b', 'border-[#8c7b6b]');
fixTiecMung('components/templates/wedding-2/Experience.tsx', '#7A1F1F', 'border-[#7A1F1F]');
fixTiecMung('components/templates/wedding-3/Experience.tsx', '#7A1F1F', 'border-[#7A1F1F]');
fixTiecMung('components/templates/wedding-4/Experience.tsx', '#7A1F1F', 'border-[#7A1F1F]');
