FROM node:22-alpine AS builder

RUN apk add --no-cache git

WORKDIR /app

RUN npm install -g pnpm@latest

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Init a bare git repo so lefthook's prepare script doesn't fail
RUN git init && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
