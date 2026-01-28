# Hướng Dẫn Cài Đặt Agent Skill Kit

## 📦 Cài Đặt Nhanh

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

Trình cài đặt sẽ hỏi bạn chọn phạm vi cài đặt: **Local** hoặc **Global**.

> **✨ v3.2.0 Update:** Tất cả master scripts đã migrate sang JavaScript. Zero Python dependency!
>
> - `npm run checklist` - Quick validation
> - `npm run verify <URL>` - Full verification
> - `npm run preview:start` - Dev server
>
> Xem [MIGRATION.md](MIGRATION.md) để biết thêm chi tiết.

---

## 🔹 Local (Current Project)

### Skills

- Cài vào `.agent/skills/` trong dự án hiện tại
- Chỉ dự án này sử dụng được

### CLI Tools

- `npm run agent` - Smart CLI (auto-added to package.json)
- `npx kit` - Installer (if installed as dependency)

### Phù hợp khi:

- Bạn muốn cô lập skills theo từng project
- Tránh ảnh hưởng đến các dự án khác
- Làm việc với team (skills được commit vào git)

### Cấu trúc thư mục sau khi cài:

```
your-project/
├── .agent/
│   ├── skills/        # 48+ domain skills
│   ├── agents/        # 20 specialist agents
│   ├── workflows/     # 14 slash commands
│   ├── knowledge/     # Self-learning memory
│   ├── GEMINI.md      # Configuration
│   └── ARCHITECTURE.md
├── node_modules/
│   └── agentskillskit-cli/  # (nếu chọn cài)
└── package.json
```

---

## 🔹 Global (System-wide)

### Skills

- Cài vào `~/.gemini/antigravity/skills/`
- Tất cả projects trên máy đều sử dụng được

### CLI Tools

- `agent` - Smart CLI (nếu chọn cài global)
- `kit` - Installer (cần cài riêng: `npm install -g add-skill-kit`)

### Phù hợp khi:

- Bạn làm việc với nhiều dự án
- Muốn dùng chung một bộ skills
- Làm việc cá nhân (không cần commit skills vào git)

### Cấu trúc thư mục sau khi cài:

```
~/.gemini/
└── antigravity/
    ├── skills/        # 48+ domain skills
    ├── agents/        # 20 specialist agents
    ├── workflows/     # 14 slash commands
    ├── knowledge/     # Self-learning memory
    ├── GEMINI.md      # Configuration
    └── ARCHITECTURE.md
```

---

## 🛠️ Sử Dụng Sau Khi Cài Đặt

### Nếu chọn Local:

```bash
# Sử dụng Smart CLI
npx agent

# Quản lý skills (nếu cài add-skill-kit local)
npx kit
npx kit doctor
npx kit uninstall all
```

### Nếu chọn Global:

```bash
# Sử dụng Smart CLI
agent

# Quản lý skills (cần cài: npm install -g add-skill-kit)
kit
kit doctor
kit uninstall all
```

---

## 🔄 Chuyển Đổi Giữa Local và Global

### Từ Local → Global:

```bash
# 1. Gỡ bỏ Local
npx kit uninstall all

# 2. Cài Global
npx -y add-skill-kit agentskillkit/agent-skills
# Chọn: Global System
```

### Từ Global → Local:

```bash
# 1. Gỡ bỏ Global
kit uninstall all --global

# 2. Cài Local
npx -y add-skill-kit agentskillkit/agent-skills
# Chọn: Current Project
```

---

## 📋 So Sánh Chi Tiết

| Tiêu chí         | Local                         | Global                          |
| ---------------- | ----------------------------- | ------------------------------- |
| **Skills path**  | `.agent/skills/`              | `~/.gemini/antigravity/skills/` |
| **Dùng cho**     | 1 project                     | Tất cả projects                 |
| **Git tracking** | ✅ Có thể commit              | ❌ Không                        |
| **Team sharing** | ✅ Dễ dàng                    | ❌ Khó                          |
| **CLI command**  | `npx agent`                   | `agent`                         |
| **Disk space**   | Nhiều hơn (mỗi project 1 bản) | Tiết kiệm (1 bản duy nhất)      |

---

## 🆘 Troubleshooting

### Lỗi: `agent` not found

```bash
# Nếu cài Local:
npx agent  # Thêm npx ở đầu

# Nếu cài Global:
npm install -g agentskillskit-cli
agent
```

### Lỗi: `kit` not found

```bash
# Kit là công cụ riêng, cần cài:
npm install -g add-skill-kit
kit
```

### Kiểm tra skills đã cài:

```bash
# Local
ls .agent/skills/

# Global
ls ~/.gemini/antigravity/skills/
```

---

## 🔗 Liên Kết Hữu Ích

- [GitHub - agent-skills](https://github.com/agentskillkit/agent-skills)
- [GitHub - add-skill-kit](https://github.com/agentskillkit/add-skill-kit)
- [NPM - agentskillskit-cli](https://www.npmjs.com/package/agentskillskit-cli)
- [NPM - add-skill-kit](https://www.npmjs.com/package/add-skill-kit)
