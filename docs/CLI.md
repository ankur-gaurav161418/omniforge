# OmniForge CLI Reference Guide

The `omniforge` CLI provides a unified control interface for local workspace management, health diagnostics, workflow execution, and skill validation.

## Command Reference

### `omniforge init`
Initializes `.omniforge/config.json` with workspace default settings.

### `omniforge doctor`
Runs comprehensive diagnostic checks on Node environment, MCP transports, skills validation, and workspace configuration integrity.

### `omniforge status`
Displays active project name, version, MCP server port, transport, and telemetry status.

### `omniforge workflow <name>`
Executes pre-packaged workflows such as `engineering-workflow` or `testing-workflow`.

### `omniforge skill <list|inspect|validate> [name]`
Lists, inspects, or validates skills in the local workspace catalog.
