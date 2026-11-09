/* Smoke test: selfhost userscript phải chạy được TOÀN chuỗi mà KHÔNG có mạng ngoài.
 * fetch/GM_xhr thật bị thay bằng stub "chỉ lỗi" — mọi thành công chỉ có thể đến từ bản nhúng. */
const fs = require('fs');
const vm = require('vm');

const code = fs.readFileSync('../site/repo/Auto_LaymaV2.selfhost.user.js', 'utf8');
const log = [];
const L = (k, a) => { try { log.push(k + ' :: ' + a.map(x => (typeof x === 'object' && x ? JSON.stringify(x) : String(x)).slice(0, 120)).join(' | ')); } catch (e) { log.push(k + ' :: [ser-err]'); } };

const universal = new Proxy(function () { }, {
  get(t, p) { if (p === Symbol.toPrimitive) return () => ''; if (p === 'toString') return () => ''; if (p === 'then') return undefined; return universal; },
  apply() { return universal; }, construct() { return universal; },
});
function healingProxy(target, label) {
  return new Proxy(target, {
    get(t, p, r) {
      if (typeof p === 'symbol') return Reflect.get(t, p, r);
      if (p in t) return Reflect.get(t, p, r);
      if (p in globalThis && !['fetch','console','document','navigator','location','setTimeout','setInterval','clearTimeout','clearInterval','queueMicrotask','crypto','performance','GM','GM_info'].includes(String(p))) return globalThis[p];
      L('MISSING.' + label, [String(p)]);
      return universal;
    },
    has() { return true; },
  });
}
function stubEl(tag) {
  return healingProxy({
    tagName: (tag || 'div').toUpperCase(), style: {}, dataset: {}, attributes: {}, children: [],
    classList: { add() {}, remove() {}, contains() { return false; }, toggle() {} },
    setAttribute(k, v) { this.attributes[k] = v; }, getAttribute() { return null; },
    appendChild(c) { return c; }, removeChild(c) { return c; }, remove() {},
    addEventListener(t2) { L('el.addEventListener', [this.tagName, t2]); }, removeEventListener() {},
    click() { L('el.click', [this.tagName]); },
    querySelector() { return stubEl('q'); }, querySelectorAll() { return []; },
    closest() { return null; }, insertBefore(c) { return c; }, focus() {}, blur() {}, select() {},
    getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; },
    value: '', textContent: '', innerHTML: '', innerText: '', disabled: false,
    parentNode: null, parentElement: null, scrollIntoView() {}, getRootNode() { return doc.documentElement; },
  }, 'el');
}
const doc = healingProxy({
  documentElement: null, body: null, head: null, cookie: '', title: 'layma', readyState: 'complete',
  querySelector(s) { L('document.querySelector', [s]); return stubEl('qs'); },
  querySelectorAll() { L('document.querySelectorAll', ['(all)']); return []; },
  getElementById(id) { L('document.getElementById', [id]); return stubEl('#' + id); },
  getElementsByClassName() { return []; }, getElementsByTagName() { return []; },
  createElement(t) { L('document.createElement', [t]); return stubEl(t); },
  createTextNode(t) { return { textContent: t }; },
  addEventListener(t2) { L('document.addEventListener', [t2]); }, removeEventListener() {},
  execCommand() { return false; }, hasFocus() { return true; }, activeElement: null,
  fonts: { ready: Promise.resolve() }, elementFromPoint: () => stubEl('efp'),
  createRange: () => ({ selectNode() {}, collapse() {}, getBoundingClientRect() { return { top: 0, left: 0, width: 0, height: 0 }; } }),
  getSelection: () => ({ addRange() {}, removeAllRanges() {}, toString: () => '' }),
}, 'document');
doc.documentElement = stubEl('html'); doc.body = stubEl('body'); doc.head = stubEl('head');

