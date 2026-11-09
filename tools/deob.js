/* Deobfuscator for javascript-obfuscator output (string-array + RC4/base64 decoder + wrapper chains).
 * Sandbox approach: only decoder machinery is executed (function declarations are inert;
 * only the array-rotation IIFE runs), so main logic never executes here. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');
const beautify = require('js-beautify').js;

const input = process.argv[2];
const outDir = process.argv[3] || '.';
fs.mkdirSync(outDir, { recursive: true });

const src = fs.readFileSync(input, 'utf8');
const ast = parser.parse(src, { sourceType: 'script', allowReturnOutsideFunction: true });

/* ---------- 1. inventory of all function declarations (any depth) ---------- */
const allFns = []; // { node, name, parentIsProgram }
traverse(ast, {
  FunctionDeclaration(p) {
    allFns.push({ node: p.node, name: p.node.id && p.node.id.name, top: p.parentPath.isProgram() });
  },
});

/* string-array function: top-level, no params, body contains a huge array literal */
let strArrName = null;
for (const f of allFns) {
  if (!f.top || f.node.params.length !== 0) continue;
  let hasBigArray = false;
  traverse(f.node, {
    ArrayExpression(p) {
      if (p.node.elements.length > 50) hasBigArray = true;
    },
    noScope: true,
  });
  if (hasBigArray) { strArrName = f.name; break; }
}
if (!strArrName) throw new Error('string-array function not found');
console.log('[*] string-array fn:', strArrName);

/* ---------- 2. decoder closure ----------
 * core decoders: reference strArrName directly.
 * wrappers: single return statement calling another closure member. */
const closure = new Set();
for (let changed = true; changed; ) {
  changed = false;
  for (const f of allFns) {
    if (closure.has(f.name)) continue;
    const body = f.node.body.body;
    let isCore = false, isWrap = false;
    if (f.node.body.body.some((st) => JSON.stringify(st).includes(strArrName)) === undefined) { /* noop */ }
    // core: direct textual reference to string array fn
    const txt = src.slice(f.node.start, f.node.end);
    if (txt.includes(strArrName + '(') || new RegExp(strArrName + '\\b').test(txt.replace(/function\s+_0x/, ''))) {
      // crude but only applied to fns not already matched as wrappers
    }
    // precise: does the body reference the identifier strArrName (not just its own name)?
    let refsArr = false;
    traverse(f.node, {
      Identifier(p) {
        if (p.node.name === strArrName) { refsArr = true; p.stop(); }
      },
      noScope: true,
    });
    if (refsArr) isCore = true;
    if (body.length === 1 && body[0].type === 'ReturnStatement' && body[0].argument) {
      const call = body[0].argument.type === 'CallExpression' ? body[0].argument : null;
      if (call && call.callee.type === 'Identifier' && (closure.has(call.callee.name) || call.callee.name === strArrName)) isWrap = true;
    }
    if ((isCore || isWrap) && f.name && f.name !== strArrName) { closure.add(f.name); changed = true; }
  }
}
closure.add(strArrName);
console.log('[*] decoder closure size:', closure.size);

/* ---------- 3. build sandbox ---------- */
const sandboxParts = [];

// 3a. all top-level function declarations (inert definitions)
for (const f of allFns) {
  if (f.top) sandboxParts.push(src.slice(f.node.start, f.node.end));
}

// 3b. nested decoder-closure functions (e.g. wrappers defined inside IIFEs)
const seen = new Set(sandboxParts.length ? [strArrName] : []);
for (const f of allFns) {
  if (f.top || !closure.has(f.name) || seen.has(f.name)) continue;
  seen.add(f.name);
  sandboxParts.push(src.slice(f.node.start, f.node.end));
}

// 3c. rotation IIFE(s): top-level IIFE call referencing strArrName and using push/shift
traverse(ast, {
  ExpressionStatement(p) {
    if (!p.parentPath.isProgram()) return;
    const txt = src.slice(p.node.start, p.node.end);
    if (txt.includes(strArrName) && (txt.includes("'push'") || txt.includes('"push"')) && (txt.includes("'shift'") || txt.includes('"shift"'))) {
      sandboxParts.push(txt);
      console.log('[*] rotation IIFE included, len', txt.length);
    }
  },
});

const sbxCode = sandboxParts.join('\n;\n');
const sbxCtx = vm.createContext({});
try {
  vm.runInNewContext(sbxCode, sbxCtx, { timeout: 5000 });
  console.log('[*] sandbox initialized OK');
} catch (e) {
  console.error('[!] sandbox init error (continuing):', e.message);
}

