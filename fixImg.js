const fs = require('fs');

function fixImgTags(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace <Img ... style={{ ... }} ... />
  // We can just add objectPosition: "center 25%" to existing style={{ or create a new style.
  
  // Strategy:
  // Find all <Img ... /> tags
  content = content.replace(/<Img([^>]+)\/?>/g, (match, inner) => {
    // If it already has style={{, inject it inside
    if (inner.includes('style={{')) {
      return match.replace('style={{', 'style={{ objectPosition: "center 25%",');
    } else {
      // If it doesn't have style, append style={{ objectPosition: "center 25%" }}
      return `<Img${inner} style={{ objectPosition: "center 25%" }} />`;
    }
  });

  fs.writeFileSync(filePath, content, 'utf8');
}

fixImgTags('d:/dating/components/templates/videowedding-1/Composition.tsx');
fixImgTags('d:/dating/components/templates/videowedding-2/Composition.tsx');
console.log('Img tags fixed!');
