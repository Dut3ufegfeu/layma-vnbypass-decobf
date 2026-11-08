# Layma.net Bypass - Deobfuscated Source Code

Dự án phân tích, bẻ khóa và giải mã (deobfuscate) 100% logic của Userscript:
**`VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)`** (nguyên bản từ repo `duckpjvzexe/projectscript112247`).

---

## 🚀 Cài đặt trực tiếp (Userscript)

Cài đặt bằng extension Tampermonkey / Violentmonkey trên trình duyệt:

- 🔗 **Bản chuẩn (Đã cập nhật giao diện & link Discord mới)**:
  [Cài đặt Auto_LaymaV2.user.js](https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js)
- 🔗 **Bản decobf**:
  [Cài đặt Auto_LaymaV2.decobf.user.js](https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.decobf.user.js)

---

## 🛠️ Các thay đổi quan trọng trong bản giải mã

1. **Đổi tên nhận diện**:
   - Tên script: `VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)`
   - Tiêu đề bảng điều khiển: `VNBYPASS.COM - V1.1.3 (decobf)`
2. **Cập nhật link Discord Server**:
   - Link server Discord chính thức: **`https://discord.gg/6tDVDHyyA`**
3. **Khôi phục 100% giao diện điều khiển (UI)**:
   - Header Shimmer Gradient: `VNBYPASS.COM - V1.1.3 (decobf)` kèm liên kết Discord.
   - Hộp **Cài đặt Bypass** (`#native-override-settings`): Nút ẩn/hiện cài đặt, 4 toggle switch (đổi NV khi lỗi, đổi blacklist, mở link tự động, lưu link thủ công), cấu hình thời gian chờ (`85s`).
   - Hộp **Nhiệm vụ thủ công** (`#native-override-quest-form`): Hỗ trợ nhập link ảnh, từ khóa, link quest và các nút điều hướng.
4. **Bypass Core & Bảo mật**:
   - Giả lập thông số phần cứng `FingerprintData` (màn hình, pin, cảm biến) chống hệ thống Layma phát hiện bot.
   - Trực tiếp tương tác với `/api/traffic/checkcode` mà không cần thông qua máy chủ trung gian `x10.mx` hay loader bên ngoài.

---

## 📂 Danh sách tệp tin trong repository

| Tệp tin | Mô tả |
| :--- | :--- |
| `Auto_LaymaV2.user.js` | Userscript hoàn chỉnh trực tiếp cho Tampermonkey (đã cập nhật link Discord và tên decobf). |
| `Auto_LaymaV2.decobf.user.js` | Phiên bản deobfuscate đầy đủ độc lập. |
| `Auto_LaymaV2.full.deobf.user.js` | Phiên bản chi tiết giải mã đầy đủ UI và Fingerprint. |
| `ObfFuncV2_deobfuscated.js` | Tầng 1 sau khi bẻ khóa chuỗi RC4 và loại bỏ debugger. |
| `layma_stage2_deobfuscated.js` | Tầng 2 (tải từ host x10.mx) sau khi giải mã Bytecode VM. |
| `vnbypass_core_extracted.js` | Logic cốt lõi bóc tách từ tầng JSVMP cuối cùng. |
