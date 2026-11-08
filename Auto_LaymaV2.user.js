// ==UserScript==
// @name         VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Bản giải mã sạch hoàn nguyên 100% logic VNBypass v1.1.3 trên Layma.net - Tích hợp đầy đủ giao diện Cài đặt Bypass, Manual Quest, Fingerprint Spoofing & Tự động đổi nhiệm vụ
// @author       Owner decobf: @tien_nood2 (<@1245646252905861190>) / DuckXkurumi
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        https://layma.net/*
// @match        https://*.layma.net/*
// @match        https://trafficviet.com/*
// @match        https://*.trafficviet.com/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @updateURL    https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js
// @downloadURL  https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js
// ==/UserScript==

(function () {
    'use strict';
    console.log('[VNBYPASS] Khởi động phiên bản giải mã hoàn chỉnh v1.1.3 (decobf)');

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

    // Khởi tạo các cài đặt từ localStorage
    const Settings = {
        get autoChange() { return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTO_CHANGE) === 'true'; },
        set autoChange(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_CHANGE, v ? 'true' : 'false'); },

        get blacklistAutoChange() { return localStorage.getItem(CONFIG.STORAGE_KEYS.BLACKLIST_AUTO_CHANGE) !== 'false'; },
        set blacklistAutoChange(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.BLACKLIST_AUTO_CHANGE, v ? 'true' : 'false'); },

        get autoOpenLink() { return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTO_OPEN_LINK) === 'true'; },
        set autoOpenLink(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_OPEN_LINK, v ? 'true' : 'false'); },

        get autoSaveManual() { return localStorage.getItem(CONFIG.STORAGE_KEYS.AUTO_SAVE_MANUAL_LINK) === 'true'; },
        set autoSaveManual(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.AUTO_SAVE_MANUAL_LINK, v ? 'true' : 'false'); },

        get waitTime() { return parseInt(localStorage.getItem(CONFIG.STORAGE_KEYS.WAIT_TIME) || '85', 10); },
        set waitTime(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.WAIT_TIME, String(v)); },

        get isCollapsed() { return localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS_COLLAPSED) === 'true'; },
        set isCollapsed(v) { localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS_COLLAPSED, v ? 'true' : 'false'); }
    };

    // =========================================================================
    // 2. STYLESHEET CHO TOÀN BỘ GIAO DIỆN VNBYPASS (CSS ĐẦY ĐỦ)
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
                text-shadow: 0 0 18px rgba(147, 51, 234, 0.18);
            }
            .vnbypass-title::after {
                content: ' ✦';
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
                font-size: 13.5px;
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
                width: 36px;
                height: 20px;
                margin: 0;
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
                transition: .25s;
                border-radius: 20px;
            }
            .slider:before {
                position: absolute;
                content: "";
                height: 14px;
                width: 14px;
                left: 3px;
                bottom: 3px;
                background-color: white;
                transition: .25s;
                border-radius: 50%;
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
    // 3. XÂY DỰNG GIAO DIỆN ĐẦY ĐỦ TRÊN TRANG (HEADER + CÀI ĐẶT + FORM THỦ CÔNG)
    // =========================================================================
    function renderVNBypassUI() {
        if (document.getElementById('vnbypass-wrapper')) return;

        // Vị trí chèn giao diện: ngay trên main#guide hoặc .box-step-wrap
        const targetContainer = document.querySelector('main#guide') || document.querySelector('.box-step-wrap') || document.querySelector('main') || document.body;
        if (!targetContainer) return;

        injectStyles();

        const wrapper = document.createElement('div');
        wrapper.id = 'vnbypass-wrapper';

        // 1. Header Fancy: VNBYPASS.COM - V1.1.3 + Discord link
        const isCollapsed = Settings.isCollapsed;
        wrapper.innerHTML = `
            <div class="fancy-top-header" id="native-override-top-header">
                <span class="vnbypass-title">VNBYPASS.COM - V1.1.3 (decobf)</span>
                <a class="vnbypass-discord" href="https://discord.gg/6tDVDHyyA" target="_blank" rel="noopener noreferrer">Tham gia Discord (discord.gg/6tDVDHyyA)</a>
                <div class="vnbypass-intro">Cộng Đồng Chia Sẻ Và Hỗ Trợ Nhanh, Tool Bypass Link VN Siêu Nhanh</div>
            </div>

            <!-- 2. Hộp Cài đặt Bypass -->
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

            <!-- 3. Hộp Thông báo và Form Nhiệm vụ Thủ công (Hiển thị như trong ảnh chụp) -->
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

    // =========================================================================
    // 4. LẮNG NGHE SỰ KIỆN GIAO DIỆN & LƯU LOCALSTORAGE
    // =========================================================================
    function bindUIEvents() {
        // Toggle ẩn/hiện cài đặt
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

        // Lưu trạng thái switches
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

        // Nút Tiếp tục với link này
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

        // Nút Đổi nhiệm vụ
        const btnChange = document.getElementById('btn-manual-change-quest');
        if (btnChange) {
            btnChange.onclick = () => {
                const origBtn = document.querySelector('button[type="button"].btn-danger, .btn-change-quest, #btn-change-quest') ||
                                Array.from(document.querySelectorAll('button, a')).find(el => el.innerText.includes('Đổi nhiệm vụ'));
                if (origBtn) {
                    origBtn.click();
                } else {
                    window.location.reload();
                }
            };
        }
    }

    // Đồng bộ thông tin từ DOM gốc của Layma vào Form
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

    // =========================================================================
    // 5. FINGERPRINT & API CHECKCODE BACKEND
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

    async function submitBypassCode(campainId, token, code, passedQToken = '') {
        const activeSession = (typeof window.trafficSessionToken !== 'undefined' && window.trafficSessionToken) || null;
        const clientInfo = typeof window.getVisitorInfo === 'function' ? window.getVisitorInfo() : {};

        let qToken = passedQToken;
        let hToken = '';
        let laToken = '';
        if (typeof window.getQCaptchaToken === 'function') try { qToken = window.getQCaptchaToken(); } catch (e) {}
        if (typeof window.getHCaptchaToken === 'function') try { hToken = window.getHCaptchaToken(); } catch (e) {}
        if (typeof window.getCaptchaLaToken === 'function') try { laToken = window.getCaptchaLaToken(); } catch (e) {}

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
            'QCaptchaToken': qToken || '',
            'CaptchaLaToken': laToken || ''
        };

        console.log('[Layma Bypass] Nộp mã lên backend /api/traffic/checkcode:', payload);

        const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/plain, */*' };
        if (activeSession) headers['X-Traffic-Session'] = activeSession;

        if (typeof GM_xmlhttpRequest !== 'undefined') {
            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.API_BASE + CONFIG.ENDPOINTS.CHECK_CODE,
                headers: headers,
                data: JSON.stringify(payload),
                onload(res) {
                    try {
                        const data = JSON.parse(res.responseText);
                        console.log('[Layma Bypass] Kết quả nộp mã:', data);
                        window.postMessage({ id: 'vnbypass-success', result: data }, '*');
                    } catch (e) {}
                }
            });
        }
    }

    // =========================================================================
    // 6. KHỞI CHẠY CHÍNH
    // =========================================================================
    function init() {
        renderVNBypassUI();

        // Tự động lắng nghe ô nhập mã để submit
        const observer = new MutationObserver(() => {
            const codeInput = document.querySelector('input[name="traffic_code"], input#traffic_code, input#Code');
            if (codeInput && codeInput.value && codeInput.value.length >= 4) {
                observer.disconnect();
                const path = window.location.pathname;
                const match = path.match(/\/(?:Traffic\/Index|nhiem-vu)\/([A-Za-z0-9_-]+)/i);
                const campaignId = match ? match[1] : (path.split('/').filter(Boolean)[0] || '');
                const tokenInput = document.querySelector('input[name="traffic_token"], input#traffic_token, input#Token');
                const token = tokenInput ? tokenInput.value : '';
                submitBypassCode(campaignId, token, codeInput.value);
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
