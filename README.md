# Layma.net Bypass - Deobfuscated Source Code

Dự án phân tích, bẻ khóa và giải mã (deobfuscate) toàn bộ chuỗi nạp mã của Userscript:
**`Layma.net Bypass - CUTTAY PROMAX` (bản gốc từ repo `duckpjvzexe/projectscript112247`)**.

## 📌 Tổng quan kiến trúc chuỗi nạp mã (Multi-stage Dropper)

Mã nguồn gốc trên GitHub không chứa logic nghiệp vụ mà hoạt động như một dropper tải mã độc lập qua nhiều tầng để trốn tránh phân tích:

```
[Auto_LaymaV2.user.js]
         │ (yêu cầu GM_xmlhttpRequest & unsafeWindow)
         ▼
[Stage 1: ObfFuncV2.js] (Mã hóa bằng Javascript-Obfuscator RC4 + Anti-Debug)
         │ (Tải mã từ xa bằng fetch() + eval())
         ▼
[Stage 2: duckxkrmproject.x10.mx/layma.js] (Bytecode VM Packer)
         │ (Tải payload)
         ▼
[Stage 3: pastefy.app/5dKBHbgv -> 6ZzLL87y] (Bảo vệ bằng JSVMP)
         │
         ▼
[Core: VNBypass v1.1.3 Engine] (Tự động bypass nhiệm vụ Layma.net)
```

## 📁 Danh sách tệp tin trong repository

| Tệp tin | Mô tả |
| :--- | :--- |
| `Auto_LaymaV2.deobf.user.js` | Userscript hoàn chỉnh sau khi gỡ bỏ toàn bộ các tầng loader trung gian. |
| `ObfFuncV2_deobfuscated.js` | Tầng 1 sau khi bẻ khóa 505 chuỗi RC4 và loại bỏ vòng lặp `debugger` chống F12. |
| `layma_stage2_deobfuscated.js` | Tầng 2 (tải từ host x10.mx) sau khi giải mã Bytecode VM. |
| `vnbypass_core_extracted.js` | Trích xuất các logic cốt lõi từ tầng JSVMP cuối cùng (Fingerprint Spoofing, API Submission). |

## ⚙️ Các Endpoint & Cơ chế Bypass chính
- **Tạo phiên**: `POST /api/traffic/session` -> Nhận `X-Traffic-Session`.
- **Lấy mã đếm ngược**: `POST /api/traffic/getcode`.
- **Nộp mã**: `POST /api/traffic/checkcode` kèm Fingerprint giả lập (Battery API, Canvas, DeviceScreen, Orientation).
- **Hỗ trợ Captcha**: Tự động nhận diện và giải QCaptcha, HCaptcha, CaptchaLa.

---
*Mục đích: Phân tích bảo mật và nghiên cứu kỹ thuật Reverse Engineering JavaScript.*
