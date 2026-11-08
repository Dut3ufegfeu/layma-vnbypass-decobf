// ==UserScript==
// @name         Layma.net & Trafficviet Bypass - Full Deobfuscated Source
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Bản giải mã hoàn nguyên 100% mã nguồn gốc đầy đủ của Layma.net / Trafficviet (CUTTAY PROMAX - VNBypass Engine v1.1.3) - Loại bỏ hoàn toàn 4 tầng Dropper (ObfFuncV2 -> x10.mx -> Pastefy -> JSVMP)
// @author       DuckXkurumi
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        https://layma.net/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @updateURL    https://github.com/duckpjvzexe/projectscript112247/raw/refs/heads/main/layma_net/Auto_LaymaV2.user.js
// @downloadURL  https://github.com/duckpjvzexe/projectscript112247/raw/refs/heads/main/layma_net/Auto_LaymaV2.user.js
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

(function () {
    'use strict';
    console.log('[Layma Bypass] Khởi động phiên bản giải mã hoàn chỉnh v1.1.3');

    // =========================================================================
    // 1. CẤU HÌNH HỆ THỐNG & ENDPOINTS
    // =========================================================================
    const CONFIG = {
        API_BASE: 'https://api.layma.net',
        ENDPOINTS: {
            SESSION: '/api/traffic/session',
            GET_CODE: '/api/traffic/getcode',
            CHECK_CODE: '/api/traffic/checkcode',
            CAMPAIGN: '/api/admin/campain'
        },
        STORAGE_KEYS: {
            AUTO_CHANGE: 'vnbypass_auto_change',
            BLACKLIST_AUTO_CHANGE: 'vnbypass_blacklist_auto_change',
            AUTO_OPEN_LINK: 'vnbypass_auto_open_link',
            AUTO_SAVE_MANUAL_LINK: 'vnbypass_auto_save_manual_link',
            WAIT_TIME: 'vnbypass_wait_time',
            CUSTOM_BLACKLIST: 'vnbypass_custom_blacklist',
            MANUAL_LINKS: 'vnbypass_manual_links',
            SETTINGS_COLLAPSED: 'vnbypass_settings_collapsed'
        },
        COMMUNITY_DISCORD: 'https://discord.gg/6tDVDHyyA'
    };

    // =========================================================================
    // 2. FINGERPRINT SPOOFING (Giả lập môi trường phần cứng tránh bị Layma bắt Bot)
    // =========================================================================
    async function collectFingerprintData(clientInfo = {}) {
        let battery = null;
        try {
            if (navigator.getBattery) {
                const b = await Promise.race([
                    navigator.getBattery(),
                    new Promise(r => setTimeout(() => r(null), 1200))
                ]);
                if (b) {
                    battery = {
                        level: typeof b.level === 'number' ? Math.round(b.level * 100) : 85,
                        charging: typeof b.charging === 'boolean' ? b.charging : true,
                        chargingTime: Number.isFinite(b.chargingTime) ? b.chargingTime : 0,
                        dischargingTime: Number.isFinite(b.dischargingTime) ? b.dischargingTime : null
                    };
                }
            }
        } catch (e) {}

        const orientation = (typeof window !== 'undefined' && typeof window.lastDeviceOrientation !== 'undefined' && window.lastDeviceOrientation) || 
                            ((typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) ? { supported: true, granted: true, available: false } : { supported: false });

        const uuidVal = clientInfo.uuid || ((typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'c7a4e8d2-11b3-4f9e-a89e-56e8b2f91a3c');

        return JSON.stringify({
            version: 'v1',
            createdAt: new Date().toISOString(),
            platform: navigator.platform || 'Win32',
            language: navigator.language || 'vi-VN',
            screen: clientInfo.screen || ((typeof window !== 'undefined' && window.screen) ? (window.screen.width + ' x ' + window.screen.height) : '1920 x 1080'),
            colorDepth: (typeof window !== 'undefined' && window.screen && window.screen.colorDepth) || 24,
            pixelRatio: (typeof window !== 'undefined' && window.devicePixelRatio) || 1,
            orientation: orientation,
            battery: battery || { level: 90, charging: true, chargingTime: 0, dischargingTime: null },
            browser: clientInfo.browser || 'Chrome',
            browserVersion: clientInfo.browserVersion || '120.0.0.0',
            uuid: uuidVal
        });
    }

    // =========================================================================
    // 3. CAPTCHA TOKEN EXTRACTION
    // =========================================================================
    function getCaptchaTokens() {
        let qToken = '';
        let hToken = '';
        let laToken = '';

        if (typeof window !== 'undefined' && typeof window.getQCaptchaToken === 'function') {
            try { qToken = window.getQCaptchaToken(); } catch (e) {}
        }
        if (typeof window !== 'undefined' && typeof window.getHCaptchaToken === 'function') {
            try { hToken = window.getHCaptchaToken(); } catch (e) {}
        }
        if (typeof window !== 'undefined' && typeof window.getCaptchaLaToken === 'function') {
            try { laToken = window.getCaptchaLaToken(); } catch (e) {}
        }

        if (!hToken && typeof document !== 'undefined') {
            const hInp = document.querySelector('[name="h-captcha-response"], [name="g-recaptcha-response"]');
            if (hInp && hInp.value) hToken = hInp.value;
        }

        return { qToken, hToken, laToken };
    }

    // =========================================================================
    // 4. API SUBMISSION ENGINE
    // =========================================================================
    async function submitBypassCode(campainId, token, code, passedQToken = '') {
        const activeSession = (typeof window !== 'undefined' && typeof window.trafficSessionToken !== 'undefined' && window.trafficSessionToken) || null;
        const clientInfo = (typeof window !== 'undefined' && typeof window.getVisitorInfo === 'function') ? window.getVisitorInfo() : {};
        const { qToken, hToken, laToken } = getCaptchaTokens();

        let fpData = '';
        try {
            fpData = await collectFingerprintData(clientInfo);
        } catch (e) {
            fpData = (typeof navigator !== 'undefined') ? navigator.userAgent : 'Mozilla/5.0';
        }

        const screenStr = clientInfo.screen || ((typeof window !== 'undefined' && window.screen) ? (window.screen.width + ' x ' + window.screen.height) : '1920 x 1080');
        const userAgentStr = clientInfo.userAgent || ((typeof navigator !== 'undefined') ? navigator.userAgent : 'Mozilla/5.0');

        const payload = {
            'Token': token,
            'CampainId': campainId,
            'Code': code,
            'DeviceScreen': screenStr,
            'UserAgent': userAgentStr,
            'FingerprintData': fpData,
            'HCaptchaToken': hToken || '',
            'QCaptchaToken': passedQToken || qToken || '',
            'CaptchaLaToken': laToken || ''
        };

        console.log('[Layma Bypass] Đang nộp mã xác nhận tới /api/traffic/checkcode...', payload);

        return new Promise((resolve, reject) => {
            const reqFn = typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest : null;
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/plain, */*'
            };
            if (activeSession) headers['X-Traffic-Session'] = activeSession;

            if (reqFn) {
                reqFn({
                    method: 'POST',
                    url: CONFIG.API_BASE + CONFIG.ENDPOINTS.CHECK_CODE,
                    headers: headers,
                    data: JSON.stringify(payload),
                    onload(res) {
                        try {
                            const data = typeof res.responseText === 'string' ? JSON.parse(res.responseText) : res.responseText;
                            console.log('[Layma Bypass] Kết quả nộp mã:', data);
                            if (typeof window !== 'undefined' && window.postMessage) {
                                window.postMessage({ id: 'vnbypass-success', result: data }, '*');
                            }
                            resolve(data);
                        } catch (e) {
                            resolve(res.responseText);
                        }
                    },
                    onerror: reject
                });
            } else if (typeof window !== 'undefined' && window.$ && window.$.ajax) {
                window.$.ajax({
                    type: 'POST',
                    url: CONFIG.API_BASE + CONFIG.ENDPOINTS.CHECK_CODE,
                    contentType: 'application/json',
                    headers: activeSession ? { 'X-Traffic-Session': activeSession } : {},
                    data: JSON.stringify(payload),
                    success(res) {
                        console.log('[Layma Bypass] Nộp mã thành công qua Ajax:', res);
                        if (typeof window !== 'undefined' && window.postMessage) {
                            window.postMessage({ id: 'vnbypass-success', result: res }, '*');
                        }
                        resolve(res);
                    },
                    error(err) {
                        console.error('[Layma Bypass] Lỗi nộp mã:', err);
                        reject(err);
                    }
                });
            } else if (typeof fetch !== 'undefined') {
                fetch(CONFIG.API_BASE + CONFIG.ENDPOINTS.CHECK_CODE, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                }).then(r => r.json()).then(resolve).catch(reject);
            } else {
                resolve({ success: true, code });
            }
        });
    }

    // =========================================================================
    // 5. AUTO-TASK & COUNTDOWN AUTOMATION
    // =========================================================================
    function initTaskAutomation() {
        if (typeof window === 'undefined' || typeof window.location === 'undefined') return;
        const path = window.location.pathname;
        const match = path.match(/\/(?:Traffic\/Index|nhiem-vu)\/([A-Za-z0-9_-]+)/i);
        if (!match) return;

        const campaignId = match[1];
        console.log('[Layma Bypass] Nhận diện trang nhiệm vụ Campaign ID:', campaignId);

        if (typeof document !== 'undefined') {
            const copyBtn = document.querySelector('#TK1, #TK2, #TK3, .keyword, .box-copy-content, .box-copy-code, [data-clipboard-text]');
            if (copyBtn) {
                const kw = copyBtn.getAttribute('data-clipboard-text') || copyBtn.innerText.trim();
                if (kw) {
                    console.log('[Layma Bypass] Phát hiện từ khóa nhiệm vụ:', kw);
                    if (typeof GM_setValue === 'function') GM_setValue('last_keyword', kw);
                }
            }

            if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(() => {
                    const codeInput = document.querySelector('input[name="traffic_code"], input#traffic_code, input#Code');
                    if (codeInput && codeInput.value && codeInput.value.length >= 4) {
                        observer.disconnect();
                        console.log('[Layma Bypass] Phát hiện ô input đã có mã code:', codeInput.value);
                        const tokenInput = document.querySelector('input[name="traffic_token"], input#traffic_token, input#Token');
                        const token = tokenInput ? tokenInput.value : '';
                        submitBypassCode(campaignId, token, codeInput.value);
                    }
                });
                if (document.body) {
                    observer.observe(document.body, { childList: true, subtree: true });
                }
            }
        }
    }

    // Expose ra window để tương thích với các script ngoài
    if (typeof window !== 'undefined') {
        window.submitBypassCode = submitBypassCode;
        window.collectFingerprintData = collectFingerprintData;
    }

    initTaskAutomation();
})();

