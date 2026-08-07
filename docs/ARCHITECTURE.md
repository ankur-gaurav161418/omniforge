# OmniForge Architecture Guide

## Hexagonal & Clean Architecture Principles

OmniForge is designed around decoupled hexagonal boundaries:

1. **Domain Core** (`packages/core`): Contains zero external framework dependencies. Manages configuration state, log streams, and plugin discovery.
2. **Application Services** (`skills/`, `prompts/`, `workflows/`): Encapsulates execution strategies, TDD lifecycles, and interactive agent skills.
3. **Adapters & Transports** (`cli/`, `mcp/`): Provides CLI entrypoints and multi-transport MCP endpoints (STDIO, HTTP, SSE) for client connection.

## Data Flow Diagram

```
[Agent Client (Claude / Gemini / Cursor)]
                   │
                   ▼ (STDIO / HTTP / SSE)
          [OmniForge MCP Server]
                   │
       ┌───────────┴───────────┐
       ▼                       ▼
 [Skill Engine]        [Prompt Engine]
       │                       │
       └───────────┬───────────┘
                   ▼
          [Workflow Runner]
                   │
                   ▼
     [Target Codebase Worktree]
```
