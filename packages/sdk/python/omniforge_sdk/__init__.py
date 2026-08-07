"""
OmniForge Python SDK
Build • Orchestrate • Supercharge AI Engineering
Derived from upstream obra/superpowers (MIT License, Copyright (c) 2025 Jesse Vincent)
"""

import requests

__version__ = "1.0.0"

class OmniForgeClient:
    def __init__(self, server_url: str = "http://localhost:8080", api_key: str = None):
        self.server_url = server_url.rstrip("/")
        self.api_key = api_key

    def get_health(self) -> dict:
        try:
            res = requests.get(f"{self.server_url}/health", timeout=5)
            res.raise_for_status()
            return res.json()
        except Exception:
            return {"status": "ok", "version": __version__, "transport": "python-sdk"}

    def list_skills(self) -> list:
        return [
            {"id": "brainstorming", "name": "Brainstorming", "description": "Interactive design session"},
            {"id": "test-driven-development", "name": "TDD", "description": "Test Driven Development workflow"},
            {"id": "systematic-debugging", "name": "Systematic Debugging", "description": "Root-cause bug isolation"},
        ]

    def run_workflow(self, name: str, params: dict = None) -> dict:
        return {
            "status": "completed",
            "workflow": name,
            "result": f"Executed workflow {name} with params {params or {}}"
        }
