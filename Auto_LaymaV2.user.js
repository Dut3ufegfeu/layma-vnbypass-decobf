// ==UserScript==
// @name         VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)
// @namespace    local.reconstruction.layma
// @version      1.1.3
// @description  Bản giải mã sạch hoàn nguyên 100% logic VNBypass v1.1.3 trên Layma.net - Tái thiết kiến trúc sạch chuẩn theo mô hình Link4m: Shadow/Inline UI, Fingerprint Spoofing, Blacklist Engine, Auto Countdown & Checkcode API
// @author       Owner decobf: @tien_nood2 (<@1245646252905861190>) / DuckXkurumi
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        *://layma.net/*
// @match        *://*.layma.net/*
// @match        *://trafficviet.com/*
// @match        *://*.trafficviet.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_info
// @run-at       document-end
// @updateURL    https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js
// @downloadURL  https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js
// ==/UserScript==

(() => {
    'use strict';

    if (window.__laymaDecobfLoaded) return;
    window.__laymaDecobfLoaded = true;

    console.log('[Layma Bypass] Khởi động phiên bản giải mã hoàn chỉnh v1.1.3 (decobf)');
    console.log('[Layma Bypass] Owner decobf: @tien_nood2 (<@1245646252905861190>)');

    // =========================================================================
    // 1. CẤU HÌNH HỆ THỐNG & ENDPOINTS (Áp dụng kiến trúc Clean Source)
    // =========================================================================
    const CONFIG = Object.freeze({
        apiBase: 'https://api.layma.net',
        endpoints: {
            session: '/api/traffic/session',
            getCode: '/api/traffic/getcode',
            checkCode: '/api/traffic/checkcode',
            campaign: '/api/admin/campain'
        },
        storageKeys: {
            autoChange: 'vnbypass_auto_change',
            blacklistAutoChange: 'vnbypass_blacklist_auto_change',
            autoOpenLink: 'vnbypass_auto_open_link',
            autoSaveManualLink: 'vnbypass_auto_save_manual_link',
            waitTime: 'vnbypass_wait_time',
            customBlacklist: 'vnbypass_custom_blacklist',
            manualLinks: 'vnbypass_manual_links',
            settingsCollapsed: 'vnbypass_settings_collapsed'
        },
        communityDiscord: 'https://discord.gg/6tDVDHyyA',
        defaultBlacklist: [
            'dealevolution.io', 'www.dealevolution.io', 'matlamafc.com',
            'silverspoonentp.in', 'www.silverspoonentp.in', 'sunwinkt.com',
            'sunwinvv.com', 'sunwinmb.com', 'sunwinbv.com', 'cherrylift.co',
            'ziaventures.co', 'www.ziaventures.co', 'agilafc.com', 'www.agilafc.com',
            'kingstonsteelalloys.in', 'www.kingstonsteelalloys.in', 'annetlibeau.co',
            'perspektivaes.in.net', 'sunwin.perspektivaes.in.net', 'goldfame.co.in',
            'sunwin.goldfame.co.in', 'go88yt.com', 'go88gh.com', 'emitur.com.co', 'www.emitur.com.co'
        ]
    });

    const state = {
        busy: false,
        campaignId: '',
        token: '',
        sessionToken: '',
        visitTicket: '',
        domain: '',
        countdownSeconds: 85,
        countdownTimer: null
    };

    // Quản lý cấu hình Settings trong localStorage
    const Settings = {
        get autoChange() { return localStorage.getItem(CONFIG.storageKeys.autoChange) === 'true'; },
        set autoChange(v) { localStorage.setItem(CONFIG.storageKeys.autoChange, v ? 'true' : 'false'); },

        get blacklistAutoChange() { return localStorage.getItem(CONFIG.storageKeys.blacklistAutoChange) !== 'false'; },
        set blacklistAutoChange(v) { localStorage.setItem(CONFIG.storageKeys.blacklistAutoChange, v ? 'true' : 'false'); },

        get autoOpenLink() { return localStorage.getItem(CONFIG.storageKeys.autoOpenLink) === 'true'; },
        set autoOpenLink(v) { localStorage.setItem(CONFIG.storageKeys.autoOpenLink, v ? 'true' : 'false'); },

        get autoSaveManual() { return localStorage.getItem(CONFIG.storageKeys.autoSaveManualLink) === 'true'; },
        set autoSaveManual(v) { localStorage.setItem(CONFIG.storageKeys.autoSaveManualLink, v ? 'true' : 'false'); },

        get waitTime() { return parseInt(localStorage.getItem(CONFIG.storageKeys.waitTime) || '85', 10); },
        set waitTime(v) { localStorage.setItem(CONFIG.storageKeys.waitTime, String(v)); },

        get isCollapsed() { return localStorage.getItem(CONFIG.storageKeys.settingsCollapsed) === 'true'; },
        set isCollapsed(v) { localStorage.setItem(CONFIG.storageKeys.settingsCollapsed, v ? 'true' : 'false'); }
    };

    // =========================================================================
    // 2. NETWORK REQUEST ENGINE (Tương thích GM_xmlhttpRequest & fetch)
    // =========================================================================
    function request(url, { method = 'GET', headers = {}, data = null, timeout = 25000 } = {}) {
        const reqFn = typeof GM !== 'undefined' && typeof GM.xmlHttpRequest === 'function'
            ? GM.xmlHttpRequest.bind(GM)
            : typeof GM_xmlhttpRequest === 'function' ? GM_xmlhttpRequest : null;

        return new Promise((resolve, reject) => {
            if (reqFn) {
                reqFn({
                    method,
                    url,
                    headers: { 'Accept': 'application/json, text/plain, */*', ...headers },
                    data,
                    timeout,
                    onload(res) {
                        try {
                            const parsed = typeof res.responseText === 'string' ? JSON.parse(res.responseText) : res.responseText;
                            resolve({ status: res.status, data: parsed, raw: res.responseText });
                        } catch (e) {
                            resolve({ status: res.status, data: null, raw: res.responseText });
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('Request timeout'))
                });
            } else if (typeof fetch !== 'undefined') {
                fetch(url, {
                    method,
                    headers: { 'Accept': 'application/json, text/plain, */*', ...headers },
                    body: data
                })
                    .then(async r => {
                        const raw = await r.text();
                        try { return { status: r.status, data: JSON.parse(raw), raw }; }
                        catch (e) { return { status: r.status, data: null, raw }; }
                    })
                    .then(resolve)
                    .catch(reject);
            } else {
                reject(new Error('Không có HTTP client hợp lệ'));
            }
        });
    }

    // =========================================================================
    // 3. FINGERPRINT SPOOFING (Giả lập phần cứng thiết bị chống chặn Bot)
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

        return JSON.stringify({
            version: 'v1',
            createdAt: new Date().toISOString(),
            platform: navigator.platform || 'Win32',
            language: navigator.language || 'vi-VN',
            screen: clientInfo.screen || (window.screen.width + ' x ' + window.screen.height),
            colorDepth: (window.screen && window.screen.colorDepth) || 24,
            pixelRatio: window.devicePixelRatio || 1,
            orientation: orientation,
            battery: battery || { level: 90, charging: true, chargingTime: 0, dischargingTime: null },
            browser: clientInfo.browser || 'Chrome',
            browserVersion: clientInfo.browserVersion || '120.0.0.0',
            uuid: clientInfo.uuid || (crypto.randomUUID ? crypto.randomUUID() : 'c7a4e8d2-11b3-4f9e-a89e-56e8b2f91a3c')
        });
    }

    // =========================================================================
    // 4. CAPTCHA TOKEN EXTRACTION
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
    // 5. STYLESHEET CHO GIAO DIỆN VNBYPASS (CSS ĐẦY ĐỦ)
    // =========================================================================
    function injectStyles() {
        if (document.getElementById('vnbypass-clean-style')) return;
        const style = document.createElement('style');
        style.id = 'vnbypass-clean-style';
        style.textContent = `
            @keyframes shimmerEffect {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            #vnbypass-wrapper {
                width: 100%;
                max-width: 660px;
                margin: 0 auto 20px auto;
                display: flex;
                flex-direction: column;
                gap: 16px;
                font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .fancy-top-header {
                margin: 0 0 4px 0;
                padding: 14px 18px;
                background: #eff6ff;
                border-radius: 10px;
                text-align: center;
                border: 1px solid #bfdbfe;
                box-shadow: 0 4px 15px rgba(2, 132, 199, 0.16);
            }
            .vnbypass-title {
                display: block;
                color: #2563eb;
                font-size: clamp(23px, 6vw, 30px);
                font-weight: 900;
                letter-spacing: 1px;
                line-height: 1.3;
                background: linear-gradient(90deg, #2563eb, #9333ea, #db2777, #0891b2, #2563eb);
                background-size: 300% auto;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                animation: shimmerEffect 4s linear infinite;
            }
            .vnbypass-title::after {
                content: " ✦";
                -webkit-text-fill-color: #f59e0b;
                color: #f59e0b;
                font-size: 0.7em;
                vertical-align: super;
            }
            .vnbypass-discord {
                display: inline-block;
                margin-top: 4px;
                color: #5865f2;
                font-weight: 700;
                text-decoration: none;
                font-size: 14px;
            }
            .vnbypass-discord:hover {
                text-decoration: underline;
            }
            .vnbypass-intro {
                margin-top: 4px;
                color: #475569;
                font-size: 12px;
                line-height: 1.4;
            }
            .switch {
                position: relative;
                display: inline-block;
                width: 38px;
                height: 22px;
            }
            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }
            .slider {
                position: absolute;
                cursor: pointer;
                top: 0; left: 0; right: 0; bottom: 0;
                background-color: #cbd5e1;
                transition: .3s;
                border-radius: 22px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .3s;
                border-radius: 50%;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            }
            input:checked + .slider {
                background-color: #d97706;
            }
            input:checked + .slider:before {
                transform: translateX(16px);
            }
            .btn-manual {
                width: 100%;
                padding: 10px 14px;
                border-radius: 6px;
                font-weight: 700;
                font-size: 14px;
                cursor: pointer;
                border: none;
                transition: background .2s, opacity .2s;
            }
            .btn-manual-primary {
                background: #2563eb;
                color: #ffffff;
            }
            .btn-manual-primary:hover {
                background: #1d4ed8;
            }
            .btn-manual-danger {
                background: #dc2626;
                color: #ffffff;
                margin-top: 10px;
            }
            .btn-manual-danger:hover {
                background: #b91c1c;
            }
        `;
        document.head.appendChild(style);
    }

    // =========================================================================
    // 6. XÂY DỰNG GIAO DIỆN ĐẦY ĐỦ TRÊN TRANG (HEADER + CÀI ĐẶT + FORM THỦ CÔNG)
    // =========================================================================
    function renderVNBypassUI() {
        if (document.getElementById('vnbypass-wrapper')) return;

        const targetContainer = document.querySelector('main#guide') || document.querySelector('.box-step-wrap') || document.querySelector('main') || document.body;
        if (!targetContainer) return;

        injectStyles();

        const wrapper = document.createElement('div');
        wrapper.id = 'vnbypass-wrapper';

        const isCollapsed = Settings.isCollapsed;
        wrapper.innerHTML = `
            <div class="fancy-top-header" id="native-override-top-header">
                <span class="vnbypass-title">VNBYPASS.COM - V1.1.3 (decobf)</span>
                <a class="vnbypass-discord" href="${CONFIG.communityDiscord}" target="_blank" rel="noopener noreferrer">Tham gia Discord (discord.gg/6tDVDHyyA)</a>
                <div class="vnbypass-intro">Cộng Đồng Chia Sẻ Và Hỗ Trợ Nhanh, Tool Bypass Link VN Siêu Nhanh</div>
            </div>

            <!-- Khung Cài đặt Bypass -->
            <div id="native-override-settings" style="margin-bottom: 0px; padding: 12px 16px; background:#fffbeb; border:1px solid #fde68a; border-radius:10px; box-shadow:0 2px 10px rgba(217,119,6,0.1);">
                <div id="settings-header-toggle" style="display: flex; align-items: center; justify-content: space-between; cursor: pointer;">
                    <div style="font-weight: 700; color: #d97706; font-size: 15px; display: flex; align-items: center; gap: 8px;">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                        </svg>
                        <span>Cài đặt Bypass</span>
                    </div>
                    <div id="settings-toggle-btn" style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(217,119,6,0.12); border-radius: 6px;">
                        <span id="settings-toggle-text" style="font-size: 12px; color: #b45309; font-weight: 700;">${isCollapsed ? 'Hiện cài đặt' : 'Ẩn cài đặt'}</span>
                        <span id="settings-toggle-arrow" style="display: inline-block; transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); font-size: 11px; color: #b45309; transform: ${isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'};">&#9660;</span>
                    </div>
                </div>

                <div id="settings-body-collapse" style="overflow: hidden; transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease; max-height: ${isCollapsed ? '0px' : '600px'}; opacity: ${isCollapsed ? '0' : '1'}; margin-top: ${isCollapsed ? '0px' : '12px'}; display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="cursor: pointer; margin: 0; color: #92400e; font-weight: 600;">Đổi NV khi lỗi:</label>
                        <label class="switch"><input type="checkbox" id="toggle-auto-change" ${Settings.autoChange ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="cursor: pointer; margin: 0; color: #92400e; font-weight: 600;">Đổi NV blacklist:</label>
                        <label class="switch"><input type="checkbox" id="toggle-blacklist-auto-change" ${Settings.blacklistAutoChange ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="cursor: pointer; margin: 0; color: #92400e; font-weight: 600;">Mở link tự động:</label>
                        <label class="switch"><input type="checkbox" id="toggle-auto-open-link" ${Settings.autoOpenLink ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label style="cursor: pointer; margin: 0; color: #92400e; font-weight: 600;">Lưu link đã nhập:</label>
                        <label class="switch"><input type="checkbox" id="toggle-auto-save-manual-link" ${Settings.autoSaveManual ? 'checked' : ''}><span class="slider"></span></label>
                    </div>
                    <button type="button" id="show-manual-link-cache" style="border:0; padding:0; background:transparent; color:#b45309; cursor:pointer; text-align:left; font-size:11px; text-decoration:underline;">Xem link nhiệm vụ đã lưu</button>
                    <button type="button" id="show-blacklist-list" style="border:0; padding:0; background:transparent; color:#b45309; cursor:pointer; text-align:left; font-size:11px; text-decoration:underline;">Xem nhiệm vụ bị blacklist tại đây</button>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 4px;">
                        <div style="display: flex; flex-direction: column;">
                            <label for="input-wait-time" style="margin: 0; color: #92400e; font-weight: 600;">Thời gian chờ (giây):</label>
                            <span style="font-size: 11px; color: #b45309; font-style: italic;">(Khuyên dùng >70s để tránh bị cấm)</span>
                        </div>
                        <input type="number" id="input-wait-time" value="${Settings.waitTime}" style="width: 65px; padding: 4px; border: 1px solid #d97706; border-radius: 4px; text-align: center; font-weight: bold; color: #92400e;">
                    </div>
                </div>
            </div>

            <!-- Khung Form Nhiệm vụ Thủ công -->
            <div id="native-override-quest-form" style="padding: 16px; background:#fff; border:1px solid #fecaca; border-radius:10px; box-shadow:0 2px 10px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 12px;">
                <div style="padding: 10px 14px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
                    <div style="color: #c2410c; font-weight: bold; font-size: 14px;">Không lấy được link Quest tự động!</div>
                    <div style="color: #ea580c; font-size: 12px; margin-top: 2px;">Bạn có thể nhập thông tin nhiệm vụ thủ công để tiếp tục.</div>
                </div>

                <div>
                    <label style="display:block; font-weight:600; font-size:13px; color:#334155; margin-bottom:4px;">Link ảnh nhiệm vụ</label>
                    <input id="manual-quest-image-link" type="text" placeholder="https://..." readonly style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; background:#f1f5f9; color:#64748b; font-size:13px;">
                </div>

                <div>
                    <label style="display:block; font-weight:600; font-size:13px; color:#334155; margin-bottom:4px;">Từ khóa</label>
                    <input id="manual-quest-keyword" type="text" placeholder="Không có từ khóa" readonly style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; background:#f1f5f9; color:#64748b; font-size:13px;">
                </div>

                <div>
                    <label for="manual-quest-link" style="display:block; font-weight:600; font-size:13px; color:#334155; margin-bottom:4px;">Link Quest thủ công</label>
                    <input id="manual-quest-link" type="text" placeholder="https://..." style="width:100%; box-sizing:border-box; padding:8px 10px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;">
                </div>

                <div style="margin-top: 4px;">
                    <button type="button" id="btn-manual-quest" class="btn-manual btn-manual-primary">Tiếp tục với link này</button>
                    <button type="button" id="btn-manual-change-quest" class="btn-manual btn-manual-danger">Đổi nhiệm vụ</button>
                </div>
            </div>
        `;

        if (targetContainer.firstChild) {
            targetContainer.insertBefore(wrapper, targetContainer.firstChild);
        } else {
            targetContainer.appendChild(wrapper);
        }

        bindUIEvents();
        syncPageDataToUI();
    }

    function bindUIEvents() {
        const toggleHeader = document.getElementById('settings-header-toggle');
        const collapseBody = document.getElementById('settings-body-collapse');
        const toggleText = document.getElementById('settings-toggle-text');
        const toggleArrow = document.getElementById('settings-toggle-arrow');

        if (toggleHeader) {
            toggleHeader.onclick = () => {
                const nowCollapsed = !Settings.isCollapsed;
                Settings.isCollapsed = nowCollapsed;
                if (nowCollapsed) {
                    collapseBody.style.maxHeight = '0px';
                    collapseBody.style.opacity = '0';
                    collapseBody.style.marginTop = '0px';
                    toggleText.textContent = 'Hiện cài đặt';
                    toggleArrow.style.transform = 'rotate(-90deg)';
                } else {
                    collapseBody.style.maxHeight = '600px';
                    collapseBody.style.opacity = '1';
                    collapseBody.style.marginTop = '12px';
                    toggleText.textContent = 'Ẩn cài đặt';
                    toggleArrow.style.transform = 'rotate(0deg)';
                }
            };
        }

        const chkAutoChange = document.getElementById('toggle-auto-change');
        if (chkAutoChange) chkAutoChange.onchange = () => { Settings.autoChange = chkAutoChange.checked; };

        const chkBlacklist = document.getElementById('toggle-blacklist-auto-change');
        if (chkBlacklist) chkBlacklist.onchange = () => { Settings.blacklistAutoChange = chkBlacklist.checked; };

        const chkAutoOpen = document.getElementById('toggle-auto-open-link');
        if (chkAutoOpen) chkAutoOpen.onchange = () => { Settings.autoOpenLink = chkAutoOpen.checked; };

        const chkAutoSave = document.getElementById('toggle-auto-save-manual-link');
        if (chkAutoSave) chkAutoSave.onchange = () => { Settings.autoSaveManual = chkAutoSave.checked; };

        const inpWaitTime = document.getElementById('input-wait-time');
        if (inpWaitTime) inpWaitTime.onchange = () => { Settings.waitTime = parseInt(inpWaitTime.value, 10) || 85; };

        const btnManual = document.getElementById('btn-manual-quest');
        if (btnManual) {
            btnManual.onclick = () => {
                const manualUrl = (document.getElementById('manual-quest-link') || {}).value || '';
                if (!manualUrl) {
                    alert('Vui lòng nhập link Quest thủ công!');
                    return;
                }
                window.open(manualUrl, '_blank');
            };
        }

        const btnChange = document.getElementById('btn-manual-change-quest');
        if (btnChange) {
            btnChange.onclick = () => triggerChangeMission();
        }
    }

    function syncPageDataToUI() {
        const copyBtn = document.querySelector('#TK1, #TK2, #TK3, .keyword, .box-copy-content, .box-copy-code, [data-clipboard-text]');
        const kwInput = document.getElementById('manual-quest-keyword');
        if (copyBtn && kwInput) {
            const kw = copyBtn.getAttribute('data-clipboard-text') || copyBtn.innerText.trim();
            if (kw) kwInput.value = kw;
        }

        const imgEl = document.querySelector('img[src*="/uploads/"], img[src*="layma."], .box-step-wrap img');
        const imgInput = document.getElementById('manual-quest-image-link');
        if (imgEl && imgInput) {
            imgInput.value = imgEl.src;
        }
    }

    function triggerChangeMission() {
        const origBtn = document.querySelector('button[type="button"].btn-danger, .btn-change-quest, #btn-change-quest') ||
                        Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Đổi nhiệm vụ'));
        if (origBtn) origBtn.click();
        else window.location.reload();
    }

    // =========================================================================
    // 7. SUBMIT BYPASS CODE VỀ BACKEND /api/traffic/checkcode
    // =========================================================================
    async function submitBypassCode(campainId, token, code, passedQToken = '') {
        const activeSession = state.sessionToken || (typeof window.trafficSessionToken !== 'undefined' && window.trafficSessionToken) || null;
        const clientInfo = typeof window.getVisitorInfo === 'function' ? window.getVisitorInfo() : {};
        const { qToken, hToken, laToken } = getCaptchaTokens();

        let fpData = '';
        try { fpData = await collectFingerprintData(clientInfo); } catch (e) { fpData = navigator.userAgent; }

        const payload = {
            'Token': token,
            'CampainId': campainId,
            'Code': code,
            'DeviceScreen': clientInfo.screen || (window.screen.width + ' x ' + window.screen.height),
            'UserAgent': clientInfo.userAgent || navigator.userAgent,
            'FingerprintData': fpData,
            'HCaptchaToken': hToken || '',
            'QCaptchaToken': passedQToken || qToken || '',
            'CaptchaLaToken': laToken || ''
        };

        console.log('[Layma Bypass] Nộp mã lên backend /api/traffic/checkcode:', payload);

        const headers = { 'Content-Type': 'application/json' };
        if (activeSession) headers['X-Traffic-Session'] = activeSession;

        try {
            const res = await request(CONFIG.apiBase + CONFIG.endpoints.checkCode, {
                method: 'POST',
                headers,
                data: JSON.stringify(payload)
            });
            console.log('[Layma Bypass] Kết quả nộp mã:', res.data || res.raw);
            if (typeof window !== 'undefined' && window.postMessage) {
                window.postMessage({ id: 'vnbypass-success', result: res.data || res.raw }, '*');
            }
            return res.data;
        } catch (err) {
            console.error('[Layma Bypass] Lỗi nộp mã:', err);
            throw err;
        }
    }

    // =========================================================================
    // 8. KHỞI CHẠY HỆ THỐNG
    // =========================================================================
    function init() {
        renderVNBypassUI();

        // Tự động lắng nghe ô nhập mã để submit
        const observer = new MutationObserver(() => {
            const codeInput = document.querySelector('input[name="traffic_code"], input#traffic_code, input#Code, input[placeholder*="Nhập mã"], input#code');
            if (codeInput && codeInput.value && codeInput.value.length >= 4) {
                observer.disconnect();
                const path = window.location.pathname;
                const match = path.match(/\/(?:Traffic\/Index|nhiem-vu)\/([A-Za-z0-9_-]+)/i);
                const campaignId = match ? match[1] : (path.split('/').filter(Boolean)[0] || '');
                const tokenInput = document.querySelector('input[name="traffic_token"], input#traffic_token, input#Token, input[name="token"]');
                const token = tokenInput ? tokenInput.value : campaignId;
                submitBypassCode(campaignId, token, codeInput.value).catch(() => {});
            }
        });
        if (document.body) observer.observe(document.body, { childList: true, subtree: true });
    }

    window.submitBypassCode = submitBypassCode;
    window.collectFingerprintData = collectFingerprintData;

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init);
        window.addEventListener('load', init);
    }
})();
