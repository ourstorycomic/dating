const fs = require('fs');
const path = require('path');

for (let i = 1; i <= 6; i++) {
  let expPath = path.join(__dirname, `components/templates/wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(expPath)) continue;
  let expContent = fs.readFileSync(expPath, 'utf8');
  
  // Fix gap
  expContent = expContent.replace(/className="flex gap-4 @sm:gap-8/g, 'className="flex gap-2 sm:gap-6');
  expContent = expContent.replace(/className="flex gap-4 sm:gap-8/g, 'className="flex gap-2 sm:gap-6');
  
  // Also wedding-2 might use different classes, e.g. flex justify-center gap-4
  // Let's replace any gap-4 followed by sm:gap-X with gap-2 sm:gap-6 in countdown context
  
  // Fix text sizes for the numbers
  expContent = expContent.replace(/className="text-3xl @sm:text-4xl/g, 'className="text-2xl sm:text-4xl');
  expContent = expContent.replace(/className="text-3xl sm:text-4xl/g, 'className="text-2xl sm:text-4xl');
  
  // Fix text sizes for the separators ":"
  expContent = expContent.replace(/className="text-2xl font-light opacity-30"/g, 'className="text-xl sm:text-2xl font-light opacity-30 pt-1"');
  
  // Another pattern from templates:
  // <span className="text-4xl font-serif text-[#A67C52]">{days}</span>
  // We can make them responsive:
  expContent = expContent.replace(/<span className="text-4xl font-serif([^"]*)">\{(days|hours|minutes|seconds)\}<\/span>/g, '<span className="text-2xl sm:text-4xl font-serif$1">{$2}</span>');
  
  // And the gap for other templates
  expContent = expContent.replace(/className="flex gap-4 justify-center/g, 'className="flex gap-2 sm:gap-4 justify-center');
  expContent = expContent.replace(/className="flex gap-6 justify-center/g, 'className="flex gap-3 sm:gap-6 justify-center');

  fs.writeFileSync(expPath, expContent, 'utf8');
}
console.log("Done fixing countdown responsive margins!");
