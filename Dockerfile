# ---------- 1. 编译 ----------
FROM node:20.17.0-alpine AS builder

WORKDIR /app

# 1) 把包管理文件 & 环境变量复制进来，提前利用缓存
COPY package*.json ./

# 让 Vite/Vue-CLI读取
COPY .env.production ./         

# 安装所有依赖
RUN npm ci --prefer-offline --no-audit

# 2) 复制源码并打包
COPY . .
RUN npm run build               # 产出 /app/dist

# ---------- 2. 运行 ----------
# 只需要一个极小的数据卷容器，把 /dist 挂出来
FROM alpine:3.19
COPY --from=builder /app/dist /dist
# 容器保持空跑，仅作“数据卷”
CMD ["tail", "-f", "/dev/null"]