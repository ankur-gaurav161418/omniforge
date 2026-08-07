# OmniForge Project Structure

This document details the file and folder layout of the **OmniForge** monorepo.

---

```
omniforge/
├── apps/               # Documentation Portal & Web Dashboard
├── packages/           # Shared Monorepo Packages
│   ├── core/           # ConfigManager, Logger, Telemetry, PluginLoader, UpdateManager
│   └── sdk/            # TypeScript & Python Client SDKs
├── mcp/                # Production MCP Server (STDIO, HTTP, SSE)
│   ├── mcp.json        # MCP Manifest Descriptor
│   └── src/            # Transports, Handlers, Middleware
├── cli/                # OmniForge CLI Control Suite & AI Installers
├── skills/             # 14 Standardized & Categorized Agent Skills
├── prompts/            # 10 Enterprise Prompt Library Templates
├── workflows/          # 10 Executable Engineering Workflows
├── templates/          # Generator Templates (Project, Skill, Prompt, Plugin)
├── plugins/            # Dynamic Plugin System & Extension Ecosystem
├── docs/               # 16 Complete Documentation Guides & Images
├── examples/           # Executable Demos & SDK Code Snippets
├── tests/              # Vitest Test Suite (18 Test Files, 52 Tests)
├── sprints/            # Dedicated Sprint Deliverables Tracking (Sprint 1 to 11)
├── docker/             # Dockerfile & Docker Compose Configurations
└── .github/            # GitHub Actions Workflows & Governance Templates
```
