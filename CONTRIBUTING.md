# Contributing to OmniForge

Thank you for your interest in contributing to OmniForge!

## Development Setup

1. Clone repository:
   ```bash
   git clone https://github.com/ankur-gaurav161418/omniforge.git
   cd omniforge
   ```

2. Install dependencies & build:
   ```bash
   npm install
   npm run build
   ```

3. Run test suite:
   ```bash
   npm test
   ```

4. Verify CLI:
   ```bash
   node cli/dist/index.js doctor
   ```

## Commit Guidelines
We enforce [Conventional Commits](https://www.conventionalcommits.org/):
- `feat: add new prompt variable interpolation`
- `fix: resolve MCP SSE reconnect bug`
- `docs: update CLI guide`

## Licensing & Attribution
All contributions are licensed under the MIT License. Contributions deriving from upstream `obra/superpowers` must preserve appropriate copyright notices.
