const fs = require('fs');

function fixComposition(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add generalAudioUrl
  content = content.replace(/voiceUrl([ \t]*})/g, 'voiceUrl, generalAudioUrl$1');
  
  // 2. Add Audio tag
  if (!content.includes('generalAudioUrl && <Audio')) {
    content = content.replace(
      '<Video src={staticFile',
      '{generalAudioUrl && <Audio src={generalAudioUrl} volume={0.6} />}\n      <Video src={staticFile'
    );
  }

  // 3. Replace object-cover with object-position
  // First, we replace all `object-cover"` with `object-cover" style={{ objectPosition: "center 25%" }}`
  content = content.replace(/object-cover"/g, 'object-cover" style={{ objectPosition: "center 25%" }}');

  // 4. Merge duplicate styles: `style={{ objectPosition: "center 25%" }} style={{ ... }}`
  // into `style={{ objectPosition: "center 25%", ... }}`
  content = content.replace(
    /style=\{\{ objectPosition: "center 25%" \}\}\s*style=\{\{\s*(.*?)\s*\}\}/g,
    'style={{ objectPosition: "center 25%", $1 }}'
  );

  fs.writeFileSync(filePath, content, 'utf8');
}

fixComposition('d:/dating/components/templates/videowedding-1/Composition.tsx');
fixComposition('d:/dating/components/templates/videowedding-2/Composition.tsx');
console.log('Fixed!');