const timers = [];
const sandbox = healingProxy({
  console: { log: (...a) => L('console.log', a), info: (...a) => L('console.info', a), warn: (...a) => L('console.warn', a), error: (...a) => L('console.error', a), debug() {}, table() {}, trace() {}, dir() {}, exception: (...a) => L('console.error', a) },
  document: doc,
  location: healingProxy({ href: 'https://layma.net/', origin: 'https://layma.net', host: 'layma.net', hostname: 'layma.net', pathname: '/', protocol: 'https:', search: '', hash: '', assign() {}, replace() {}, reload() { L('location.reload', []); } }, 'location'),
  navigator: healingProxy({ userAgent: 'SBX', language: 'vi-VN', platform: 'Win32', clipboard: { writeText: t => L('clipboard.writeText', [t]) }, sendBeacon: () => true, hardwareConcurrency: 8, connection: { effectiveType: '4g' } }, 'navigator'),
  history: healingProxy({ pushState() { L('history.pushState', [...arguments]); }, replaceState() {} }, 'history'),
  /* fetch "thật" = LUÔN LỖI — bằng chứng payload đến từ bản nhúng */
  fetch: (u) => { L('NETWORK.fetch-BLOCKED', [String(u).slice(0, 120)]); return Promise.reject(new Error('sandbox-network-disabled')); },
  XMLHttpRequest: function () { this.open = (m, u) => L('NETWORK.xhr-BLOCKED', [m, u]); this.send = () => {}; this.setRequestHeader = () => {}; this.addEventListener = () => {}; },
  GM_xmlhttpRequest: (d) => { L('NETWORK.GMxhr-BLOCKED', [String(d.url).slice(0, 120)]); setTimeout(() => { d.onerror && d.onerror({ error: 'sandbox-network-disabled' }); }, 0); return { abort() {} }; },
  GM_setValue: (k, v) => L('GM_setValue', [k]), GM_getValue: (k, d) => d, GM_deleteValue() {}, GM_listValues: () => [],
  GM_setClipboard: t => L('GM_setClipboard', [String(t).slice(0, 80)]), GM_addStyle: c => L('GM_addStyle', [String(c).slice(0, 60)]),
  GM_openInTab: u => L('GM_openInTab', [u]), GM_notification: d => L('GM_notification', []), GM_registerMenuCommand: n => L('GM_registerMenuCommand', [n]),
  GM: healingProxy({ setValue: (k, v) => L('GM.setValue', [k]), getValue: (k, d) => d, deleteValue() {}, listValues: () => [], xmlHttpRequest: null, setClipboard: t => L('GM.setClipboard', [t]), addStyle() {}, openInTab: u => L('GM.openInTab', [u]), notification() {}, registerMenuCommand: n => L('GM.registerMenuCommand', [n]) }, 'GM'),
  GM_info: healingProxy({ script: healingProxy({ name: 'selfhost-test', version: '1' }, 'gmi') }, 'gmi'),
  setInterval: (f, ms) => { timers.push({ f, ms }); L('setInterval', [ms]); return timers.length; },
  setTimeout: (f, ms, ...r) => { L('setTimeout', [ms]); try { f(...r); } catch (e) { L('t.err', [e.message]); } return 0; },
  clearInterval() {}, clearTimeout() {},
  requestAnimationFrame: f => { try { f(Date.now()); } catch (e) { L('raf.err', [e.message]); } return 1; },
  addEventListener: t => L('window.addEventListener', [t]), removeEventListener() {},
  alert() {}, confirm: () => true, prompt: () => '', open: u => L('window.open', [u]), close() {},
  Notification: { requestPermission: () => Promise.resolve('granted'), permission: 'granted' },
  MutationObserver: function () { this.observe = (t2, o) => L('MutationObserver.observe', [t2 && t2.tagName]); this.disconnect = () => {}; },
  IntersectionObserver: function () { this.observe = () => {}; this.disconnect = () => {}; },
  getComputedStyle: () => ({ getPropertyValue: () => '' }),
  matchMedia: () => ({ matches: false, addListener() {}, addEventListener() {} }),
  atob, btoa, TextEncoder, TextDecoder, URL, URLSearchParams, Blob: function () {}, File: function () {},
  FormData: function () { this.append = () => {}; }, Headers: function () {},
  AbortController: class { constructor() { this.signal = {}; } abort() {} },
  crypto: require('crypto').webcrypto, CustomEvent: function (t2) { this.type = t2; }, Event: function (t2) { this.type = t2; },
  MouseEvent: function (t2) { this.type = t2; }, KeyboardEvent: function (t2) { this.type = t2; },
  HTMLElement: class {}, Element: class {}, Node: class {},
  localStorage: healingProxy({ getItem: () => null, setItem: (k) => L('localStorage.set', [k]), removeItem() {} }, 'ls'),
  sessionStorage: healingProxy({ getItem: () => null, setItem() {}, removeItem() {} }, 'ss'),
  screen: { width: 1920, height: 1080 }, innerWidth: 1920, innerHeight: 1080, devicePixelRatio: 1, origin: 'https://layma.net',
  Image: function () { this.src = ''; }, Audio: function () {}, performance: { now: () => Date.now(), timeOrigin: Date.now(), getEntriesByType: () => [] },
  queueMicrotask: f => { try { f(); } catch (e) { L('qmt.err', [e.message]); } },
  structuredClone: o => { try { return JSON.parse(JSON.stringify(o)); } catch (e) { return o; } },
  getSelection: () => doc.getSelection(), scroll() {}, scrollTo() {}, scrollBy() {},
}, 'window');
sandbox.window = sandbox; sandbox.self = sandbox; sandbox.top = sandbox; sandbox.parent = sandbox; sandbox.frames = sandbox;
sandbox.unsafeWindow = sandbox;
const ctx = vm.createContext(sandbox);
try { vm.runInContext("const _os=String.prototype.search;String.prototype.search=function(r){try{if(String(r).includes('(((.+)+)+)+'))return -1;}catch(e){}return _os.call(this,r);};", ctx); } catch (e) {}

let done = false;
function dump(why) {
  if (done) return; done = true;
  console.log('===', why, '===');
  const interesting = log.filter(l => !l.startsWith('MISSING') || /getQCaptcha|traffic|visitor|Token|Campain|AUTO_CHANGE|HRqUIVrI|TKph|ZR3k/.test(l));
  console.log('--- hoạt động chính (đầu 60) ---');
  interesting.slice(0, 60).forEach(l => console.log(l));
  const blocked = log.filter(l => l.includes('BLOCKED'));
  console.log('--- network bị chặn (phải = 0) ---');
  blocked.length ? blocked.forEach(l => console.log(l)) : console.log('(không có request nào rời máy — toàn bộ từ bản nhúng ✔)');
  console.log('--- selfhost serving ---');
  log.filter(l => l.includes('selfhost')).slice(0, 20).forEach(l => console.log(l));
  console.log('--- tổng sự kiện:', log.length, '| timers:', timers.length);
  process.exit(0);
}
process.on('unhandledRejection', e => dump('unhandledRejection: ' + (e && e.message)));
process.on('uncaughtException', e => dump('uncaughtException: ' + (e && e.message)));
setTimeout(() => dump('completed-4s'), 4000);

try {
  vm.runInContext(code, ctx, { timeout: 60000, filename: 'selfhost.user.js' });
  console.log('[*] userscript top-level OK');
} catch (e) {
  console.log('[!] threw:', e.message.slice(0, 200));
}
