// ==UserScript==
// @name         BBMKTS Bypass Pro 3D (CLEAN RECONSTRUCTED)
// @namespace    https://bbmkts.com/
// @version      1.0.0-clean.1
// @description  Auto bypass BBMKTS shortlinks with 3D Floating UI — ban tai tao ma nguon sach tu runtime trace (UI/CSS/thong diep giu nguyen ban; luong dung lai va chu thich noi suy luan).
// @author       Tris (nguyen ban) · tai tao sach: decobf.tienxpro.site
// @match        *://bbmkts.com/go/*
// @match        *://*.bbmkts.com/go/*
// @match        *://bbmkts.com/file/*
// @match        *://*.bbmkts.com/file/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      bbmkts.com
// @connect      *
// @run-at       document-end
// @license      MIT
// ==/UserScript==

/* ============================================================================
 * BBMKTS Bypass Pro 3D — CLEAN RECONSTRUCTED SOURCE
 * ----------------------------------------------------------------------------
 * File goc 113 KB la JSVMP (bytecode + interpreter, 0 chuoi plain-text) nen
 * khong the decompile co hoc 1:1. Ban nay duoc TAI TAO tu bang chung runtime:
 *  - Toan bo CSS + HTML template + thong diep UI: NGUYEN BAN (bat tu trace)
 *  - Luong hoat dong (dem nguoc, xoay nhiem vu, nhap ma): dung theo trace
 *  - Noi suy luan duoc danh dau [INFERRED]
 * ==========================================================================*/
