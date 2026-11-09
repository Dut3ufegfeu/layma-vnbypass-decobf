/* Build Auto_LaymaV2.selfhost.user.js:
 * - nhúng (embed) toàn bộ payload của chuỗi loader vào userscript
 * - intercept fetch + GM_xmlhttpRequest: URL của tác giả -> phục vụ bản nhúng (offline)
 * - chạy lại đúng chuỗi gốc: fetch x10.mx -> eval -> stage2 -> pastefy -> ... */
const fs = require('fs');
const path = require('path');

const DIR = '../dl/layma';
const OUT = process.argv[2] || '../site/repo/Auto_LaymaV2.selfhost.user.js';

const read = f => fs.readFileSync(path.join(DIR, f), 'utf8');

const PAYLOADS = {
  stage2: read('stage2_layma.js'),
  stage3: read('stage3_pastefy.js'),
  stage4: read('stage4_pastefy.js'),
  cfg_TKphHBjA: read('cfg_TKphHBjA.js'),
  cfg_ZR3kGQZp: read('cfg_ZR3kGQZp.js'),
  cfg_HRqUIVrI: read('cfg_HRqUIVrI.js'),
};

/* URL của tác giả -> key payload nhúng */
const MAP = [
  ['duckxkrmproject.x10.mx/layma.js', 'stage2'],
  ['pastefy.app/5dKBHbgv', 'stage3'],
  ['pastefy.app/6ZzLL87y', 'stage4'],
  ['pastefy.app/TKphHBjA', 'cfg_TKphHBjA'],
  ['pastefy.app/ZR3kGQZp', 'cfg_ZR3kGQZp'],
  ['pastefy.app/HRqUIVrI', 'cfg_HRqUIVrI'],
];

const header = `// ==UserScript==
// @name         Layma.net Bypass - CUTTAY PROMAX (SELFHOST decobf)
// @namespace    https://github.com/Dut3ufegfeu/layma-vnbypass-decobf
// @version      1.1.4-selfhost.1
// @description  Auto nhiệm vụ lấy mã — bản self-host: toàn bộ payload đã được nhúng/mirror, không phụ thuộc link của tác giả (x10.mx / pastefy). Mọi request tới link gốc đều được phục vụ từ bản nhúng.
// @author       DuckXkurumi (nguyên bản) · decobf & selfhost: Dut3ufegfeu
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        https://layma.net/*
// @connect      layma.net
// @connect      api.layma.net
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @updateURL    https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.selfhost.user.js
// @downloadURL  https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.selfhost.user.js
// @license      MIT
// ==/UserScript==
`;

