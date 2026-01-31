# 📖 PikaKit - User Guide

> **PikaKit** giúp bạn làm app mà không cần biết code.
> Bạn chỉ cần nói ý tưởng, AI sẽ lo phần còn lại.

---

## 🎯 PikaKit dùng để làm gì?

| Bạn muốn... | PikaKit giúp bạn... |
|-------------|-----------------|
| Làm app mới | Từ ý tưởng → App hoàn chỉnh |
| Thêm tính năng | Thiết kế → Code → Test tự động |
| Sửa lỗi | Tìm lỗi → Sửa → Kiểm tra |
| Deploy lên server | Cấu hình → Đẩy lên → Theo dõi |

---

## 🗺️ Bản đồ các lệnh PikaKit

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PikaKit WORKFLOW MAP                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    🌟 KHỞI ĐẦU & TÌM HIỂU                             ║  │
│  ╠═══════════════════════════════════════════════════════════════════════╣  │
│  ║  /think       │  /architect  │  /pulse       │  /agent                ║  │
│  ║  Bàn ý tưởng  │  Lập kế hoạch│  Xem tiến độ  │  CLI thông minh        ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                              │                                              │
│                              ▼                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    🎯 THIẾT KẾ & XÂY DỰNG                             ║  │
│  ╠═══════════════════════════════════════════════════════════════════════╣  │
│  ║  /build                   │  /studio                                  ║  │
│  ║  Tạo app từ đầu           │  Thiết kế UI với 50+ styles               ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                              │                                              │
│                              ▼                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    💻 CẢI TIẾN & KIỂM TRA                             ║  │
│  ╠═══════════════════════════════════════════════════════════════════════╣  │
│  ║  /boost       │  /validate     │  /inspect                            ║  │
│  ║  Nâng cấp     │  Chạy tests    │  Code review                         ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                              │                                              │
│                              ▼                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    🚀 TRIỂN KHAI & BẢO TRÌ                            ║  │
│  ╠═══════════════════════════════════════════════════════════════════════╣  │
│  ║  /launch   │  /diagnose  │  /stage     │  /autopilot                  ║  │
│  ║  Deploy    │  Debug      │  Preview    │  Tự động hóa                 ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                              │                                              │
│                              ▼                                              │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                    📚 TÀI LIỆU & MỞ RỘNG                              ║  │
│  ╠═══════════════════════════════════════════════════════════════════════╣  │
│  ║  /chronicle               │  /forge                                   ║  │
│  ║  Tự động viết docs        │  Tạo skill mới                            ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

# 📚 3 KỊCH BẢN SỬ DỤNG

---

## 🆕 KỊCH BẢN 1: Tạo App Mới Từ Đầu

> **Tình huống:** Bạn có ý tưởng và muốn làm app từ con số 0.

### Luồng hoạt động:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   BẠN CÓ Ý TƯỞNG                                                            │
│   "Em muốn làm app quản lý tiệm cà phê"                                     │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 1: /think (Nếu ý tưởng còn mơ hồ)                              │   │
│   │                                                                     │   │
│   │ AI sẽ hỏi:                                                          │   │
│   │ • "App giải quyết vấn đề gì?"                                       │   │
│   │ • "Ai sẽ dùng? Chủ tiệm hay nhân viên?"                             │   │
│   │ • "Có muốn em tìm xem thị trường có app tương tự không?"            │   │
│   │                                                                     │   │
│   │ → Output: Phân tích 3+ alternatives                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 2: /architect (Lập kế hoạch chi tiết)                          │   │
│   │                                                                     │   │
│   │ AI sẽ:                                                              │   │
│   │ • Phân tích task breakdown                                          │   │
│   │ • Chọn tech stack phù hợp                                           │   │
│   │ • Tạo PLAN.md chi tiết                                              │   │
│   │                                                                     │   │
│   │ → Output: Blueprint hoàn chỉnh (không code)                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 3: /build (Tạo app)                                            │   │
│   │                                                                     │   │
│   │ AI TỰ LÀM:                                                          │   │
│   │ • Tạo cấu trúc project                                              │   │
│   │ • Viết code frontend + backend                                      │   │
│   │ • Multi-agent coordination                                          │   │
│   │                                                                     │   │
│   │ → Output: App hoàn chỉnh, sẵn sàng chạy                             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 4: /studio (Thiết kế UI - Optional)                            │   │
│   │                                                                     │   │
│   │ AI cung cấp:                                                        │   │
│   │ • 50+ design styles                                                 │   │
│   │ • 95+ color palettes                                                │   │
│   │ • Anti-AI-slop design intelligence                                  │   │
│   │                                                                     │   │
│   │ → Output: UI đẹp, không generic                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 5: /validate (Kiểm tra)                                        │   │
│   │                                                                     │   │
│   │ AI sẽ:                                                              │   │
│   │ • Tự động generate tests                                            │   │
│   │ • Chạy test suite                                                   │   │
│   │ • Phân tích coverage                                                │   │
│   │                                                                     │   │
│   │ Nếu có lỗi → /diagnose để sửa                                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 6: /launch (Đưa lên production)                                │   │
│   │                                                                     │   │
│   │ AI TỰ LÀM:                                                          │   │
│   │ • Security scan                                                     │   │
│   │ • Build verification                                                │   │
│   │ • Zero-downtime deployment                                          │   │
│   │ • Health checks                                                     │   │
│   │                                                                     │   │
│   │ → Output: App live trên internet!                                   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   🎉 HOÀN THÀNH! App của bạn đã live!                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tóm tắt luồng:
```
/think → /architect → /build → /studio → /validate → /launch
```

