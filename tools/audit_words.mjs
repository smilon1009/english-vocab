import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const jsDir = path.join(root, 'js');
const files = fs.readdirSync(jsDir)
  .filter((name) => /^words(?:_ielts\d+)?\.js$/.test(name))
  .sort((a, b) => a === 'words.js' ? -1 : b === 'words.js' ? 1 : a.localeCompare(b));

const source = files
  .map((name) => fs.readFileSync(path.join(jsDir, name), 'utf8'))
  .join('\n') + '\n;globalThis.__AUDIT_WORDS__ = WORDS;';
const context = {};
vm.createContext(context);
vm.runInContext(source, context);

const words = context.__AUDIT_WORDS__;
const errors = [];
const warnings = [];
const seen = new Map();
const required = ['word', 'ipa', 'pos', 'zh', 'def', 'example'];

for (const [index, entry] of words.entries()) {
  const label = `${index + 1}:${entry.word || '<missing word>'}`;
  for (const key of required) {
    if (typeof entry[key] !== 'string' || entry[key].trim() === '') {
      errors.push(`${label} missing ${key}`);
    }
  }

  const key = String(entry.word || '').toLowerCase();
  if (seen.has(key)) errors.push(`${label} duplicates entry ${seen.get(key)}`);
  else seen.set(key, index + 1);

  const blanks = String(entry.example || '').match(/___/g) || [];
  if (blanks.length !== 1) errors.push(`${label} example must contain exactly one ___ placeholder`);
  if (entry.answer !== undefined && (typeof entry.answer !== 'string' || !entry.answer.trim())) {
    errors.push(`${label} answer must be a non-empty string`);
  }

  if (/___(?:s|d|ed|t)\b/.test(String(entry.example || '')) && !entry.answer) {
    warnings.push(`${label} uses a suffix outside the blank; manually verify the resulting word form`);
  }
}

console.log(`Audited ${words.length} entries from ${files.length} files.`);
console.log(`Errors: ${errors.length}; morphology warnings: ${warnings.length}.`);
for (const error of errors) console.error(`ERROR ${error}`);
for (const warning of warnings.slice(0, 20)) console.warn(`WARN  ${warning}`);
if (warnings.length > 20) console.warn(`WARN  ... ${warnings.length - 20} more morphology warnings`);
if (errors.length) process.exitCode = 1;
