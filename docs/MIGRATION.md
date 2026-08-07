# OmniForge Migration Guide

**Author**: Ankur Gaurav

---

Migrating from legacy toolchains:
1. Replace legacy MCP servers with OmniForge MCP: `node mcp/dist/server.js`.
2. Migrate skill instructions to YAML frontmatter schema (`skills/catalog/`).
3. Run `omniforge install --all` to update client configurations.
