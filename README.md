# Layma.net Bypass - Deobfuscated Source Code (v1.1.4)

> **Owner decobf**: `@tien_nood2` (`<@1245646252905861190>`)  
> **Hỗ trợ decobf**: `@hlounhh` (`<@1312674288775593984>`)

Dự án phân tích, bẻ khóa và giải mã (deobfuscate) 100% logic của Userscript:  
**`VNBYPASS.COM - Layma.net Bypass CUTTAY PROMAX (decobf)` phiên bản mới nhất v1.1.4** (nguyên bản từ `duckpjvzexe/projectscript112247`).

---

## 🚀 Cài đặt trực tiếp (Userscript v1.1.4)

Cài đặt bằng extension Tampermonkey / Violentmonkey trên trình duyệt:

- 🔗 **Bản chuẩn v1.1.4 (Giao diện đầy đủ, Auto QCaptcha Solver & Discord link mới)**:  
  [Cài đặt Auto_LaymaV2.user.js](https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.user.js)
- 🔗 **Bản decobf v1.1.4**:  
  [Cài đặt Auto_LaymaV2.decobf.user.js](https://github.com/Dut3ufegfeu/layma-vnbypass-decobf/raw/main/Auto_LaymaV2.decobf.user.js)

---

## 🛠️ Các tính năng cốt lõi trong bản giải mã v1.1.4

1. **Khôi phục 100% mã nguồn sạch độc lập (2.300+ dòng)**:
   - Loại bỏ hoàn toàn tầng mã hóa JSVMP và các loader trung gian (`duckxkrmproject.x10.mx`).
   - Tích hợp trực tiếp logic giải mã QCaptcha từ nguồn: `installSolverFromSource`, `getSolveQCaptchaNative`, `solveCaptchaWithLibrary`.
2. **Cấu hình & Đồng bộ máy chủ mới nhất**:
   - Nạp trực tiếp các cấu hình nhiệm vụ từ Pastefy (`TKphHBjA`, `ZR3kGQZp`, `HRqUIVrI`).
   - Cập nhật link máy chủ Discord chính thức: **`https://discord.gg/6tDVDHyyA`**.
   - Tiêu đề giao diện cập nhật chuẩn: **`VNBYPASS.COM - V1.1.4 (decobf)`**.
3. **Giao diện điều khiển chuyên nghiệp**:
   - Header Shimmer Gradient: `VNBYPASS.COM - V1.1.4 (decobf)`.
   - Bảng **Cài đặt Bypass** với 4 toggle switch (Đổi NV lỗi, Đổi NV blacklist, Mở link tự động, Lưu link thủ công), cấu hình thời gian chờ (`85s`).
   - Modal xem link đã lưu, Modal danh sách đen Blacklist, Form nhập nhiệm vụ thủ công khi không bắt được ảnh/từ khóa.
4. **Bypass Core & Tự động hóa**:
   - Đồng bộ Visitor UUID & Session Token qua `/api/traffic/session` và `/api/visitor/register`.
   - Bộ đếm ngược thời gian (`showCountdownBox`, `waitForCountdown`).
   - Tự động bắt mã hoặc nộp mã qua script chèn DOM an toàn (`buildCheckCodeScript`, `submitCode`).

---

## 📂 Danh mục tệp tin trong repository

| Tệp tin | Mô tả |
| :--- | :--- |
| `Auto_LaymaV2.user.js` | Userscript v1.1.4 chính thức cho Tampermonkey. |
| `Auto_LaymaV2.decobf.user.js` | Phiên bản deobfuscate v1.1.4 độc lập. |
| `Auto_LaymaV2.full.deobf.user.js` | Bản giải mã chi tiết đầy đủ 2.300+ dòng. |
| `ObfFuncV2_deobfuscated.js` | Tầng 1 sau khi bẻ khóa chuỗi RC4 và loại bỏ debugger. |
| `layma_stage2_deobfuscated.js` | Tầng 2 (tải từ host x10.mx) sau khi giải mã Bytecode VM. |