---

## 📦 KỊCH BẢN 2: Nâng Cấp App Có Sẵn

> **Tình huống:** Bạn đã có app đang chạy, muốn thêm features.

### Luồng hoạt động:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   BẠN CÓ APP SẴN                                                            │
│   (Đã có code, đang chạy)                                                   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 1: /pulse (Xem tình trạng project)                             │   │
│   │                                                                     │   │
│   │ AI sẽ hiển thị:                                                     │   │
│   │ • Agent status                                                      │   │
│   │ • File statistics                                                   │   │
│   │ • Real-time progress                                                │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 2: /boost (Thêm/cập nhật features)                             │   │
│   │                                                                     │   │
│   │ AI sẽ:                                                              │   │
│   │ • Phân tích dependencies                                            │   │
│   │ • Iterative upgrades                                                │   │
│   │ • Đảm bảo không break existing code                                 │   │
│   │                                                                     │   │
│   │ → Output: Features mới được thêm an toàn                            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 3: /inspect (Code review)                                      │   │
│   │                                                                     │   │
│   │ Multi-layer validation:                                             │   │
│   │ • Defense-in-depth review                                           │   │
│   │ • Prevent false completion claims                                   │   │
│   │ • Security + performance check                                      │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ BƯỚC 4: /validate → /launch                                         │   │
│   │                                                                     │   │
│   │ Kiểm tra và deploy như bình thường                                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   🎉 FEATURES MỚI ĐÃ LIVE!                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tóm tắt luồng:
```
/pulse → /boost → /inspect → /validate → /launch
```

---

## 🤖 KỊCH BẢN 3: Tự Động Hóa Hoàn Toàn

> **Tình huống:** Bạn muốn AI tự làm hết từ A-Z.

### Luồng hoạt động:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   BẠN NÓI Ý TƯỞNG                                                           │
│   "Làm cho anh app quản lý task giống Notion"                               │
│          │                                                                  │
│          ▼                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ /autopilot                                                          │   │
│   │                                                                     │   │
│   │ AI sẽ TỰ ĐỘNG:                                                      │   │
│   │ • Điều phối 3+ specialist agents                                    │   │
│   │ • Làm việc song song                                                │   │
│   │ • Self-verification                                                 │   │
│   │                                                                     │   │
│   │ Các agents phối hợp:                                                │   │
│   │ • @frontend-specialist - UI/UX                                      │   │
│   │ • @backend-specialist - API, Database                               │   │
│   │ • @security-auditor - Bảo mật                                       │   │
│   │ • @test-engineer - Testing                                          │   │
│   │                                                                     │   │
│   │ → Output: App hoàn chỉnh, đã test, sẵn sàng deploy                  │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   🎉 CHỈ CẦN 1 LỆNH - AI LO HẾT!                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tóm tắt:
```
/autopilot → Xong!
```

---

## 🆘 KHI GẶP KHÓ KHĂN

### Bị lỗi?
```
Gõ: /diagnose
→ AI tìm root cause với evidence-based debugging
```

### Cần chạy preview?
```
Gõ: /stage
→ Start/stop/restart preview servers
```

### Muốn viết documentation?
```
Gõ: /chronicle
→ Auto-generate README, API docs, inline comments
```

### Muốn tạo skill mới?
```
Gõ: /forge
→ Create, validate, package new capabilities
```

---

## 📊 BẢNG TÓM TẮT 15 LỆNH

| Lệnh | Khi nào dùng | Output |
|------|--------------|--------|
| `/think` | Có ý tưởng, cần phân tích | 3+ alternatives analysis |
| `/architect` | Cần blueprint chi tiết | PLAN.md (no code) |
| `/build` | Tạo app mới từ đầu | Full-stack app |
| `/boost` | Thêm features vào app có sẵn | Iterative upgrades |
| `/studio` | Thiết kế UI đẹp | 50+ styles, anti-AI-slop |
| `/validate` | Kiểm tra app | Test results + coverage |
| `/inspect` | Code review | Multi-layer validation |
| `/diagnose` | Debug lỗi | Root cause + fix |
| `/launch` | Deploy lên production | Zero-downtime release |
| `/stage` | Preview/staging server | Local dev environment |
| `/autopilot` | Tự động hóa hoàn toàn | Multi-agent coordination |
| `/chronicle` | Viết documentation | README, API docs |
| `/forge` | Tạo skill mới | Packaged capability |
| `/pulse` | Xem tiến độ project | Health dashboard |
| `/agent` | CLI thông minh | Interactive commands |

---

## 💡 MẸO SỬ DỤNG

1. **Mới bắt đầu:** `/think` để khám phá options
2. **Cần plan:** `/architect` để có blueprint trước khi code
3. **Muốn nhanh:** `/autopilot` để AI tự làm hết
4. **Trước release:** `/validate` + `/inspect` + `/launch`
5. **Nói tự nhiên:** AI sẽ tự động chọn agent phù hợp

---

*PikaKit*
*Your ideas, our engineering.*
