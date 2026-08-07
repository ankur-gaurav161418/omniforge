# Changelog

All notable changes to **OmniForge** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-08-07

### Added
- **First Public Release** of **OmniForge MCP** by Ankur Gaurav.
- Production Multi-Transport MCP Server supporting STDIO, HTTP REST (`/rpc`, `/health`, `/metrics`), and SSE event streams.
- Multi-Client MCP Installer suite supporting 7 AI clients: Claude Desktop, Cursor IDE, VS Code, OpenAI Codex, ChatGPT Actions, Google Gemini, and Google Antigravity.
- OmniForge CLI supporting 17 core commands (`init`, `install`, `update`, `upgrade`, `doctor`, `status`, `search`, `run`, `workflow`, `skill`, `prompt`, `config`, `version`, `publish`, `validate`, `repair`, `uninstall`).
- 14 Standardized Agent Skills with schema validation and keyword indexing.
- 10 Enterprise Prompt Library Templates with variable interpolation (`{{var}}`).
- 10 Executable Engineering Workflows (engineering, architecture, prd, testing, debugging, release, documentation, planning, code-review, deployment).
- Dynamic Plugin System with `git-enhancer` and `security-auditor` plugins.
- 16 Enterprise Documentation Guides under `docs/`.
- 100% Automated Test Suite (18 test files, 52 unit/integration/performance tests).
