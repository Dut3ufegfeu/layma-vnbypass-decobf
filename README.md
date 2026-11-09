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

---

## 🔬 Phân tích sâu 2026-11-09 (sandbox + AST) — website công khai

> 🌐 **Xem trực tuyến: [https://decobf.tienxpro.site](https://decobf.tienxpro.site)** — web viewer toàn bộ source, tải userscript, và bài viết chi tiết **logic mã hóa + cách decobf từng tầng**.

Kết quả phân tích độc lập bằng sandbox (không thực thi logic trên máy thật):

| Tầng | Nguồn | Bảo vệ | Trạng thái |
|---|---|---|---|
| 0 | `userscript.user.js` | — | nguyên bản 15 dòng header |
| 1 | `duckxkurumi.xyz/…/funcion.js` (64 KB) | obfuscator.io: string-array Base64+RC4, 125 wrapper offset, xoay mảng checksum, self-defending, debug-protection, tắt console | **deobf 100%** → chỉ còn loader fetch+eval |
| 2 | `duckxkrmproject.x10.mx/layma.js` (202 KB) | VM-lite: chuỗi TEA-16bit decrypt runtime, control-flow flatten, tên 2 ký tự | beautified + decode cục bộ |
| 3 | `pastefy.app/5dKBHbgv/raw` (197 KB) | như tầng 2 | beautified + decode cục bộ |
| 4 | `pastefy.app/6ZzLL87y/raw` (211 KB) | **JSVMP thật** — bytecode + interpreter, 0 chuỗi plain | beautified + **trace hành vi runtime** trong sandbox |

Hành vi tầng 4 (trace sandbox, DOM giả, chặn `process`/`require`): đọc API nội bộ của layma.net (`getQCaptchaToken`, `getTokenId`, `getCampainId`, `getVisitorInfo`, `getVisitorUUID`, `trafficSessionToken`, `AUTO_CHANGE_MISSION_ON_ERROR`…), inject `#vnbypass-wrapper` / `#vnbypass-clean-style`, dò `#qcaptcha-checkcode` + `#native-override-captcha-box` + `#native-override-button-box` → tự động hóa nhiệm vụ lấy mã / captcha qcaptcha.

📂 Thư mục mới:
- `analysis/` — toàn bộ artifact: src gốc khôi phục, bản decode đầy đủ, các tầng beautified, chuỗi đã giải mã, log sandbox, kèm `originals/` (bản gốc để đối chiếu).
- `tools/` — script deobfuscation dùng cho phân tích: `deob.js` (tầng 1), `deob2.js` (tầng 2/3), `run_sandbox.js` (tầng 4), `probe.js`.

## 🧬 Bản SELF-HOST (2026-11-09) — tác giả xóa link cũng không bay

`Auto_LaymaV2.selfhost.user.js` (733 KB) — sinh bởi `tools/build_selfhost.js`:

- **Nhúng nguyên vẹn 6 payload** vào chính file userscript: stage 2 (`x10.mx/layma.js`), stage 3 (`pastefy 5dKBHbgv`), stage 4 (`pastefy 6ZzLL87y`) + 3 paste cấu hình (`TKphHBjA`, `ZR3kGQZp`, `HRqUIVrI`).
- **Interceptor** đứng giữa `window.fetch` và `GM_xmlhttpRequest`: mọi request tới link của tác giả → trả về bản nhúng (không có mạng nào rời máy).
- Chuỗi loader gốc vẫn chạy đúng logic (fetch → eval từng tầng), chỉ là "nguồn" đã đổi thành bản nhúng.
- Bản mirror thường (không nhúng) nằm tại `mirror/` để đối chiếu / fallback.

Đã verify trong sandbox: chuỗi stage2 → stage3 → stage4 chạy **hoàn toàn offline**, stage 4 thực thi thật (inject `#vnbypass-wrapper`, dò `#qcaptcha-checkcode`…) với **0 request ra ngoài**.

3 lỗi đã gặp & cách xử lý khi build bản self-host (ghi lại để sau này tái sử dụng):
1. `'use strict'` của wrapper kế thừa vào `eval` → payload cần sloppy mode → bỏ strict, dùng indirect eval `(0,eval)`.
2. Node `vm.createContext(Proxy)` làm hỏng indirect eval trong sandbox kiểm thử (code eval không thấy props) → sandbox phải là plain object. *(Chỉ ảnh hưởng môi trường test, không ảnh hưởng Tampermonkey thật.)*

## 🚦 Thêm: TrafficViet & TrafficHub Bypasser v1.0.0 (2026-11-09)

Website giờ có **switcher chọn 1 trong 2 script** (Layma / Traffic) để không rối UI.

| | Layma.net Bypass | TrafficViet & TrafficHub Bypasser |
|---|---|---|
| Match | `layma.net` | `app.trafficviet.vn`, `system.traffichub.vn` |
| Chuỗi | 4 tầng (funcion → x10.mx → pastefy ×2) | **2 tầng** (funcion 228 KB → pastefy `sH0NUUgb` 297 KB) |
| Engine | JSVMP bytecode (captcha qcaptcha) | VM-lite UI: nút nổi "Delta", nhập link nhiệm vụ → copy link đích → nhập mã |
| Self-host | `Auto_LaymaV2.selfhost.user.js` (733 KB, 6 payload nhúng) | `TrafficViet.selfhost.user.js` (301 KB, engine nhúng) |
| Artifacts | `analysis/` | `analysis-traffic/` |