const body = `
/* ============================================================================
 * SELF-HOSTED DECOfB BUILD — sinh tự động bởi tools/build_selfhost.js
 * Nguyên lý: chuỗi loader gốc (4 tầng) vẫn chạy đúng logic, nhưng mọi request
 * tới payload của tác giả (x10.mx, pastefy.app) bị chặn và phục vụ từ dữ liệu
 * đã nhúng sẵn trong chính file này => tác giả xóa/đổi link cũng không ảnh hưởng.
 * ==========================================================================*/
(function () {
  /* KHÔNG 'use strict': payload các tầng cần sloppy mode (bắt this = global);
   * dùng indirect eval để stage chạy ở global scope, không kế thừa strict của wrapper. */

  /* ---- gian lận lành tính: stage 2 có anti-tamper đọc Error().stack để tìm
   * chữ "eval" (phát hiện payload bị nạp động). Ta sanitize stack trong realm
   * này để payload luôn thấy mình như script thường. ---- */
  var _pst = Error.prepareStackTrace;
  Error.prepareStackTrace = function (error, frames) {
    var st = _pst ? _pst(error, frames) : (frames || []).map(function (f) { return '    at ' + (f && f.toString ? f.toString() : String(f)); }).join(String.fromCharCode(10));
    return String(st).replace(/eval/g, 'load').replace(/selfhost/g, 'script');
  };

  /* ---- payload nhúng (nguyên bản từng byte của các tầng) ---- */
  var EMBED = {
${Object.entries(PAYLOADS).map(([k, v]) => '    ' + JSON.stringify(k) + ': ' + JSON.stringify(v)).join(',\n')}
  };

  var MAP = ${JSON.stringify(MAP.map(([u, k]) => [u, k]))};

  function matchKey(url) {
    var s = String(url || '');
    for (var i = 0; i < MAP.length; i++) if (s.indexOf(MAP[i][0]) !== -1) return MAP[i][1];
    return null;
  }

  function fakeResponse(src) {
    return {
      ok: true, status: 200, statusText: 'OK (selfhost)', redirected: false,
      headers: { get: function () { return null; } },
      text: function () { return Promise.resolve(src); },
      json: function () { return Promise.resolve(JSON.parse(src)); },
      blob: function () { return Promise.resolve(new Blob([src])); },
      arrayBuffer: function () { return Promise.resolve(new TextEncoder().encode(src).buffer); }
    };
  }

  /* ---- chặn window.fetch ---- */
  var _fetch = typeof fetch === 'function' ? fetch : null;
  function patchedFetch(url, opts) {
    var key = matchKey(url);
    if (key && EMBED[key]) {
      try { console.info('[selfhost] phục vụ từ bản nhúng:', String(url).split('?')[0], '->', key); } catch (e) {}
      return Promise.resolve(fakeResponse(EMBED[key]));
    }
    if (_fetch) return _fetch.call(this, url, opts);
    return Promise.reject(new Error('selfhost: fetch unavailable'));
  }
  try { window.fetch = patchedFetch; } catch (e) {}
  try { if (typeof unsafeWindow !== 'undefined' && unsafeWindow && unsafeWindow.fetch && unsafeWindow.fetch !== patchedFetch) { /* giữ nguyên fetch của trang */ } } catch (e) {}

  /* ---- chặn GM_xmlhttpRequest ---- */
  var _gmxhr = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null;
  function patchedGM(details) {
    var key = details && matchKey(details.url);
    if (key && EMBED[key]) {
      try { console.info('[selfhost] GM_xhr phục vụ từ bản nhúng:', String(details.url).split('?')[0], '->', key); } catch (e) {}
      var src = EMBED[key];
      setTimeout(function () {
        var cb = details.onload || function () {};
        cb({ status: 200, readyState: 4, responseText: src, response: src, responseHeaders: 'content-type: text/plain', finalUrl: String(details.url) });
      }, 0);
      return { abort: function () {} };
    }
    if (_gmxhr) return _gmxhr(details);
    throw new Error('selfhost: GM_xmlhttpRequest unavailable');
  }
  try { GM_xmlhttpRequest = patchedGM; } catch (e) {}
  try { window.GM_xmlhttpRequest = patchedGM; } catch (e) {}
  try { if (typeof unsafeWindow !== 'undefined') { unsafeWindow.GM_xmlhttpRequest = patchedGM; } } catch (e) {}

  /* ---- chạy đúng chuỗi gốc: tầng 1 (funcion.js đã deobf) ---- */
  patchedFetch('https://duckxkrmproject.x10.mx/layma.js?t=' + Date.now())
    .then(function (response) { return response.text(); })
    .then(function (code) {
      try { window.GM_xmlhttpRequest = patchedGM; } catch (e) {}
      try { if (typeof unsafeWindow !== 'undefined') { unsafeWindow.GM_xmlhttpRequest = patchedGM; } } catch (e) {}
      /* tầng 2 eval -> tự fetch pastefy (bị chặn, phục vụ bản nhúng) -> tầng 3 -> tầng 4
       * (0,eval) = indirect eval: chạy ở global scope + sloppy mode như bản gốc */
      (0, eval)(code);
    })
    .catch(function (error) { console.error('[selfhost] Lỗi khi nạp payload:', error); });
})();
`;

fs.writeFileSync(OUT, header + body);
const size = fs.statSync(OUT).size;
console.log('written:', OUT, (size / 1024).toFixed(0) + ' KB');