/* ---------- 4. decode every constant-arg call to closure functions ---------- */
const sandboxNames = new Set();
for (const f of allFns) if (closure.has(f.name)) sandboxNames.add(f.name);
sandboxNames.add(strArrName);

function isPureArg(n) {
  if (t.isNumericLiteral(n) || t.isStringLiteral(n)) return true;
  if (t.isUnaryExpression(n) && ['-', '+', '~'].includes(n.operator) && t.isNumericLiteral(n.argument)) return true;
  if (t.isIdentifier(n) && n.name === 'undefined') return true;
  if (t.isCallExpression(n) && t.isIdentifier(n.callee) && sandboxNames.has(n.callee.name)) return n.arguments.every(isPureArg);
  return false;
}

let ok = 0, fail = 0;
const decodedSamples = [];
traverse(ast, {
  CallExpression(p) {
    if (!p.isCallExpression()) return; // skip replaced
    const c = p.node.callee;
    if (!t.isIdentifier(c) || !sandboxNames.has(c.name)) return;
    if (!p.node.arguments.every(isPureArg)) { fail++; return; }
    const callSrc = src.slice(p.node.start, p.node.end);
    let res;
    try { res = vm.runInNewContext('(' + callSrc + ')', sbxCtx, { timeout: 1000 }); }
    catch (e) { fail++; return; }
    if (typeof res === 'string') {
      p.replaceWith(t.stringLiteral(res));
      ok++;
      if (decodedSamples.length < 400) decodedSamples.push(res);
    } else fail++;
  },
  noScope: false,
});
console.log(`[*] decoded calls: ${ok} ok, ${fail} skipped`);

/* ---------- 5. folding passes (to fixpoint) ---------- */
function foldOnce() {
  let changed = false;
  traverse(ast, {
    BinaryExpression(p) {
      const n = p.node;
      if (n.operator === '+' && t.isStringLiteral(n.left) && t.isStringLiteral(n.right)) {
        p.replaceWith(t.stringLiteral(n.left.value + n.right.value));
        changed = true; return;
      }
      if (['+', '-', '*', '/', '%'].includes(n.operator)) {
        const allNum = (x) => t.isNumericLiteral(x)
          || (t.isUnaryExpression(x) && ['-', '+'].includes(x.operator) && t.isNumericLiteral(x.argument));
        const val = (x) => t.isNumericLiteral(x) ? x.value
          : (x.operator === '-' ? -x.argument.value : x.operator === '+' ? x.argument.value : NaN);
        if (allNum(n.left) && allNum(n.right)) {
          let v;
          switch (n.operator) {
            case '+': v = val(n.left) + val(n.right); break;
            case '-': v = val(n.left) - val(n.right); break;
            case '*': v = val(n.left) * val(n.right); break;
            case '/': v = val(n.left) / val(n.right); break;
            case '%': v = val(n.left) % val(n.right); break;
          }
          if (Number.isFinite(v)) { p.replaceWith(t.numericLiteral(v)); changed = true; }
        }
      }
    },
    MemberExpression(p) {
      const n = p.node;
      if (n.computed && t.isStringLiteral(n.property) && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(n.property.value)) {
        p.node.property = t.identifier(n.property.value);
        p.node.computed = false;
        changed = true;
      }
    },
    ObjectProperty(p) {
      const k = p.node.key;
      if (t.isStringLiteral(k) && /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(k.value) && !p.node.computed) {
        p.node.key = t.identifier(k.value);
        changed = true;
      }
    },
  });
  return changed;
}
for (let i = 0; i < 10 && foldOnce(); i++);

/* ---------- 6. output ---------- */
const gen = generate(ast, { comments: true, compact: false, jsescOption: { minimal: true } });
const pretty = beautify(gen.code, {
  indent_size: 2, space_in_empty_paren: false, preserve_newlines: false, max_preserve_newlines: 1,
  brace_style: 'collapse', wrap_line_length: 120,
});
const outFile = path.join(outDir, 'deobfuscated.js');
fs.writeFileSync(outFile, pretty);
fs.writeFileSync(path.join(outDir, 'decoded_strings.txt'), decodedSamples.join('\n'));
console.log('[*] wrote', outFile, pretty.length, 'chars');
console.log('[*] wrote decoded_strings.txt,', decodedSamples.length, 'strings');
