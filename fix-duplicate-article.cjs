const fs = require('fs');
const path = require('path');

const blogDir = path.join(__dirname, 'blog');

const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.html'));

let count = 0;

for (const file of files) {
  const filePath = path.join(blogDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Pattern: the first Article schema at the start of head
  // Remove from <head><script type="application/ld+json">{Article...}</script><meta charset="UTF-8">
  const original = content;
  
  // Remove the first Article schema (minified, at start of head)
  content = content.replace(
    /(<html\s+lang="es"><head>)<script type="application\/ld\+json">\{"@context":"https:\/\/schema\.org","@type":"Article".*?<\/script>/s,
    '$1'
  );

  // Fix RealEstateAgent → Organization in second Article schema
  content = content.replace(
    /"@type": "RealEstateAgent"/g,
    '"@type": "Organization"'
  );

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log(`✓ ${file}`);
  }
}

console.log(`\n✅ ${count} archivos actualizados`);
