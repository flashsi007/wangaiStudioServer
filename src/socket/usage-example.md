# Socket Manager 使用说明

## 概述

SocketManager 是一个封装了 Socket.IO 客户端功能的类，提供了连接管理、任务提交、认证等功能。

## 在 Vue 组件中使用

### 方式一：使用全局属性

```vue
<template>
  <div>
    <button @click="connectSocket">连接</button>
    <button @click="submitTask">提交任务</button>
    <button @click="disconnect">断开连接</button>
  </div>
</template>

<script>
export default {
  name: 'SocketExample',
  mounted() {
    // 监听连接事件
    this.$socket.on('connect', (data) => {
      console.log('连接成功:', data)
    })
    
    // 监听任务完成事件
    this.$socket.on('task:completed', (data) => {
      console.log('任务完成:', data)
    })
  },
  methods: {
    connectSocket() {
      this.$socket.connect()
    },
    
    submitTask() {
      try {
        this.$socket.submitTask('analysis', {
          content: 'Hello World',
          type: 'text'
        })
      } catch (error) {
        console.error('提交任务失败:', error.message)
      }
    },
    
    disconnect() {
      this.$socket.disconnect()
    }
  }
}
</script>
```

### 方式二：使用 inject

```vue
<template>
  <div>
    <button @click="connectSocket">连接</button>
    <button @click="submitTask">提交任务</button>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'SocketExample',
  setup() {
    const socket = inject('socket')
    
    const connectSocket = () => {
      socket.connect()
    }
    
    const submitTask = () => {
      try {
        socket.submitTask('analysis', {
          content: 'Hello World',
          type: 'text'
        })
      } catch (error) {
        console.error('提交任务失败:', error.message)
      }
    }
    
    return {
      connectSocket,
      submitTask
    }
  }
}
</script>
```

### 方式三：直接导入使用

```vue
<script>
import socketManager from '@/socket'

export default {
  name: 'SocketExample',
  methods: {
    async handleTask() {
      try {
        // 连接到服务器
        socketManager.connect()
        
        // 等待连接建立
        await new Promise(resolve => {
          socketManager.on('connect', resolve)
        })
        
        // 认证
        socketManager.authenticate('user123')
        
        // 提交任务
        socketManager.submitTask('analysis', {
          content: 'Hello World'
        })
        
      } catch (error) {
        console.error('操作失败:', error.message)
      }
    }
  }
}
</script>
```

## API 文档

### 连接管理

- `connect()` - 连接到服务器
- `disconnect()` - 断开连接
- `getConnectionStatus()` - 获取连接状态

### 业务方法

- `authenticate(userId)` - 用户认证
- `submitTask(taskType, taskData)` - 提交任务
- `getStats()` - 获取统计信息
- `ping()` - 心跳检测

### 事件监听

- `on(event, callback)` - 监听事件
- `off(event, callback)` - 移除事件监听

### 可监听的事件

- `connect` - 连接成功
- `disconnect` - 连接断开
- `connected` - 服务器响应
- `auth:success` - 认证成功
- `auth:error` - 认证失败
- `task:started` - 任务开始
- `task:completed` - 任务完成
- `task:failed` - 任务失败
- `task:error` - 任务错误
- `stats:online` - 在线统计
- `stats:response` - 统计响应
- `pong` - 心跳响应

## 错误处理

所有方法都会在连接未建立或参数错误时抛出异常，请使用 try-catch 进行错误处理。

```javascript
try {
  this.$socket.submitTask('analysis', { content: 'test' })
} catch (error) {
  console.error('操作失败:', error.message)
  // 处理错误，如显示提示信息
}
```