<template>
  <div class="socket-test p-6">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Socket 连接测试</h2>
      
      <!-- 连接状态 -->
      <div class="mb-4 p-4 rounded-lg" :class="statusClass">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="statusDotClass"></div>
          <span class="font-medium">{{ connectionStatus.isConnected ? '已连接' : '未连接' }}</span>
        </div>
        <div class="text-sm mt-1">
          <div>服务器: {{ connectionStatus.url }}</div>
          <div v-if="connectionStatus.socketId">Socket ID: {{ connectionStatus.socketId }}</div>
        </div>
      </div>
      
      <!-- 操作按钮 -->
      <div class="flex gap-2 mb-4">
        <button 
          @click="connect" 
          :disabled="connectionStatus.isConnected"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          连接
        </button>
        
        <button 
          @click="disconnect" 
          :disabled="!connectionStatus.isConnected"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          断开
        </button>
        
        <button 
          @click="authenticate" 
          :disabled="!connectionStatus.isConnected"
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          认证
        </button>
        
        <button 
          @click="ping" 
          :disabled="!connectionStatus.isConnected"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          心跳
        </button>
      </div>
    </div>
    
    <!-- 任务提交区域 -->
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-3">任务提交</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium mb-1">任务类型</label>
          <select v-model="taskForm.type" class="w-full p-2 border rounded">
            <option value="analysis">分析任务</option>
            <option value="processing">处理任务</option>
            <option value="generation">生成任务</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">用户ID</label>
          <input 
            v-model="taskForm.userId" 
            type="text" 
            placeholder="输入用户ID"
            class="w-full p-2 border rounded"
          >
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">任务数据 (JSON格式)</label>
        <textarea 
          v-model="taskForm.data" 
          rows="4" 
          placeholder='例如: {"content": "Hello World", "priority": "high"}'
          class="w-full p-2 border rounded font-mono text-sm"
        ></textarea>
      </div>
      
      <button 
        @click="submitTask" 
        :disabled="!connectionStatus.isConnected"
        class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
      >
        提交任务
      </button>
    </div>
    
    <!-- 消息日志 -->
    <div>
      <h3 class="text-lg font-semibold mb-3">消息日志</h3>
      
      <div class="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="mb-2 p-2 rounded text-sm"
          :class="getMessageClass(message.type)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-medium">{{ message.event }}</div>
              <div class="mt-1">{{ message.content }}</div>
            </div>
            <div class="text-xs opacity-75 ml-2">
              {{ formatTime(message.timestamp) }}
            </div>
          </div>
        </div>
        
        <div v-if="messages.length === 0" class="text-gray-500 text-center py-8">
          暂无消息
        </div>
      </div>
      
      <button 
        @click="clearMessages" 
        class="mt-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
      >
        清空日志
      </button>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { inject } from 'vue'

export default {
  name: 'SocketTest',
  setup() {
    const socket = inject('socket')
    
    // 响应式数据
    const connectionStatus = ref({
      isConnected: false,
      url: '',
      socketId: null
    })
    
    const taskForm = reactive({
      type: 'analysis',
      userId: 'test-user-123',
      data: JSON.stringify({
        content: 'Hello World',
        priority: 'high'
      }, null, 2)
    })
    
    const messages = ref([])
    
    // 计算属性
    const statusClass = computed(() => {
      return connectionStatus.value.isConnected 
        ? 'bg-green-50 border border-green-200' 
        : 'bg-red-50 border border-red-200'
    })
    
    const statusDotClass = computed(() => {
      return connectionStatus.value.isConnected 
        ? 'bg-green-500' 
        : 'bg-red-500'
    })
    
    // 方法
    const updateConnectionStatus = () => {
      connectionStatus.value = socket.getConnectionStatus()
    }
    
    const addMessage = (event, content, type = 'info') => {
      messages.value.unshift({
        event,
        content: typeof content === 'object' ? JSON.stringify(content, null, 2) : content,
        type,
        timestamp: new Date()
      })
      
      // 限制消息数量
      if (messages.value.length > 100) {
        messages.value = messages.value.slice(0, 100)
      }
    }
    
    const connect = () => {
      try {
        socket.connect()
        addMessage('连接', '正在连接到服务器...', 'info')
      } catch (error) {
        addMessage('连接错误', error.message, 'error')
      }
    }
    
    const disconnect = () => {
      try {
        socket.disconnect()
        addMessage('断开连接', '主动断开连接', 'warning')
      } catch (error) {
        addMessage('断开连接错误', error.message, 'error')
      }
    }
    
    const authenticate = () => {
      try {
        socket.authenticate(taskForm.userId)
        addMessage('认证', `发送认证请求: ${taskForm.userId}`, 'info')
      } catch (error) {
        addMessage('认证错误', error.message, 'error')
      }
    }
    
    const ping = () => {
      try {
        socket.ping()
        addMessage('心跳', '发送心跳检测', 'info')
      } catch (error) {
        addMessage('心跳错误', error.message, 'error')
      }
    }
    
    const submitTask = () => {
      try {
        const taskData = JSON.parse(taskForm.data)
        socket.submitTask(taskForm.type, taskData)
        addMessage('任务提交', `提交${taskForm.type}任务`, 'info')
      } catch (error) {
        addMessage('任务提交错误', error.message, 'error')
      }
    }
    
    const clearMessages = () => {
      messages.value = []
    }
    
    const getMessageClass = (type) => {
      const classes = {
        info: 'bg-blue-50 border-l-4 border-blue-400',
        success: 'bg-green-50 border-l-4 border-green-400',
        warning: 'bg-yellow-50 border-l-4 border-yellow-400',
        error: 'bg-red-50 border-l-4 border-red-400'
      }
      return classes[type] || classes.info
    }
    
    const formatTime = (timestamp) => {
      return timestamp.toLocaleTimeString()
    }
    
    // 事件监听器
    const setupEventListeners = () => {
      const events = [
        'connect', 'disconnect', 'connected', 
        'auth:success', 'auth:error',
        'task:started', 'task:completed', 'task:failed', 'task:error',
        'stats:online', 'stats:response', 'pong'
      ]
      
      events.forEach(event => {
        socket.on(event, (data) => {
          const type = event.includes('error') || event.includes('failed') ? 'error' :
                      event.includes('success') || event.includes('completed') ? 'success' :
                      event.includes('disconnect') ? 'warning' : 'info'
          
          addMessage(event, data, type)
          updateConnectionStatus()
        })
      })
    }
    
    // 生命周期
    onMounted(() => {
      setupEventListeners()
      updateConnectionStatus()
    })
    
    onUnmounted(() => {
      // 清理事件监听器
      socket.eventCallbacks.clear()
    })
    
    return {
      connectionStatus,
      taskForm,
      messages,
      statusClass,
      statusDotClass,
      connect,
      disconnect,
      authenticate,
      ping,
      submitTask,
      clearMessages,
      getMessageClass,
      formatTime
    }
  }
}
</script>

<style scoped>
.socket-test {
  max-width: 1200px;
  margin: 0 auto;
}
</style>