(function () {
    'use strict';

    /* ------------------ hang so quan sat duoc tu trace ------------------ */
    var ROOT_ID   = 'bv-floating-root';
    var STEP_MS   = 300;      // setTimeout(fn, 300) — nhip dem nguoc
    var MAX_ROUNDS = 6;       // "Dang xoay nhiem vu 0s (lan 1/6 -> 6/6)"
    var PROMO_URL = 'https://layma.net/';   // fetch quang cheo (bat duoc trong trace)

    var CSS = "#bv-floating-root {\n    position: fixed;\n    bottom: 24px;\n    right: 24px;\n    width: 375px;\n    z-index: 2147483647;\n    perspective: 1200px;\n    font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;\n    user-select: none;\n}\n#bv-stage-3d {\n    position: relative;\n    width: 100%;\n    background: linear-gradient(145deg, rgba(16, 20, 36, 0.96), rgba(9, 12, 22, 0.98));\n    border: 1px solid rgba(99, 102, 241, 0.42);\n    border-radius: 18px;\n    color: #f1f5f9;\n    box-shadow:\n        0 24px 50px rgba(0, 0, 0, 0.78),\n        0 6px 0 rgba(30, 27, 75, 0.95),\n        inset 0 1px 1px rgba(255, 255, 255, 0.16);\n    transform-style: preserve-3d;\n    transform: rotateX(4deg) rotateY(-6deg) translateZ(0);\n    transition: transform 0.16s ease-out, box-shadow 0.2s ease-out;\n    backdrop-filter: blur(16px);\n}\n#bv-glare {\n    position: absolute;\n    inset: 0;\n    border-radius: 18px;\n    pointer-events: none;\n    background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.14), transparent 65%);\n    z-index: 1;\n}\n#bv-floating-header {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    padding: 13px 16px;\n    background: linear-gradient(90deg, rgba(79, 70, 229, 0.3), rgba(6, 182, 212, 0.15));\n    border-bottom: 1px solid rgba(255, 255, 255, 0.08);\n    border-radius: 18px 18px 0 0;\n    cursor: move;\n    transform: translateZ(18px);\n    transform-style: preserve-3d;\n}\n#bv-header-left {\n    display: flex;\n    align-items: center;\n    gap: 12px;\n    transform-style: preserve-3d;\n}\n.bv-cube-scene {\n    width: 20px;\n    height: 20px;\n    perspective: 220px;\n    transform: translateZ(12px);\n}\n.bv-cube {\n    width: 100%;\n    height: 100%;\n    position: relative;\n    transform-style: preserve-3d;\n    animation: bvSpinCube 7s infinite linear;\n}\n.bv-cube-face {\n    position: absolute;\n    width: 20px;\n    height: 20px;\n    border: 1.5px solid #38bdf8;\n    background: rgba(56, 189, 248, 0.18);\n    box-shadow: 0 0 8px rgba(56, 189, 248, 0.35);\n    box-sizing: border-box;\n}\n.bv-face-front  { transform: rotateY(0deg) translateZ(10px); }\n.bv-face-back   { transform: rotateY(180deg) translateZ(10px); }\n.bv-face-right  { transform: rotateY(90deg) translateZ(10px); }\n.bv-face-left   { transform: rotateY(-90deg) translateZ(10px); }\n.bv-face-top    { transform: rotateX(90deg) translateZ(10px); }\n.bv-face-bottom { transform: rotateX(-90deg) translateZ(10px); }\n@keyframes bvSpinCube {\n    0%   { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }\n    100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(180deg); }\n}\n#bv-floating-title {\n    font-weight: 800;\n    font-size: 13px;\n    letter-spacing: 0.7px;\n    text-transform: uppercase;\n    color: #e0f2fe;\n    text-shadow: 0 2px 6px rgba(56, 189, 248, 0.45);\n    transform: translateZ(10px);\n}\n#bv-floating-toggle {\n    background: rgba(15, 23, 42, 0.7);\n    border: 1px solid rgba(148, 163, 184, 0.35);\n    color: #cbd5e1;\n    border-radius: 8px;\n    width: 26px;\n    height: 26px;\n    cursor: pointer;\n    font-weight: 700;\n    font-size: 13px;\n    line-height: 1;\n    box-shadow: 0 3px 0 rgba(2, 6, 23, 0.9);\n    transform: translateZ(14px);\n    transition: transform 0.12s, background 0.15s;\n}\n#bv-floating-toggle:hover {\n    background: rgba(51, 65, 85, 0.85);\n    color: #ffffff;\n}\n#bv-floating-toggle:active {\n    transform: translateZ(8px) translateY(2px);\n}\n#bv-floating-body {\n    padding: 15px 16px 16px;\n    display: flex;\n    flex-direction: column;\n    gap: 11px;\n    font-size: 13px;\n    transform-style: preserve-3d;\n}\n.bv-status-box {\n    background: rgba(15, 23, 42, 0.84);\n    border: 1px solid rgba(56, 189, 248, 0.24);\n    border-radius: 11px;\n    padding: 10px 12px;\n    line-height: 1.45;\n    color: #e2e8f0;\n    word-break: break-word;\n    box-shadow:\n        0 8px 18px rgba(0, 0, 0, 0.42),\n        inset 0 1px 0 rgba(255, 255, 255, 0.06);\n    transform: translateZ(24px);\n}\n.bv-meta-box {\n    background: rgba(15, 23, 42, 0.65);\n    border: 1px solid rgba(148, 163, 184, 0.18);\n    border-radius: 10px;\n    padding: 8px 10px;\n    font-size: 12px;\n    color: #cbd5e1;\n    display: none;\n    transform: translateZ(16px);\n}\n.bv-meta-row {\n    display: flex;\n    justify-content: space-between;\n    gap: 8px;\n    margin-bottom: 4px;\n}\n.bv-meta-row:last-child {\n    margin-bottom: 0;\n}\n.bv-meta-label {\n    color: #94a3b8;\n}\n.bv-meta-val {\n    color: #38bdf8;\n    font-weight: 700;\n    text-align: right;\n    word-break: break-all;\n}\n.bv-img-preview {\n    width: 100%;\n    max-height: 92px;\n    object-fit: contain;\n    border-radius: 10px;\n    border: 1px solid rgba(255, 255, 255, 0.14);\n    background: #020617;\n    display: none;\n    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);\n    transform: translateZ(20px);\n}\n.bv-field-group {\n    display: flex;\n    flex-direction: column;\n    gap: 5px;\n    transform: translateZ(20px);\n}\n.bv-label {\n    font-size: 11px;\n    color: #94a3b8;\n    font-weight: 700;\n    text-transform: uppercase;\n    letter-spacing: 0.5px;\n}\n.bv-input-row {\n    display: flex;\n    gap: 6px;\n}\n.bv-input {\n    flex: 1;\n    background: rgba(2, 6, 23, 0.88);\n    border: 1px solid rgba(148, 163, 184, 0.32);\n    border-radius: 9px;\n    padding: 8px 10px;\n    color: #f8fafc;\n    font-size: 12px;\n    outline: none;\n    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.65);\n    transition: border-color 0.15s, box-shadow 0.15s;\n}\n.bv-input:focus {\n    border-color: #38bdf8;\n    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.65), 0 0 10px rgba(56, 189, 248, 0.3);\n}\n.bv-btn {\n    background: linear-gradient(135deg, #4f46e5, #0284c7);\n    color: #ffffff;\n    border: none;\n    border-radius: 9px;\n    padding: 9px 13px;\n    font-size: 12px;\n    font-weight: 700;\n    cursor: pointer;\n    letter-spacing: 0.3px;\n    box-shadow:\n        0 5px 0 #1e1b4b,\n        0 8px 16px rgba(2, 132, 199, 0.35);\n    transform: translateZ(26px);\n    transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.15s;\n}\n.bv-btn:hover {\n    filter: brightness(1.1);\n}\n.bv-btn:active {\n    transform: translateZ(20px) translateY(3px);\n    box-shadow:\n        0 2px 0 #1e1b4b,\n        0 4px 10px rgba(2, 132, 199, 0.25);\n}\n.bv-btn:disabled {\n    opacity: 0.5;\n    cursor: not-allowed;\n}\n.bv-progress-wrap {\n    width: 100%;\n    height: 9px;\n    background: rgba(2, 6, 23, 0.9);\n    border-radius: 999px;\n    overflow: hidden;\n    border: 1px solid rgba(255, 255, 255, 0.08);\n    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.7);\n    display: none;\n    transform: translateZ(18px);\n}\n.bv-progress-bar {\n    height: 100%;\n    width: 0%;\n    background: linear-gradient(90deg, #4f46e5, #06b6d4, #22c55e);\n    box-shadow: 0 0 12px rgba(6, 182, 212, 0.7);\n    transition: width 0.25s linear;\n}\n.bv-code-badge {\n    display: none;\n    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.18));\n    border: 1px solid rgba(16, 185, 129, 0.55);\n    color: #6ee7b7;\n    padding: 10px;\n    border-radius: 11px;\n    text-align: center;\n    font-weight: 800;\n    font-size: 16px;\n    letter-spacing: 2px;\n    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.45);\n    transform: translateZ(30px);\n}";

    var UI_HTML = "            <div id=\"bv-stage-3d\">\n                <div id=\"bv-glare\"></div>\n                <div id=\"bv-floating-header\">\n                    <div id=\"bv-header-left\">\n                        <div class=\"bv-cube-scene\">\n                            <div class=\"bv-cube\">\n                                <div class=\"bv-cube-face bv-face-front\"></div>\n                                <div class=\"bv-cube-face bv-face-back\"></div>\n                                <div class=\"bv-cube-face bv-face-right\"></div>\n                                <div class=\"bv-cube-face bv-face-left\"></div>\n                                <div class=\"bv-cube-face bv-face-top\"></div>\n                                <div class=\"bv-cube-face bv-face-bottom\"></div>\n                            </div>\n                        </div>\n                        <span id=\"bv-floating-title\">BBMKTS 3D</span>\n                    </div>\n                    <button id=\"bv-floating-toggle\" title=\"Thu gon / Mo rong\">-</button>\n                </div>\n                <div id=\"bv-floating-body\">\n                    <div class=\"bv-status-box\" id=\"bv-status\">Dang khoi tao...</div>\n                    <div class=\"bv-meta-box\" id=\"bv-meta\">\n                        <div class=\"bv-meta-row\">\n                            <span class=\"bv-meta-label\">Che do:</span>\n                            <span class=\"bv-meta-val\" id=\"bv-meta-mode\">-</span>\n                        </div>\n                        <div class=\"bv-meta-row\">\n                            <span class=\"bv-meta-label\">Tu khoa:</span>\n                            <span class=\"bv-meta-val\" id=\"bv-meta-kw\">-</span>\n                        </div>\n                    </div>\n                    <img class=\"bv-img-preview\" id=\"bv-img\" alt=\"step-preview\" />\n                    <div class=\"bv-progress-wrap\" id=\"bv-progress-wrap\">\n                        <div class=\"bv-progress-bar\" id=\"bv-progress-bar\"></div>\n                    </div>\n                    <div class=\"bv-code-badge\" id=\"bv-code-badge\"></div>\n                    <div class=\"bv-field-group\">\n                        <label class=\"bv-label\" for=\"bv-url-input\">Domain / URL hoac Ma Code (tuy chon)</label>\n                        <div class=\"bv-input-row\">\n                            <input class=\"bv-input\" id=\"bv-url-input\" type=\"text\" placeholder=\"Tu dong lay ma 0s hoac nhap tay...\" />\n                        </div>\n                    </div>\n                    <button class=\"bv-btn\" id=\"bv-start-btn\">Vuot Link Ngay (0s)</button>\n                </div>\n            </div>";

    /* ------------------ trang thai ------------------ */
    var ui = {};            // tham chieu cac phan tu
    var collapsed = false;
    var secondsLeft = 0;
    var round = 0;
    var manualDone = false;
    var mode = location.pathname.indexOf('/go/') !== -1 ? 'GO'
             : location.pathname.indexOf('/file/') !== -1 ? 'FILE' : '?';

    /* ------------------ tien ich ------------------ */
    function $(id) { return document.getElementById(id); }
    function setStatus(text) { if (ui.status) ui.status.innerHTML = text; }
    function setProgress(pct) { if (ui.progressBar) ui.progressBar.style.width = pct + '%'; }

    /* ------------------ dung UI (nguyen ban tu trace) ------------------ */
    function buildUI() {
        var root = $(ROOT_ID);
        if (root) return;   // trong trace: lan dau getElementById tra null -> tao moi
        GM_addStyle(CSS);
        root = document.createElement('div');
        root.id = ROOT_ID;
        root.innerHTML = UI_HTML;
        document.body.appendChild(root);

        ui.root        = root;
        ui.stage       = root.querySelector('#bv-stage-3d');
        ui.status      = root.querySelector('#bv-status');
        ui.metaMode    = root.querySelector('#bv-meta-mode');
        ui.metaKw      = root.querySelector('#bv-meta-kw');
        ui.img         = root.querySelector('#bv-img');
        ui.progressBar = root.querySelector('#bv-progress-bar');
        ui.codeBadge   = root.querySelector('#bv-code-badge');
        ui.input       = root.querySelector('#bv-url-input');
        ui.startBtn    = root.querySelector('#bv-start-btn');
        ui.toggle      = root.querySelector('#bv-floating-toggle');
        ui.header      = root.querySelector('#bv-floating-header');

        ui.metaMode.textContent = mode;

        /* 3D tilt theo chuot (trace: mousemove + mouseleave tren stage) */
        ui.stage.addEventListener('mousemove', function (e) {
            var r = ui.stage.getBoundingClientRect();
            var dx = (e.clientX - r.left) / r.width - 0.5;
            var dy = (e.clientY - r.top) / r.height - 0.5;
            ui.stage.style.transform =
                'rotateY(' + (dx * 14 - 6).toFixed(2) + 'deg) rotateX(' + (4 - dy * 12).toFixed(2) + 'deg)';
        });
        ui.stage.addEventListener('mouseleave', function () {
            ui.stage.style.transform = 'rotateX(4deg) rotateY(-6deg)';
        });

        /* keo tha panel (trace: mousedown tren header + mouseup tren window) */
        var drag = null;
        ui.header.addEventListener('mousedown', function (e) {
            var r = root.getBoundingClientRect();
            drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
            e.preventDefault();
        });
        window.addEventListener('mousemove', function (e) {
            if (!drag) return;
            root.style.left = (e.clientX - drag.dx) + 'px';
            root.style.top  = (e.clientY - drag.dy) + 'px';
            root.style.bottom = 'auto';
            root.style.right  = 'auto';
        });
        window.addEventListener('mouseup', function () { drag = null; });

        /* thu gon / mo rong */
        ui.toggle.addEventListener('click', function () {
            collapsed = !collapsed;
            var bodyEl = root.querySelector('#bv-floating-body');
            if (bodyEl) bodyEl.style.display = collapsed ? 'none' : 'block';
            ui.toggle.textContent = collapsed ? '+' : '-';
        });

        /* nut chinh */
        ui.startBtn.addEventListener('click', function () { startBypass(true); });

        setStatus('Dang khoi tao...');
    }

    /* ------------------ tim ma / link trong trang ------------------ *
     * [INFERRED] — JSVMP khong de lai selector cua trang trong trace sandbox
     * (trang that co cau truc rieng). Chien luoc tong quat theo dung thu tu
     * uu tien ma UI mo ta ("Tu dong lay ma 0s hoac nhap tay"):                */
    function autoFindCode() {
        // 1) ma trong URL hien tai (/go/<code> hoac ?code=...)
        var m = location.pathname.match(/\/(?:go|file)\/([^/?#]+)/);
        if (m) return decodeURIComponent(m[1]);
        var q = new URLSearchParams(location.search);
        return q.get('code') || q.get('c') || '';
    }

    function findContinueButton() {
        // [INFERRED] nut tiep tuc chuan cua shortlink: <a>/<button> chua text tiep tuc
        var cands = document.querySelectorAll('a[href], button');
        for (var i = 0; i < cands.length; i++) {
            var t = (cands[i].textContent || '').toLowerCase();
            if (/continue|tiep tuc|get link|vuot|nhan ma/.test(t)) return cands[i];
        }
        return null;
    }

    /* ------------------ luong chinh ------------------ */
    function startBypass(manual) {
        manualDone = !!manual;
        round++;
        if (round > MAX_ROUNDS) {
            setStatus('<span style="color:#f87171;">Loi: Nhiem vu hien tai can nhap Domain hoac Ma Code vao o ben duoi.</span>');
            return;
        }
        var input = (ui.input.value || '').trim();
        var code = input || autoFindCode();
        if (!code) {
            /* xoay nhiem vu — thong diep nguyen ban tu trace */
            var wait = 0;
            setStatus('Dang xoay nhiem vu ' + wait + 's (lan ' + round + '/' + MAX_ROUNDS + ')...');
            var rot = setInterval(function () {
                wait++;
                setStatus('Dang xoay nhiem vu ' + wait + 's (lan ' + round + '/' + MAX_ROUNDS + ')...');
                if (wait >= 3) {
                    clearInterval(rot);
                    startBypass(false);
                }
            }, STEP_MS);
            return;
        }

        ui.codeBadge.textContent = 'Ma: ' + code;
        secondsLeft = 0;
        setStatus('Dang tu dong vuot link BBMKTS (' + secondsLeft + ' giay)...');
        ui.startBtn.textContent = 'Vuot Link Ngay (' + secondsLeft + 's)';

        /* dem nguoc — nhip 300 ms nhu trace */
        var timer = setInterval(function () {
            if (manualDone) { clearInterval(timer); return; }
            secondsLeft++;
            setStatus('Dang tu dong vuot link BBMKTS (' + secondsLeft + ' giay)...');
            ui.startBtn.textContent = 'Vuot Link Ngay (' + secondsLeft + 's)';
            setProgress(Math.min(100, secondsLeft * 5));
        }, STEP_MS);

        var btn = findContinueButton();   // [INFERRED]
        if (btn) btn.click();
    }

    /* ------------------ quang cheo layma.net (bat duoc trong trace) ------- */
    try { fetch(PROMO_URL).catch(function () {}); } catch (e) {}

    /* ------------------ khoi dong ------------------ */
    function init() {
        if (document.body) buildUI();
        else setTimeout(init, STEP_MS);
    }
    init();
})();
