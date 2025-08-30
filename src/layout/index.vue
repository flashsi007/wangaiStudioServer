<template>
  <div
    :class="['h-full w-full overflow-hidden flex transition-colors duration-200', isDark ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900']">
    <!-- 左侧侧边栏 -->
    <aside
      :class="['flex flex-col transition-all duration-200 ease-in-out border-r', isCollapsed ? 'w-0 overflow-hidden' : 'w-64', isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200']">
      <div
        :class="['border-t p-3 w-full h-screen flex flex-col items-center justify-between', isDark ? 'border-gray-700' : 'border-gray-200']">

        <a-menu :showCollapseButton="false" @menu-item-click="handleItemclick">
          <a-menu-item key="/">
            <icon-home size="18" />
            首页
          </a-menu-item>

          <a-menu-item key="/users">
            <icon-user size="18" />
            用户列表 </a-menu-item>
          <a-menu-item key="/orders">
            <icon-file size="18" />
            订单列表</a-menu-item>

          <!-- <a-sub-menu key="0">
            <template #icon>
              <IconApps></IconApps>
            </template>
<template #title>用户管理</template>
<a-menu-item key="/users"> 用户列表 </a-menu-item>
<a-menu-item key="/orders">订单列表</a-menu-item>
</a-sub-menu> -->
        </a-menu>

        <!-- 主题切换 -->
        <div class="mt-4 pt-3 flex items-center jucestify-center w-full border-t"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <button @click="toggleTheme"
            :class="['flex jucestify-center items-center px-2 py-1 text-sm rounded transition-colors w-full', isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100']">
            <Sun v-if="isDark" class="w-4 h-4 mr-2" />
            <Moon v-else class="w-4 h-4 mr-2" />
            <span class="text-center">{{ isDark ? '浅色模式' : '深色模式' }}</span>
          </button>
        </div>
      </div>
    </aside>

    <!-- 右侧主要内容区域 -->
    <div class="flex-1  relative">
      <!-- 顶部工具栏 -->
      <div class="absolute top-4 left-4 z-10 ">
        <button @click="toggleSidebar"
          :class="['p-1 rounded transition-colors cursor-pointer ', isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100']">
          <Menu :class="['w-4 h-4', isDark ? 'text-gray-300' : 'text-gray-600']" />
        </button>
      </div>

      <!-- 主要内容区域 -->
      <main class="flex-1 overflow-hidden border-t  mt-12 ">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { IconUser, IconHome, IconFile } from '@arco-design/web-vue/es/icon';

import { ref, onMounted } from 'vue'
import { Menu, } from 'lucide-vue-next'

import { useRouter } from 'vue-router'



export default {
  name: 'Layout',
  components: { IconHome, Menu, IconUser, IconFile },
  setup() {
    const isCollapsed = ref(false)
    const isDark = ref(false)
    const router = useRouter() // 获取路由实例
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
      localStorage.setItem('sidebar-collapsed', isCollapsed.value.toString())
    }

    const handleOpen = (data) => {

    }

    const handleItemclick = (path) => {
      router.push(path)

    }

    const toggleTheme = () => {
      isDark.value = !isDark.value
      localStorage.setItem('theme-dark', isDark.value.toString())

      const html = document.documentElement
      const body = document.body

      if (isDark.value) {
        // 启用暗色主题
        html.classList.add('dark')
        html.setAttribute('arco-theme', 'dark')
        body.setAttribute('arco-theme', 'dark')
      } else {
        // 启用浅色主题
        html.classList.remove('dark')
        html.removeAttribute('arco-theme')
        body.removeAttribute('arco-theme')
      }
    }

    onMounted(() => {
      // 恢复侧边栏状态
      const savedSidebarState = localStorage.getItem('sidebar-collapsed')
      if (savedSidebarState === 'true') {
        isCollapsed.value = true
      }

      // 恢复主题状态
      const savedTheme = localStorage.getItem('theme-dark')
      const html = document.documentElement
      const body = document.body

      if (savedTheme === 'true') {
        isDark.value = true
        html.classList.add('dark')
        html.setAttribute('arco-theme', 'dark')
        body.setAttribute('arco-theme', 'dark')
      } else {
        // 确保浅色主题状态正确
        html.classList.remove('dark')
        html.removeAttribute('arco-theme')
        body.removeAttribute('arco-theme')
      }
    })

    return {
      isCollapsed,
      isDark,
      handleItemclick,
      toggleSidebar,
      toggleTheme
    }
  }
}
</script>

<style>
.arco-menu,
.arco-menu-inline-header,
.arco-menu-item,
.arco-menu-item-group-title,
.arco-menu-inline {
  background-color: transparent !important;
}
</style>