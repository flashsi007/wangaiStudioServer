# ---------- 1) 依赖 & 编译 ----------
FROM node:20.17.0-alpine AS builder

WORKDIR /app

# 1. 先把包管理文件 & 环境变量文件复制进来，利用缓存
COPY package*.json ./
COPY .env.production ./          

# 安装依赖
RUN npm install --prefer-offline --no-audit

# 2. 复制剩余源码并打包
COPY . .
RUN npm run build        # Vite 会根据 .env.production 注入变量

# ---------- 2) 运行 ----------
FROM nginx:1.25-alpine AS runtime
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]