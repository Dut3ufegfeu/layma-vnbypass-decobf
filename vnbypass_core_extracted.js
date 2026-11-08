/**
 * vnbypass_core_extracted.js
 * 
 * Trích xuất toàn bộ cấu hình, bộ lưu trữ localStorage, API endpoints
 * từ tệp JSVMP (JavaScript Virtual Machine Protection) - 248 KB.
 */

// 1. Cấu hình VNBypass lưu trong localStorage
const VNBYPASS_STORAGE_KEYS = {
    AUTO_CHANGE: 'vnbypass_auto_change',                   // Tự đổi nhiệm vụ khi lỗi
    BLACKLIST_AUTO_CHANGE: 'vnbypass_blacklist_auto_change', // Bỏ qua trang trong blacklist
    AUTO_OPEN_LINK: 'vnbypass_auto_open_link',             // Tự động mở link tìm kiếm
    AUTO_SAVE_MANUAL_LINK: 'vnbypass_auto_save_manual_link',
    WAIT_TIME: 'vnbypass_wait_time',                       // Thời gian chờ lấy mã
    CUSTOM_BLACKLIST: 'vnbypass_custom_blacklist',
    MANUAL_LINKS: 'vnbypass_manual_links',
    SETTINGS_COLLAPSED: 'vnbypass_settings_collapsed'
};

// 2. Các API Endpoints của Layma & Traffic System
const ENDPOINTS = {
    LAYMA_API: 'https://api.layma.net',
    SESSION: '/api/traffic/session',                       // Khởi tạo session (header: X-Traffic-Session)
    GET_CODE: '/api/traffic/getcode',                      // Bắt đầu đếm ngược lấy mã
    CHECK_CODE: '/api/traffic/checkcode',                  // Nộp mã đã hoàn thành
    VISITOR_CHECK: '/api/traffic/visitor (checkcode)',
    ADMIN_CAMPAIGN: '/api/admin/campain'
};

// 3. Captcha Services tích hợp
const CAPTCHA_SERVICES = {
    QCAPTCHA_SIGNAL: 'qcaptcha/v1/signals',
    QCAPTCHA_HELPER: 'https://js.103-141-140-153.sslip.io/api.js',
    HCAPTCHA_API: 'https://js.hcaptcha.com/1/api.js?render=explicit',
    CAPTCHA_LA: 'CaptchaLaToken'
};

// 4. Các Selector DOM trên Layma.net
const SELECTORS = {
    GUIDE_WRAPPER: 'main#guide',
    BYPASS_WRAPPER: '#vnbypass-wrapper',
    COUNTDOWN_CLOCK: 'LayMaTrafficWaitClock',
    KEYWORD_BOX: '#TK1, #TK2, #TK3, .keyword, .box-copy-content, .box-copy-code, [data-clipboard-text]',
    QUEST_URL_MATCH: /layma\.net\/Traffic\/Index\/([A-Za-z0-9_-]+)/,
    TRAFFIC_KEY_MATCH: /data-traffic-key=['"]([^'"]+)['"]/
};

// 5. Thông tin tác giả & Cộng đồng tích hợp bên trong mã
const METADATA = {
    NAME: "VNBYPASS.COM",
    VERSION: "1.1.3",
    COMMUNITY_DISCORD: "https://discord.gg/6tDVDHyyA"
};

