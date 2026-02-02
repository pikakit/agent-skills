# PikaKit Skill Generator - VS Code Extension

> 🤖 Real-time auto-learning từ IDE diagnostics → Generate skills tự động

## Features

- **Real-time Diagnostics** - Listen TypeScript, ESLint errors real-time
- **Pattern Detection** - Tự động nhận diện patterns từ lỗi lặp lại
- **Auto-Save Lessons** - Lưu vào `.agent/lessons.json`
- **Skill Generation** - Tạo SKILL.md khi đủ threshold (≥3 lần)
- **Status Bar** - Hiển thị trạng thái learning

## Installation

### Local Development

```bash
cd packages/pikakit-vscode
npm install
npm run compile
```

Sau đó:
1. Nhấn F5 trong VS Code
2. Chọn "Extension Development Host"
3. Extension sẽ chạy trong VS Code mới

### Install từ VSIX

```bash
npm run vscode:prepublish
vsce package
code --install-extension pikakit-skill-generator-1.0.0.vsix
```

## Commands

| Command | Description |
|---------|-------------|
| `PikaKit: Start Learning` | Bắt đầu listen diagnostics |
| `PikaKit: Stop Learning` | Dừng learning |
| `PikaKit: Generate Skill` | Manual generate từ patterns |
| `PikaKit: View Lessons` | Xem tất cả lessons đã học |
| `PikaKit: Clear Lessons` | Xóa tất cả lessons |

## Configuration

```json
{
    "pikakit.autoStart": true,
    "pikakit.threshold": 3,
    "pikakit.lessonsPath": ".agent/lessons.json"
}
```

## How It Works

```
1. Code có lỗi TypeScript/ESLint
2. Extension detect và phân tích
3. Pattern được save vào lessons.json
4. Khi pattern lặp lại ≥3 lần
5. Tự động offer generate skill
6. Skill mới trong .agent/skills/
```

## Supported Error Types

- TypeScript: Cannot find name, Property does not exist, Type mismatch
- ESLint: Unused variables, Missing semicolons
- React: Invalid hook calls, Missing dependencies
- General: Import errors, Module not found

---

⚡ PikaKit v3.2.0
