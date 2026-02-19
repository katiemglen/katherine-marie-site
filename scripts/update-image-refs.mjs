// Script to update all image references in components and app files to use r2Image()
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

// Files that have /images/ references (excluding parseContent which is already done)
const files = execSync(
  `grep -rln '"/images/' components/ app/ --include="*.tsx" --include="*.ts"`,
  { cwd: '/home/katie/.openclaw/workspace/katherine-marie-site' }
).toString().trim().split('\n').filter(Boolean);

console.log(`Files to update: ${files.length}`);

for (const file of files) {
  const fullPath = `/home/katie/.openclaw/workspace/katherine-marie-site/${file}`;
  let content = readFileSync(fullPath, 'utf8');
  const original = content;

  // Check if it's a 'use client' file or server component
  const isClient = content.includes("'use client'");
  
  // Add r2Image import if not already present
  if (!content.includes("r2Image")) {
    // Determine relative path to lib/r2
    const depth = file.split('/').length - 1;
    const prefix = depth === 1 ? '../' : depth === 2 ? '../../' : '../';
    const importPath = file.startsWith('app/') 
      ? (file.split('/').length > 2 ? '../../lib/r2' : '../lib/r2')
      : (file.startsWith('components/gallery/') ? '../../lib/r2' : '../lib/r2');
    
    // Add import after existing imports
    const importStatement = `import { r2Image } from '${importPath}';\n`;
    
    // Find last import line
    const lines = content.split('\n');
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ') || lines[i].match(/^} from /)) {
        lastImportIdx = i;
      }
    }
    if (lastImportIdx >= 0) {
      lines.splice(lastImportIdx + 1, 0, importStatement.trimEnd());
      content = lines.join('\n');
    }
  }

  // Replace string literals: "/images/..." -> r2Image("/images/...")
  // Handle: src="/images/..." and generic string "/images/..."
  // Pattern 1: JSX attribute src="/images/..."
  content = content.replace(/src="(\/images\/[^"]+)"/g, 'src={r2Image("$1")}');
  // Pattern 2: JS string in objects/arrays: "/images/..."  (but not already wrapped)
  content = content.replace(/(:\s*)"(\/images\/[^"]+)"/g, '$1r2Image("$2")');
  // Pattern 3: src='/images/...'
  content = content.replace(/src='(\/images\/[^']+)'/g, "src={r2Image('$1')}");
  // Pattern 4: template literal url(/images/...)
  content = content.replace(/url\((\/images\/[^)]+)\)/g, 'url(${r2Image("$1")})');
  // Fix: backgroundImage with url() needs template literal
  content = content.replace(/'url\(\$\{r2Image\("(\/images\/[^"]+)"\)\}\)'/g, '`url(${r2Image("$1")})`');

  if (content !== original) {
    writeFileSync(fullPath, content);
    console.log(`  Updated: ${file}`);
  } else {
    console.log(`  No changes: ${file}`);
  }
}

console.log('Done!');
