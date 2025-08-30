// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
 

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  plugins: [
    vue(),
    tailwindcss(), // 直接使用 Vite 插件

     AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          // 基础色彩变量 - 浅色主题
          'arcoblue-1': '#fafafa',
          'arcoblue-2': '#f5f5f5', 
          'arcoblue-3': '#e5e5e5',
          'arcoblue-4': '#d4d4d4',
          'arcoblue-5': '#a3a3a3',
          'arcoblue-6': '#737373', // 主色调
          'arcoblue-7': '#525252',
          'arcoblue-8': '#404040',
          'arcoblue-9': '#262626',
          'arcoblue-10': '#171717',
          
          // 主题色 - 使用中性灰色调
          'primary-1': '#fafafa',
          'primary-2': '#f5f5f5',
          'primary-3': '#e5e5e5', 
          'primary-4': '#d4d4d4',
          'primary-5': '#a3a3a3',
          'primary-6': '#737373',
          'primary-7': '#525252',
          'primary-8': '#404040',
          'primary-9': '#262626',
          'primary-10': '#171717',
          
          // 组件背景色
          'color-bg-1': '#ffffff',
          'color-bg-2': '#fafafa',
          'color-bg-3': '#f5f5f5',
          'color-bg-4': '#e5e5e5',
          'color-bg-5': '#d4d4d4',
          
          // 文本色
          'color-text-1': '#171717',
          'color-text-2': '#404040',
          'color-text-3': '#737373',
          'color-text-4': '#a3a3a3',
          
          // 边框色
          'color-border-1': '#f5f5f5',
          'color-border-2': '#e5e5e5',
          'color-border-3': '#d4d4d4',
          'color-border-4': '#a3a3a3',
          
          // 危险色 - 保持红色
          'red-6': '#dc2626',
          'danger-6': '#dc2626',
          
          // 成功色 - 绿色
          'green-6': '#22c55e',
          'success-6': '#22c55e',
          
          // 警告色 - 橙色
          'orange-6': '#f97316',
          'warning-6': '#f97316',
          
          // 信息色 - 蓝色
          'blue-6': '#3b82f6',
          'info-6': '#3b82f6',
        },
        javascriptEnabled: true,
      }
    }
  }
})