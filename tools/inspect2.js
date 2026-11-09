const fs = require('fs');
const s = fs.readFileSync('../dl/layma/out2/layma.beautified.js', 'utf8');
const lines = s.split('\n');
console.log('total lines', lines.length);
const re = /"((?:[^"\\]|\\.){200,})"/g;
let m, i = 0;
while ((m = re.exec(s)) && i < 8) {
  console.log('BIGSTR len', m[1].length, 'at', m.index, JSON.stringify(m[1].slice(0, 80)));
  i++;
}
lines.forEach((l, idx) => {
  if (/while\s*\(/.test(l)) console.log('while @line', idx + 1, l.trim().slice(0, 60));
});
