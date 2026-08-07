FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig*.json ./
COPY packages/ packages/
COPY cli/ cli/
COPY mcp/ mcp/
COPY skills/ skills/
COPY prompts/ prompts/
COPY workflows/ workflows/

RUN npm install
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app ./

EXPOSE 8080
ENV NODE_ENV=production

CMD ["npm", "run", "mcp:start"]
