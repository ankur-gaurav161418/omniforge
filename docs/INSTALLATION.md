# OmniForge Installation Guide

**Author**: Ankur Gaurav

---

## 1. Global Installation (Recommended)
```bash
npm install -g omniforge
```

## 2. On-Demand Execution via npx
```bash
npx omniforge doctor
```

## 3. Docker Deployment
```bash
docker build -t omniforge-mcp -f docker/Dockerfile .
docker run -d -p 8080:8080 omniforge-mcp
```
