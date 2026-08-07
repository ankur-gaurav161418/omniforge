# OmniForge Architecture Guide

**Author**: Ankur Gaurav (https://github.com/ankur-gaurav161418)  
**License**: MIT License

---

## High-Level Architecture Overview

OmniForge MCP is designed around Clean Architecture and Hexagonal boundaries. The system decouples protocol adapters (STDIO, HTTP, SSE) from core domain services (Skill Engine, Prompt Engine, Workflow Runner, Plugin Loader).

```mermaid
graph TD
    Client["AI Client / IDE"] --> Transport["Multi-Transport Server"]
    Transport --> Core["OmniForge Core Engine"]
    Core --> Skills["Skill Catalog (14 Skills)"]
    Core --> Prompts["Prompt Catalog (10 Templates)"]
    Core --> Workflows["Workflow Engine (10 Workflows)"]
    Core --> Plugins["Plugin Manager"]
```

## Core Packages

1. **`@omniforge/core`**: Base config, logger, telemetry, plugin loader, error hierarchy, update manager.
2. **`@omniforge/sdk`**: TypeScript & Python client SDKs.
3. **`@omniforge/mcp-server`**: Multi-transport MCP server (STDIO, HTTP, SSE).
4. **`@omniforge/skills`**: Skill Engine, validator, indexer, and catalog.
5. **`@omniforge/prompts`**: Prompt Engine, validator, indexer, and templates.
6. **`omniforge`**: Modular CLI binary (12 operational subcommands).
