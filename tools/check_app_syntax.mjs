import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1]);

if (!scripts.length) throw new Error('No inline script found in index.html');
for (const [index, source] of scripts.entries()) {
  try {
    new Function(source);
  } catch (error) {
    console.error(`Inline script ${index + 1} has invalid syntax.`);
    throw error;
  }
}

console.log(`Validated ${scripts.length} inline script block(s) in index.html.`);
