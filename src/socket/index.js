import { io } from 'socket.io-client'

class SocketManager {
  constructor(url = 'http://localhost:3000') {
    this.url = url
    this.socket = null
    this.isConnected = false
    this.eventCallbacks = new Map()
  }

  // 连接到服务器
  connect() {
    if (this.socket) {
      this.socket.disconnect()
    }
    
    this.socket = io(this.url)
    
    // 基础连接事件
    this.socket.on('connect', () => {
      this.isConnected = true
      this.emit('connect', { message: '连接到服务器成功' })
    })
    
    this.socket.on('disconnect', () => {
      this.isConnected = false
      this.emit('disconnect', { message: '与服务器断开连接' })
    })
    
    // 业务事件监听
    this.socket.on('connected', (data) => {
      this.emit('connected', data)
    })
    
    this.socket.on('auth:success', (data) => {
      this.emit('auth:success', data)
    })
    
    this.socket.on('auth:error', (data) => {
      this.emit('auth:error', data)
    })
    
    this.socket.on('task:started', (data) => {
      this.emit('task:started', data)
    })
    
    this.socket.on('task:completed', (data) => {
      this.emit('task:completed', data)
    })
    
    this.socket.on('task:failed', (data) => {
      this.emit('task:failed', data)
    })
    
    this.socket.on('task:error', (data) => {
      this.emit('task:error', data)
    })
    
    this.socket.on('stats:online', (data) => {
      this.emit('stats:online', data)
    })
    
    this.socket.on('stats:response', (data) => {
      this.emit('stats:response', data)
    })
    
    this.socket.on('pong', (data) => {
      this.emit('pong', data)
    })
    
    return this
  }
  
  // 断开连接
  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
      this.emit('disconnect', { message: '主动断开连接' })
    }
  }
  
  // 认证
  authenticate(userId) {
    if (!this.socket || !this.isConnected) {
      throw new Error('请先连接到服务器')
    }
    
    if (!userId) {
      throw new Error('请提供用户ID')
    }
    
    this.socket.emit('auth', { userId })
    return this
  }
  
  // 提交任务
  submitTask(taskType, taskData) {
    if (!this.socket || !this.isConnected) {
      throw new Error('请先连接到服务器')
    }
    
    if (!taskType) {
      throw new Error('请提供任务类型')
    }
    
    // 如果taskData是字符串，尝试解析为JSON
    let parsedTaskData = taskData
    if (typeof taskData === 'string') {
      try {
        parsedTaskData = JSON.parse(taskData)
      } catch (e) {
        throw new Error('任务数据格式错误，请提供有效的JSON格式数据')
      }
    }
    
    this.socket.emit('task:submit', { taskType, taskData: parsedTaskData })
    return this
  }
  
  // 获取统计信息
  getStats() {
    if (!this.socket || !this.isConnected) {
      throw new Error('请先连接到服务器')
    }
    
    this.socket.emit('stats:request')
    return this
  }
  
  // 心跳检测
  ping() {
    if (!this.socket || !this.isConnected) {
      throw new Error('请先连接到服务器')
    }
    
    this.socket.emit('ping')
    return this
  }
  
  // 事件监听
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, [])
    }
    this.eventCallbacks.get(event).push(callback)
    return this
  }
  
  // 移除事件监听
  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
    return this
  }
  
  // 触发事件
  emit(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event callback for ${event}:`, error)
        }
      })
    }
  }
  
  // 获取连接状态
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      url: this.url,
      socketId: this.socket?.id || null
    }
  }
}

// 创建默认实例
const socketManager = new SocketManager()

// 导出类和默认实例
export { SocketManager }
export default socketManager
        