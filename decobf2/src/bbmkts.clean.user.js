// ==UserScript==
// @name         BBMKTS Bypass Pro 3D (CLEAN RECONSTRUCTED v2)
// @namespace    https://bbmkts.com/
// @version      1.0.0-clean.2
// @description  Ban tai tao sach: logic API goc (/00abx, /link/submit) + UI/CSS/thong diep NGUYEN BAN khong dau (kiem chung bang runtime trace)
// @author       Tris (nguyen ban) · tai tao: decobf.tienxpro.site
// @match        *://bbmkts.com/go/*
// @match        *://*.bbmkts.com/go/*
// @match        *://bbmkts.com/file/*
// @match        *://*.bbmkts.com/file/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      bbmkts.com
// @connect      *
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';
  const TRAFFICSEO_KEYWORD = 'trafficseo2025';
  /* ------------ hằng số kiểm chứng bằng runtime trace của bản gốc ------------ */
  const MAX_ROUNDS = 6;      // "Dang xoay nhiem vu 0s (lan 1/6 -> 6/6)"
  const STEP_MS = 300;       // nhip dem nguoc setTimeout(fn, 300)
  const NO_WAIT_HINT = 'Kh\u00f4ng ph\u1ea3i ch\u1edd 200-100-60';
  const CSS_TEXT = `
#bv-floating-root {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 375px;
                z-index: 2147483647;
                perspective: 1200px;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                user-select: none;
            }
            #bv-stage-3d {
                position: relative;
                width: 100%;
                background: linear-gradient(145deg, rgba(16, 20, 36, 0.96), rgba(9, 12, 22, 0.98));
                border: 1px solid rgba(99, 102, 241, 0.42);
                border-radius: 18px;
                color: #f1f5f9;
                box-shadow:
                    0 24px 50px rgba(0, 0, 0, 0.78),
                    0 6px 0 rgba(30, 27, 75, 0.95),
                    inset 0 1px 1px rgba(255, 255, 255, 0.16);
                transform-style: preserve-3d;
                transform: rotateX(4deg) rotateY(-6deg) translateZ(0);
                transition: transform 0.16s ease-out, box-shadow 0.2s ease-out;
                backdrop-filter: blur(16px);
            }
            #bv-glare {
                position: absolute;
                inset: 0;
                border-radius: 18px;
                pointer-events: none;
                background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.14), transparent 65%);
                z-index: 1;
            }
            #bv-floating-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 13px 16px;
                background: linear-gradient(90deg, rgba(79, 70, 229, 0.3), rgba(6, 182, 212, 0.15));
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                border-radius: 18px 18px 0 0;
                cursor: move;
                transform: translateZ(18px);
                transform-style: preserve-3d;
            }
            #bv-header-left {
                display: flex;
                align-items: center;
                gap: 12px;
                transform-style: preserve-3d;
            }
            .bv-cube-scene {
                width: 20px;
                height: 20px;
                perspective: 220px;
                transform: translateZ(12px);
            }
            .bv-cube {
                width: 100%;
                height: 100%;
                position: relative;
                transform-style: preserve-3d;
                animation: bvSpinCube 7s infinite linear;
            }
            .bv-cube-face {
                position: absolute;
                width: 20px;
                height: 20px;
                border: 1.5px solid #38bdf8;
                background: rgba(56, 189, 248, 0.18);
                box-shadow: 0 0 8px rgba(56, 189, 248, 0.35);
                box-sizing: border-box;
            }
            .bv-face-front  { transform: rotateY(0deg) translateZ(10px); }
            .bv-face-back   { transform: rotateY(180deg) translateZ(10px); }
            .bv-face-right  { transform: rotateY(90deg) translateZ(10px); }
            .bv-face-left   { transform: rotateY(-90deg) translateZ(10px); }
            .bv-face-top    { transform: rotateX(90deg) translateZ(10px); }
            .bv-face-bottom { transform: rotateX(-90deg) translateZ(10px); }
            @keyframes bvSpinCube {
                0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
                100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }
            }
            #bv-floating-title {
                font-weight: 800;
                font-size: 13px;
                letter-spacing: 0.7px;
                text-transform: uppercase;
                color: #e0f2fe;
                text-shadow: 0 2px 6px rgba(56, 189, 248, 0.45);
                transform: translateZ(10px);
            }
            #bv-floating-toggle {
                background: rgba(15, 23, 42, 0.7);
                border: 1px solid rgba(148, 163, 184, 0.35);
                color: #cbd5e1;
                border-radius: 8px;
                width: 26px;
                height: 26px;
                cursor: pointer;
                font-weight: 700;
                font-size: 13px;
                line-height: 1;
                box-shadow: 0 3px 0 rgba(2, 6, 23, 0.9);
                transform: translateZ(14px);
                transition: transform 0.12s, background 0.15s;
            }
            #bv-floating-toggle:hover {
                background: rgba(51, 65, 85, 0.85);
                color: #ffffff;
            }
            #bv-floating-toggle:active {
                transform: translateZ(8px) translateY(2px);
            }
            #bv-floating-body {
                padding: 15px 16px 16px;
                display: flex;
                flex-direction: column;
                gap: 11px;
                font-size: 13px;
                transform-style: preserve-3d;
            }
            .bv-status-box {
                background: rgba(15, 23, 42, 0.84);
                border: 1px solid rgba(56, 189, 248, 0.24);
                border-radius: 11px;
                padding: 10px 12px;
                line-height: 1.45;
                color: #e2e8f0;
                word-break: break-word;
                box-shadow:
                    0 8px 18px rgba(0, 0, 0, 0.42),
                    inset 0 1px 0 rgba(255, 255, 255, 0.06);
                transform: translateZ(24px);
            }
            .bv-meta-box {
                background: rgba(15, 23, 42, 0.65);
                border: 1px solid rgba(148, 163, 184, 0.18);
                border-radius: 10px;
                padding: 8px 10px;
                font-size: 12px;
                color: #cbd5e1;
                display: none;
                transform: translateZ(16px);
            }
            .bv-meta-row {
                display: flex;
                justify-content: space-between;
                gap: 8px;
                margin-bottom: 4px;
            }
            .bv-meta-row:last-child {
                margin-bottom: 0;
            }
            .bv-meta-label {
                color: #94a3b8;
            }
            .bv-meta-val {
                color: #38bdf8;
                font-weight: 700;
                text-align: right;
                word-break: break-all;
            }
            .bv-img-preview {
                width: 100%;
                max-height: 92px;
                object-fit: contain;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.14);
                background: #020617;
                display: none;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
                transform: translateZ(20px);
            }
            .bv-field-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
                transform: translateZ(20px);
            }
            .bv-label {
                font-size: 11px;
                color: #94a3b8;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .bv-input-row {
                display: flex;
                gap: 6px;
            }
            .bv-input {
                flex: 1;
                background: rgba(2, 6, 23, 0.88);
                border: 1px solid rgba(148, 163, 184, 0.32);
                border-radius: 9px;
                padding: 8px 10px;
                color: #f8fafc;
                font-size: 12px;
                outline: none;
                box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.65);
                transition: border-color 0.15s, box-shadow 0.15s;
            }
            .bv-input:focus {
                border-color: #38bdf8;
                box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.65), 0 0 10px rgba(56, 189, 248, 0.3);
            }
            .bv-btn {
                background: linear-gradient(135deg, #4f46e5, #0284c7);
                color: #ffffff;
                border: none;
                border-radius: 9px;
                padding: 9px 13px;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                letter-spacing: 0.3px;
                box-shadow:
                    0 5px 0 #1e1b4b,
                    0 8px 16px rgba(2, 132, 199, 0.35);
                transform: translateZ(26px);
                transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.15s;
            }
            .bv-btn:hover {
                filter: brightness(1.1);
            }
            .bv-btn:active {
                transform: translateZ(20px) translateY(3px);
                box-shadow:
                    0 2px 0 #1e1b4b,
                    0 4px 10px rgba(2, 132, 199, 0.25);
            }
            .bv-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            .bv-progress-wrap {
                width: 100%;
                height: 9px;
                background: rgba(2, 6, 23, 0.9);
                border-radius: 999px;
                overflow: hidden;
                border: 1px solid rgba(255, 255, 255, 0.08);
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.7);
                display: none;
                transform: translateZ(18px);
            }
            .bv-progress-bar {
                height: 100%;
                width: 0%;
                background: linear-gradient(90deg, #4f46e5, #06b6d4, #22c55e);
                box-shadow: 0 0 12px rgba(6, 182, 212, 0.7);
                transition: width 0.25s linear;
            }
            .bv-code-badge {
                display: none;
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.18));
                border: 1px solid rgba(16, 185, 129, 0.55);
                color: #6ee7b7;
                padding: 10px;
                border-radius: 11px;
                text-align: center;
                font-weight: 800;
                font-size: 16px;
                letter-spacing: 2px;
                box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);
                transform: translateZ(30px);
            }`;
  const UI_HTML = `
<div id="bv-stage-3d">
                <div id="bv-glare"></div>
                <div id="bv-floating-header">
                    <div id="bv-header-left">
                        <div class="bv-cube-scene">
                            <div class="bv-cube">
                                <div class="bv-cube-face bv-face-front"></div>
                                <div class="bv-cube-face bv-face-back"></div>
                                <div class="bv-cube-face bv-face-right"></div>
                                <div class="bv-cube-face bv-face-left"></div>
                                <div class="bv-cube-face bv-face-top"></div>
                                <div class="bv-cube-face bv-face-bottom"></div>
                            </div>
                        </div>
                        <span id="bv-floating-title">BBMKTS 3D</span>
                    </div>
                    <button id="bv-floating-toggle" title="Thu gon / Mo rong">-</button>
                </div>
                <div id="bv-floating-body">
                    <div class="bv-status-box" id="bv-status">Dang khoi tao...</div>
                    <div class="bv-meta-box" id="bv-meta">
                        <div class="bv-meta-row">
                            <span class="bv-meta-label">Che do:</span>
                            <span class="bv-meta-val" id="bv-meta-mode">-</span>
                        </div>
                        <div class="bv-meta-row">
                            <span class="bv-meta-label">Tu khoa:</span>
                            <span class="bv-meta-val" id="bv-meta-kw">-</span>
                        </div>
                    </div>
                    <img class="bv-img-preview" id="bv-img" alt="step-preview" />
                    <div class="bv-progress-wrap" id="bv-progress-wrap">
                        <div class="bv-progress-bar" id="bv-progress-bar"></div>
                    </div>
                    <div class="bv-code-badge" id="bv-code-badge"></div>
                    <div class="bv-field-group">
                        <label class="bv-label" for="bv-url-input">Domain / URL hoac Ma Code (tuy chon)</label>
                        <div class="bv-input-row">
                            <input class="bv-input" id="bv-url-input" type="text" placeholder="Tu dong lay ma 0s hoac nhap tay..." />
                        </div>
                    </div>
                    <button class="bv-btn" id="bv-start-btn">Vuot Link Ngay (0s)</button>
                </div>
            </div>`;
  const REF_PAIRS = [['#bv-status', 'status'], ['#bv-meta', 'metaBox'], ['#bv-meta-mode', 'metaMode'], ['#bv-meta-kw', 'metaKw'], ['#bv-img', 'img'], ['#bv-progress-wrap', 'progressWrap'], ['#bv-progress-bar', 'progressBar'], ['#bv-code-badge', 'codeBadge'], ['#bv-url-input', 'urlInput'], ['#bv-start-btn', 'startBtn']];
  const refs = {};
  let modeName = '-';
  let round = 0;
  let busy = false;
  const $$ = sel => document.querySelector(sel);
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const gmXhr = typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null;
  const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  function setStatus(html) {
    if (refs.status) refs.status.innerHTML = html;
  }
  function setProgress(pct) {
    if (!refs.progressWrap || !refs.progressBar) return;
    refs.progressWrap.style.display = 'block';
    refs.progressBar.style.width = Math.max(0, Math.min(100, pct)) + '%';
  }
  function showCode(code) {
    if (!refs.codeBadge) return;
    refs.codeBadge.style.display = 'block';
    refs.codeBadge.textContent = 'CODE: ' + code;
  }
  function bind3D(stage) {
    const glare = $$('#bv-glare');
    stage.addEventListener('mousemove', e => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      stage.style.transform = 'rotateX(' + (4 - dy * 10).toFixed(2) + 'deg) rotateY(' + (-6 + dx * 12).toFixed(2) + 'deg) translateZ(0)';
      if (glare) glare.style.background = 'radial-gradient(circle at ' + ((dx + 0.5) * 100).toFixed(0) + '% 0%, rgba(255,255,255,0.18), transparent 65%)';
    });
    stage.addEventListener('mouseleave', () => {
      stage.style.transform = 'rotateX(4deg) rotateY(-6deg) translateZ(0)';
    });
  }
  function bindDrag(root, handle) {
    let sx = 0,
      sy = 0,
      ox = 0,
      oy = 0,
      dragging = false;
    handle.addEventListener('mousedown', e => {
      dragging = true;
      sx = e.clientX;
      sy = e.clientY;
      const cs = window.getComputedStyle(root);
      ox = parseFloat(cs.left || '0');
      oy = parseFloat(cs.top || '0');
      e.preventDefault();
    });
    window.addEventListener('mousemove', e => {
      if (!dragging) return;
      root.style.left = ox + (e.clientX - sx) + 'px';
      root.style.top = oy + (e.clientY - sy) + 'px';
      root.style.right = 'auto';
      root.style.bottom = 'auto';
    });
    window.addEventListener('mouseup', () => {
      dragging = false;
    });
  }
  function bindToggle(root, btn) {
    const body = $$('#bv-floating-body');
    let collapsed = false;
    btn.addEventListener('click', () => {
      collapsed = !collapsed;
      if (body) body.style.display = collapsed ? 'none' : 'block';
      btn.textContent = collapsed ? '+' : '-';
    });
  }
  function extractPageInfo() {
    const info = {
      csrf: '',
      token: '',
      isCheck222: false,
      requiredDomain: '',
      keyword: '',
      uploads: [],
      hasNoWaitHint: false,
      copiedCodes: []
    };
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) info.csrf = metaTag.getAttribute('content') || '';
    const pageText = document.documentElement ? String(document.documentElement.innerHTML) : '';
    let m = pageText.match(/token:\s*'([^']+)'/);
    if (m) info.token = m[1];
    m = pageText.match(/name="token"\s+value="([^"]+)"/);
    if (m && !info.token) info.token = m[1];
    info.isCheck222 = !!document.querySelector('#check222');
    m = pageText.match(/requiredDomains:\s*\[\s*"([^"]+)"/);
    if (m) info.requiredDomain = m[1];
    for (const cm of pageText.matchAll(/onclick="copy\('([^']+)'\)"/g)) info.copiedCodes.push(cm[1]);
    for (const um of pageText.matchAll(/https:\/\/bbmkts\.com\/uploads\/[^\s"']+/g)) info.uploads.push(um[0]);
    info.hasNoWaitHint = pageText.indexOf(NO_WAIT_HINT) !== -1;
    return info;
  }
  function decodeGoPath(raw) {
    try {
      const parts = String(raw).split(/[?#]/);
      const chunks = [];
      parts.map.call(parts, p => p).forEach(p => {
        if (!p) return;
        const fixed = p.replace(/-/g, '+').replace(/_/g, '/');
        try {
          chunks.push(atob(fixed));
        } catch (e) {
          chunks.push(p);
        }
      });
      return chunks.join('');
    } catch (e) {
      return '';
    }
  }
  function resolveTarget() {
    const loc = pageWindow.location;
    const path = loc.pathname || '';
    let raw = '';
    if (path.indexOf('/go/file/') !== -1) raw = path.slice(path.indexOf('/go/file/') + '/go/file/'.length);else if (path.indexOf('/go/') !== -1) raw = path.slice(path.indexOf('/go/') + 4);
    let target = raw ? decodeGoPath(decodeURIComponent(raw)) : '';
    if (!/^https?:\/\//i.test(target || '')) {
      const qs = new URLSearchParams(loc.search || '');
      target = qs.get('longurl') || target || '';
    }
    return target;
  }
  function fetchCode00abx(domainOrCode) {
    return new Promise((resolve, reject) => {
      if (!gmXhr) return reject(new Error('GM_xmlhttpRequest khong khoi dong'));
      const host = pageWindow.location.hostname.replace(/^www\./, '');
      const url = 'https://' + host + '/00abx?00xz=' + encodeURIComponent(domainOrCode) + '&0012=' + encodeURIComponent(String(round));
      gmXhr({
        method: 'GET',
        url: url,
        headers: {
          'Accept': 'application/json, text/plain, */*'
        },
        onload: resp => {
          try {
            const data = JSON.parse(resp.responseText);
            if (data && data.code) resolve(String(data.code));else reject(new Error('Phan hoi 00abx khong hop le'));
          } catch (e) {
            reject(new Error('Phan hoi 00abx khong hop le'));
          }
        },
        onerror: () => reject(new Error('Khong lay duoc ma tu 00abx cho domain ' + domainOrCode))
      });
    });
  }
  async function submitLink(code) {
    const csrfTag = document.querySelector('meta[name="csrf-token"]');
    const params = new URLSearchParams();
    params.set('code', code);
    params.set('type', 'available');
    params.set('cf-turnstile-response', 'dummy');
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Requested-With': 'XMLHttpRequest'
    };
    if (csrfTag) headers['X-CSRF-TOKEN'] = csrfTag.getAttribute('content') || '';
    const resp = await fetch('/link/submit', {
      method: 'POST',
      headers: headers,
      body: params.toString(),
      credentials: 'same-origin',
      cache: 'no-store'
    });
    let data;
    try {
      data = await resp.json();
    } catch (e) {
      throw new Error('Phan hoi /link/submit khong phai JSON');
    }
    if (!resp.ok) throw new Error('Loi submit HTTP ' + resp.status);
    return data;
  }
  function fillCodeAndSubmit(code) {
    const input = document.querySelector('input[name="code"]');
    if (input) {
      input.value = code;
      input.dispatchEvent(new Event('input', {
        bubbles: true
      }));
      input.dispatchEvent(new Event('change', {
        bubbles: true
      }));
    }
    const form = document.querySelector('formgetlink') || document.querySelector('#check222');
    if (form) {
      const btn = form.querySelector('button[type="submit"]') || form;
      btn.removeAttribute('disabled');
      btn.click();
      return true;
    }
    return false;
  }
  function detectMode(info, target) {
    const path = pageWindow.location.pathname || '';
    if (target && /^https?:\/\//i.test(target)) return 'DIRECT';
    if (document.body && String(document.body.innerText || '').indexOf(TRAFFICSEO_KEYWORD) !== -1) return 'TrafficSEO';
    if (info.copiedCodes.length || info.isCheck222) return 'Instant 0s';
    return 'MANUAL';
  }
  async function runBypass() {
    if (busy) return;
    if (round >= MAX_ROUNDS) {
      setStatus('<span style="color:#f87171;">Loi: Nhiem vu hien tai can nhap Domain hoac Ma Code vao o ben duoi.</span>');
      return;
    }
    busy = true;
    refs.startBtn && (refs.startBtn.disabled = true);
    try {
      const info = extractPageInfo();
      const manualInput = refs.urlInput && refs.urlInput.value ? refs.urlInput.value.trim() : '';
      const target = manualInput || resolveTarget();
      modeName = detectMode(info, manualInput || target);
      if (refs.metaMode) refs.metaMode.textContent = modeName;
      if (refs.metaKw) refs.metaKw.textContent = info.requiredDomain || info.keyword || '-';
      if (refs.img && info.uploads.length) {
        refs.img.src = info.uploads[0];
        refs.img.style.display = 'block';
      }
      let code = '';
      if (manualInput && !/^https?:\/\//i.test(manualInput)) {
        setStatus('Dang thu ma nhap tay: <b>' + esc(manualInput) + '</b>...');
        code = manualInput;
      } else if (info.copiedCodes.length) {
        code = info.copiedCodes[info.copiedCodes.length - 1];
        setStatus('Phat hien nhiem vu TrafficSEO (0s). Dang gui ma <b>' + esc(code) + '</b>...');
      } else {
        setStatus('Dang lay ma 0s tu 00abx cho <b>' + esc(info.requiredDomain || pageWindow.location.hostname) + '</b>...');
        code = await fetchCode00abx(info.requiredDomain || manualInput || target);
      }
      showCode(code);
      setProgress(60);
      round += 1;
      /* dem nguoc hien thi — thong diep nguyen ban tu trace */
      let cd = 0;
      setStatus('Dang tu dong vuot link BBMKTS (' + cd + ' giay)...');
      if (refs.startBtn) refs.startBtn.textContent = 'Vuot Link Ngay (' + cd + 's)';
      const cdTimer = setInterval(() => {
        cd++;
        setStatus('Dang tu dong vuot link BBMKTS (' + cd + ' giay)...');
        if (refs.startBtn) refs.startBtn.textContent = 'Vuot Link Ngay (' + cd + 's)';
        if (cd >= 5) clearInterval(cdTimer);
      }, STEP_MS);
      setStatus('Dang xoay nhiem vu 0s (lan ' + round + '/6)...');
      const data = await submitLink(code);
      setProgress(100);
      if (data && data.ok) {
        const finalUrl = data.longurl || data.message || target;
        setStatus('Th\u00e0nh c\u00f4ng! \u0110ang chuy\u1ec3n h\u01b0\u1edbng t\u1edbi:<br><a href="' + esc(finalUrl) + '" style="color:#4ade80;font-weight:700;text-decoration:underline;">' + esc(finalUrl) + '</a>');
        if (finalUrl && /^https?:\/\//i.test(finalUrl)) setTimeout(() => {
          pageWindow.location.href = finalUrl;
        }, 800);
      } else {
        setStatus(data && data.message ? esc(data.message) : 'Khong thanh cong, thu lai.');
        refs.startBtn && (refs.startBtn.disabled = false);
      }
    } catch (err) {
      setStatus((err && err.message ? esc(err.message) : 'Loi khong xac dinh') + ' <span style="color:#f87171">(l\u1ea7n ' + round + ')</span>');
      refs.startBtn && (refs.startBtn.disabled = false);
    } finally {
      busy = false;
    }
  }
  function buildUI() {
    if (document.getElementById('bv-floating-root')) return;
    if (typeof GM_addStyle === 'function') GM_addStyle(CSS_TEXT);
    const root = document.createElement('div');
    root.id = 'bv-floating-root';
    root.innerHTML = UI_HTML;
    document.body.appendChild(root);
    const stage = root.querySelector('#bv-stage-3d');
    const toggle = root.querySelector('#bv-floating-toggle');
    for (const [sel, key] of REF_PAIRS) refs[key] = root.querySelector(sel);
    if (stage) bind3D(stage);
    bindDrag(root, root.querySelector('#bv-floating-header'));
    if (toggle) bindToggle(root, toggle);
    if (refs.startBtn) refs.startBtn.addEventListener('click', runBypass);
    if (refs.status) refs.status.textContent = 'Dang khoi tao...';
  }
  function startBBMKTS() {
    buildUI();
    setStatus('San sang. Nhan "Vuot Link Ngay" de bypass.');
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startBBMKTS, {
      once: true
    });
  } else {
    startBBMKTS();
  }
})();
