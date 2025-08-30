# WangAI Studio Admin - Vue Docker 部署方案

一个基于 Vue + Docker + Nginx + Ubuntu 的简单部署解决方案，支持一键部署。

## 📋 目录

- [项目概述](#项目概述)
- [系统要求](#系统要求)
- [快速开始](#快速开始)
- [部署架构](#部署架构)
- [配置说明](#配置说明)
- [运维管理](#运维管理)
- [故障排除](#故障排除)

## 🎯 项目概述

本项目提供了一个简单的 Vue.js 前端应用部署方案，包含：

- 🚀 Vue.js 前端应用
- 🌐 Nginx 静态文件服务
- 🐳 Docker 容器化部署
- ⚡ 一键部署脚本

## 💻 系统要求

- **操作系统**: Ubuntu 18.04+ / CentOS 7+ / Debian 9+
- **内存**: 最低 1GB，推荐 2GB+
- **存储**: 最低 10GB 可用空间
- **端口**: 3002 端口开放

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <repository-url>
cd admin-wangai-studio
```

### 2. 一键部署

```bash
# 给脚本执行权限
chmod +x deploy.sh

# 执行部署
sudo ./deploy.sh
```

### 3. 访问应用

部署完成后，您可以通过以下地址访问：

- **本地访问**: http://localhost:3002
- **服务器访问**: http://YOUR_SERVER_IP:3002

## 🏗️ 部署架构

```
┌─────────────────┐    ┌─────────────────┐
│   用户请求      │────│  Nginx (3002)   │
└─────────────────┘    └─────────┬───────┘
                                 │
                       ┌─────────▼───────┐
                       │  Vue.js 前端    │
                       │  (静态文件)     │
                       └─────────────────┘
```

## ⚙️ 配置说明

### 环境变量配置

主要配置文件：`.env.production`

```bash
# 应用配置
VUE_APP_TITLE=WangAI Studio Admin
VUE_APP_VERSION=1.0.0

# API 配置（如果有后端）
# VUE_APP_API_BASE_URL=https://api.wangai.studio

# 应用配置
VUE_APP_BASE_URL=/
VUE_APP_PUBLIC_PATH=/
```

### Docker 配置

主要配置文件：`docker-compose.yml`

- **前端服务**: 端口 3002
- **构建**: 多阶段构建，先构建 Vue 应用，再用 Nginx 提供服务

### Nginx 配置

主要配置文件：`nginx.conf`

- **静态文件服务**
- **SPA 路由支持**
- **Gzip 压缩**
- **缓存策略**

## 🛠️ 运维管理

### 服务管理

```bash
# 查看服务状态
docker-compose ps

# 查看服务日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新并重启
git pull
docker-compose down
docker-compose up -d --build
```

### 日志管理

```bash
# 查看前端日志
docker-compose logs frontend

# 清理 Docker 资源
docker system prune -f
```

### 监控检查

```bash
# 健康检查
curl http://localhost:3002/health

# 服务器资源监控
htop
df -h
free -h
```

## 🔧 故障排除

### 常见问题

#### 1. 容器启动失败

**原因**: 端口冲突或资源不足

**解决方案**:
```bash
# 检查端口占用
sudo netstat -tlnp | grep :3002

# 检查系统资源
free -h
df -h

# 重新部署
docker-compose down
./deploy.sh
```

#### 2. 静态文件无法访问

**原因**: 构建失败或 Nginx 配置问题

**解决方案**:
```bash
# 检查构建日志
docker-compose logs frontend

# 重新构建
docker-compose down
docker-compose up -d --build
```

### 日志分析

```bash
# 查看应用日志
docker-compose logs -f

# 查看 Nginx 日志
docker-compose logs frontend
```

---

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**部署愉快！** 🎉