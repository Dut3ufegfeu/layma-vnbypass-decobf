const fs = require('fs');
const parser = require('@babel/parser');

const src = fs.readFileSync(process.argv[2], 'utf8');
const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

console.log('Top-level statement kinds:');
ast.program.body.forEach((st, i) => {
  let desc = st.type;
  if (st.type === 'FunctionDeclaration') desc += ' ' + st.id.name + ' params=' + st.params.length + ' bodyLen=' + (st.end - st.start);
  else if (st.type === 'VariableDeclaration') {
    const d = st.declarations[0];
    desc += ' ' + (d.id.name || d.id.type);
    if (d.init) desc += ' init=' + d.init.type + (d.init.type === 'CallExpression' ? '(' + d.init.callee.type + ')' : '');
  } else if (st.type === 'ExpressionStatement') {
    desc += ' expr=' + st.expression.type;
    if (st.expression.type === 'CallExpression') desc += ' callee=' + st.expression.callee.type;
  }
  const text = src.slice(st.start, Math.min(st.end, st.start + 120)).replace(/\s+/g, ' ');
  console.log(String(i).padStart(3), desc.padEnd(60), '|', text);
});
