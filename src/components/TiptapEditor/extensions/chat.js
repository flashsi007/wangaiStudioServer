import { Extension } from '@tiptap/core'
import { createApp } from 'vue'
import ChatComponent from './view/ChatComponent.vue'

// 全局变量来管理聊天框状态
let currentChatApp = null
let currentContainer = null

export default Extension.create({
  name: 'chatCommands',

  addOptions() {
    return {
      treeList: []
    }
  },

  addCommands() {
    return {
      openAIChat: () => ({ editor }) => {
        console.log('openAIChat command executed')
        
        // 如果聊天框已经打开，先关闭
        if (currentChatApp && currentContainer) {
          try {
            currentChatApp.unmount()
            if (document.body.contains(currentContainer)) {
              document.body.removeChild(currentContainer)
            }
          } catch (e) {
            console.warn('清理之前的聊天框时出错:', e)
          }
          currentChatApp = null
          currentContainer = null
        }

        // 创建容器元素
        const container = document.createElement('div')
        document.body.appendChild(container)
        currentContainer = container

        // 创建 Vue 应用实例
        const app = createApp(ChatComponent, {
          editor: editor,
          treeList: this.options.treeList,
          onClose: () => {
            // 关闭时清理
            try {
              if (currentChatApp) {
                currentChatApp.unmount()
              }
              if (currentContainer && document.body.contains(currentContainer)) {
                document.body.removeChild(currentContainer)
              }
            } catch (e) {
              console.warn('关闭聊天框时出错:', e)
            }
            currentChatApp = null
            currentContainer = null
          }
        })

        currentChatApp = app

        // 挂载应用
        try {
          app.mount(container)
          console.log('AI 聊天框已打开')
        } catch (e) {
          console.error('挂载聊天框时出错:', e)
          // 清理
          if (document.body.contains(container)) {
            document.body.removeChild(container)
          }
          currentChatApp = null
          currentContainer = null
          return false
        }

        return true
      }
    }
  }
})