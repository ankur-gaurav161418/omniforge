---
name: Systematic Debugging
description: Scientific root-cause isolation and step-by-step resolution of complex runtime bugs.
category: debugging
version: 1.3.0
author: OmniForge Team (Derived from obra/superpowers by Jesse Vincent)
tags: ['debugging', 'root-cause', 'isolation', 'defects', 'omniforge']
---

# OmniForge Systematic Debugging Skill

> **Upstream Attribution**: Derived from `obra/superpowers` created by Jesse Vincent under MIT License.

## Purpose
Prevent superficial symptom patching by enforcing empirical hypothesis testing, full log inspection, and reproducible test cases.

## Core Rules
1. **Log Inspection First**: Never diagnose without reading complete, un-truncated error logs.
2. **Reproduce**: Write a failing test case or reproduction script before touching application code.
3. **Isolate Root Cause**: Trace dataflow upstream to locate the exact origin of failure.
4. **Fix & Verify**: Apply fix, verify tests pass, ensure no regression side effects.
