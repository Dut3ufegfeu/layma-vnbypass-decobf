// ==UserScript==
// @name         Layma.net Bypass (Deobfuscated)
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  Bản giải mã sạch logic bypass Layma.net từ VNBypass v1.1.3
// @author       VNBypass (Deobfuscated by Community)
// @match        https://layma.net/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    console.log('[Layma Bypass] Script đã được giải mã và nạp thành công');

    // 1. Giả lập thông tin thiết bị (Fingerprint Spoofing)
    async function collectFingerprintData(clientInfo) {
        var battery = null;
        try {
            if (navigator.getBattery) {
                var b = await Promise.race([
                    navigator.getBattery(), 
                    new Promise(r => setTimeout(() => r(null), 1200))
                ]);
                if (b) {
                    battery = {
                        level: typeof b.level === 'number' ? Math.round(b.level * 100) : null,
                        charging: typeof b.charging === 'boolean' ? b.charging : null,
                        chargingTime: Number.isFinite(b.chargingTime) ? b.chargingTime : null,
                        dischargingTime: Number.isFinite(b.dischargingTime) ? b.dischargingTime : null
                    };
                }
            }
        } catch (e) {}

        var orientation = (typeof lastDeviceOrientation !== 'undefined' && lastDeviceOrientation) || 
                          (('DeviceOrientationEvent' in window) ? { supported: true, granted: true, available: false } : { supported: false });

        return JSON.stringify({
            version: 'v1',
            createdAt: new Date().toISOString(),
            platform: navigator.platform || null,
            language: navigator.language || null,
            screen: clientInfo.screen || (window.screen.width + ' x ' + window.screen.height),
            colorDepth: (window.screen && window.screen.colorDepth) || null,
            pixelRatio: window.devicePixelRatio || null,
            orientation: orientation,
            battery: battery,
            browser: clientInfo.browser || null,
            browserVersion: clientInfo.browserVersion || null,
            uuid: clientInfo.uuid || null
        });
    }

    // 2. Gửi request nộp mã xác thực lên hệ thống Layma
    async function submitBypassCode(campainId, token, code, passedQToken) {
        var activeSession = (typeof trafficSessionToken !== 'undefined' && trafficSessionToken) || null;
        var clientInfo = typeof getVisitorInfo === 'function' ? getVisitorInfo() : {};
        var fpData = '';

        try {
            fpData = await collectFingerprintData(clientInfo);
        } catch (e) {
            fpData = navigator.userAgent;
        }

        var pData = {
            "Token": token,
            "CampainId": campainId,
            "Code": code,
            "DeviceScreen": clientInfo.screen || (window.screen.width + ' x ' + window.screen.height),
            "UserAgent": clientInfo.userAgent || navigator.userAgent,
            "FingerprintData": fpData,
            "HCaptchaToken": typeof getHCaptchaToken === 'function' ? getHCaptchaToken() : "",
            "QCaptchaToken": passedQToken || (typeof getQCaptchaToken === 'function' ? getQCaptchaToken() : ""),
            "CaptchaLaToken": typeof getCaptchaLaToken === 'function' ? getCaptchaLaToken() : ""
        };

        console.log('[LAYMA] POST /api/traffic/checkcode payload', Object.assign({}, pData, { Token: '***', FingerprintData: '[present]' }));

        $.ajax({
            type: 'POST',
            url: 'https://api.layma.net/api/traffic/checkcode',
            contentType: 'application/json',
            headers: activeSession ? { 'X-Traffic-Session': activeSession } : {},
            data: JSON.stringify(pData),
            success: function(res) {
                console.log('[LAYMA] /api/traffic/checkcode response', res);
                window.postMessage({ id: "vnbypass-success", result: res }, "*");
            },
            error: function(err) {
                console.error('[LAYMA] /api/traffic/checkcode error', { status: err.status, response: err.responseText });
            }
        });
    }

    window.submitBypassCode = submitBypassCode;
})();
