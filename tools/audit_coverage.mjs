import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const jsDir = path.join(root, 'js');
const referenceDir = path.join(root, 'data', 'reference');

const wordFiles = fs.readdirSync(jsDir)
  .filter((name) => /^words(?:_ielts\d+)?\.js$/.test(name))
  .sort((a, b) => a === 'words.js' ? -1 : b === 'words.js' ? 1 : a.localeCompare(b));
const source = wordFiles
  .map((name) => fs.readFileSync(path.join(jsDir, name), 'utf8'))
  .join('\n') + '\n;globalThis.__WORDS__ = WORDS;';
const context = {};
vm.createContext(context);
vm.runInContext(source, context);

const activeWords = new Set(context.__WORDS__.map((entry) => String(entry.word).toLowerCase()));
const ngsl = JSON.parse(fs.readFileSync(path.join(referenceDir, 'ngsl.json'), 'utf8'));
const nawl = JSON.parse(fs.readFileSync(path.join(referenceDir, 'nawl.json'), 'utf8'));

function analyseFamilies(groups) {
  const rows = [];
  for (const [band, families] of groups) {
    for (const [headword, members] of Object.entries(families)) {
      const family = [headword, ...members].map((word) => word.toLowerCase());
      const exact = activeWords.has(headword.toLowerCase());
      const familyMatch = family.some((word) => activeWords.has(word));
      rows.push({ band, headword, exact, familyMatch });
    }
  }
  return rows;
}

const ngslRows = analyseFamilies(Object.entries(ngsl));
const nawlRows = analyseFamilies([['NAWL', nawl]]);
const report = {
  activeEntries: activeWords.size,
  note: 'Coverage is diagnostic only. A headword is not added to the learning app until its meaning, part of speech, pronunciation, example, answer form and difficulty have been reviewed.',
  ngsl: summarize(ngslRows),
  nawl: summarize(nawlRows),
};

function summarize(rows) {
  const exact = rows.filter((row) => row.exact).length;
  const family = rows.filter((row) => row.familyMatch).length;
  return {
    totalHeadwords: rows.length,
    exactHeadwordsPresent: exact,
    familyRepresented: family,
    exactCoveragePercent: Number((exact * 100 / rows.length).toFixed(1)),
    familyCoveragePercent: Number((family * 100 / rows.length).toFixed(1)),
    missingHeadwords: rows.filter((row) => !row.exact).map(({ band, headword }) => ({ band, headword })),
  };
}

const reportPath = path.join(root, 'data', 'coverage_report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
console.log(`Active learning entries: ${report.activeEntries}`);
console.log(`NGSL exact headwords: ${report.ngsl.exactHeadwordsPresent}/${report.ngsl.totalHeadwords} (${report.ngsl.exactCoveragePercent}%)`);
console.log(`NGSL represented families: ${report.ngsl.familyRepresented}/${report.ngsl.totalHeadwords} (${report.ngsl.familyCoveragePercent}%)`);
console.log(`NAWL exact headwords: ${report.nawl.exactHeadwordsPresent}/${report.nawl.totalHeadwords} (${report.nawl.exactCoveragePercent}%)`);
console.log(`NAWL represented families: ${report.nawl.familyRepresented}/${report.nawl.totalHeadwords} (${report.nawl.familyCoveragePercent}%)`);
console.log(`Wrote ${path.relative(root, reportPath)}`);
