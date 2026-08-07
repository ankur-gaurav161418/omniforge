# OmniForge Developer Guide

**Author**: Ankur Gaurav (https://github.com/ankur-gaurav161418)

---

## Workspace Setup

```bash
# Clone repository
git clone https://github.com/ankur-gaurav161418/omniforge.git
cd omniforge

# Install monorepo dependencies
npm install

# Build TypeScript packages
npm run build

# Run unit and integration tests
npm test
```

## Creating Custom Skills

Custom skills reside in `skills/catalog/<skill-id>/SKILL.md`:

```markdown
---
name: Custom Skill
description: Description of custom skill
category: general
version: 1.0.0
author: Ankur Gaurav
tags: ['custom', 'omniforge']
---

# Custom Skill Instructions
```
