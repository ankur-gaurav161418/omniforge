# OmniForge Troubleshooting Guide

**Author**: Ankur Gaurav

---

## Diagnostics
Run `omniforge doctor` to check your environment, Node.js version, Git status, write permissions, and MCP server readiness.

## Common Issues
- **Permission Denied**: Run `chmod +x` or check write access in your workspace folder.
- **Port 8080 occupied**: Set `PORT=8081 npm run mcp:start`.
