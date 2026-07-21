const fs = require('fs');

const updateFile = (path) => {
    let content = fs.readFileSync(path, 'utf8');
    
    // Replace {groomFamily || "..."}
    content = content.replace(/\{groomFamily \|\| \"(.*?)\"\}/g, '{(groomFamily || "$1").replace(/ & /g, \'\\n\')}');
    content = content.replace(/\{brideFamily \|\| \"(.*?)\"\}/g, '{(brideFamily || "$1").replace(/ & /g, \'\\n\')}');
    
    // Replace {groomFamily} exactly, but don't match {(groomFamily || "...")}
    // Using negative lookbehind is best, but to be simple, we just do a string replace of the exact string:
    content = content.replace(/>\{groomFamily\}</g, '>{groomFamily?.replace(/ & /g, \'\\n\')}<');
    content = content.replace(/>\{brideFamily\}</g, '>{brideFamily?.replace(/ & /g, \'\\n\')}<');
    
    // If there's any style={{...}}>{groomFamily}</p>
    content = content.replace(/>\{groomFamily\}/g, '>{groomFamily?.replace(/ & /g, \'\\n\')}');
    content = content.replace(/>\{brideFamily\}/g, '>{brideFamily?.replace(/ & /g, \'\\n\')}');

    fs.writeFileSync(path, content, 'utf8');
};

const paths = [
    'components/templates/wedding-1/Experience.tsx',
    'components/templates/wedding-2/Experience.tsx',
    'components/templates/wedding-3/Experience.tsx',
    'components/templates/wedding-4/Experience.tsx',
    'components/templates/wedding-5/Experience.tsx',
    'components/templates/wedding-6/Experience.tsx',
];

for (let p of paths) {
    if (fs.existsSync(p)) {
        updateFile(p);
        console.log('Updated ' + p);
    }
}
