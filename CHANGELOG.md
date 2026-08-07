# Changelog

All notable changes to OmniForge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-08-07

### Added
- Complete rebranding of upstream `obra/superpowers` into **OmniForge**.
- Multi-transport MCP Server supporting STDIO, HTTP, and SSE protocols with `/health` and `/rpc` endpoints.
- OmniForge CLI supporting 17 core commands (`init`, `install`, `update`, `upgrade`, `doctor`, `status`, `search`, `run`, `workflow`, `skill`, `prompt`, `config`, `version`, `publish`, `validate`, `repair`, `uninstall`).
- Upgraded catalog of 14 core skills with enhanced YAML frontmatter and validation schemas.
- Core TypeScript package `@omniforge/core` providing `ConfigManager`, `Logger`, `Telemetry`, and `PluginLoader`.
- TypeScript & Python Client SDKs (`@omniforge/sdk` and `omniforge-sdk`).
- Integrated Workflows, Prompts, Templates, and Plugin Loader systems.
- Docker containers and GitHub Actions workflows for continuous integration and automated semantic release.
- Upstream attribution notices (`NOTICE.md` and updated `LICENSE`).
