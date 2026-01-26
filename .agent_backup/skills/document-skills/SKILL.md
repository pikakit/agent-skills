---
name: document-skills
description: Process and create office documents - Word (docx), PDF, PowerPoint (pptx), and Excel (xlsx). Includes templates, scripts, and automation workflows.
when_to_use: when creating, editing, or processing office documents programmatically
version: 1.0.0
---

# Document Skills

Skills for processing and creating office documents programmatically.

## Available Sub-Skills

### Word Documents (docx)
**Location:** `docx/SKILL.md`

Create, edit, and analyze Word documents with tracked changes, comments, formatting preservation, and redlining workflows.

### PDF Processing (pdf)
**Location:** `pdf/SKILL.md`

Extract text/tables, create PDFs, merge/split documents, fill forms. Uses pypdf and command-line tools.

### PowerPoint (pptx)
**Location:** `pptx/SKILL.md`

Create and edit presentations with layouts, speaker notes, comments, animations, and design elements.

### Excel (xlsx)
**Location:** `xlsx/SKILL.md`

Build spreadsheets with formulas, formatting, data analysis, and visualization. Includes financial modeling standards.

## Quick Reference

| Need | Use This |
|------|----------|
| **Word documents** | docx |
| **PDF extraction/creation** | pdf |
| **Presentations** | pptx |
| **Spreadsheets/financial models** | xlsx |

## Dependencies

Most sub-skills require Python packages:
- `python-docx` for Word
- `pypdf` for PDF
- `python-pptx` for PowerPoint
- `openpyxl` for Excel
