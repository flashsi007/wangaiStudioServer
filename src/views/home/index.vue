<template>
  <div class="h-screen p-6 space-y-6  ">

    <!-- 统计卡片网格 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- 总用户数 -->
      <a-card class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">总用户数</p>
            <p class="text-2xl font-bold  mt-1">{{ todayUser.userTotal }}</p>
            <p class="text-xs  mt-1">累计注册用户</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <User class="text-blue-600 text-xl" />
          </div>
        </div>
      </a-card>

      <!-- 今日新增用户 -->
      <a-card class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium  ">今日新增用户</p>
            <p class="text-2xl font-bold mt-1">{{ todayUser.todayUserCount }}</p>
            <p class="text-xs" :class="stats.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'">
              <ArrowUp v-if="todayUser.analysis >= 0" class="inline" />
              <ArrowDown v-else class="inline" />
              {{ Math.abs(todayUser.analysis) }}% 较昨日
            </p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <UserPlus class="text-green-600 text-xl" />
          </div>
        </div>
      </a-card>

      <!-- 总订单数 -->
      <a-card class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium  ">总订单数</p>
            <p class="text-2xl font-bold   mt-1">{{ stats.totalOrders.toLocaleString() }}</p>
            <p class="text-xs  mt-1">累计订单量</p>
          </div>
          <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <FileText class="text-purple-600 text-xl" />
          </div>
        </div>
      </a-card>

      <!-- 总收入 -->
      <a-card class="hover:shadow-lg transition-shadow duration-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium  ">总收入</p>
            <p class="text-2xl font-bold   mt-1">¥{{ stats.totalRevenue.toLocaleString() }}</p>
            <p class="text-xs  mt-1">累计营业额</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Trophy class="text-yellow-600 text-xl" />
          </div>
        </div>
      </a-card>
    </div>

    <!-- 网站访问统计 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- PV/UV 统计 -->
      <a-card title="网站访问统计" class="hover:shadow-lg transition-shadow duration-200">
        <div class="space-y-4">
          <div class="flex justify-between items-center p-4   rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-600">页面浏览量 (PV)</p>
              <p class="text-xl font-bold ">{{ stats.pageViews.toLocaleString() }}</p>
            </div>
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye class="text-blue-600" />
            </div>
          </div>
          <div class="flex justify-between items-center p-4   rounded-lg">
            <div>
              <p class="text-sm font-medium ">独立访客 (UV)</p>
              <p class="text-xl font-bold ">{{ stats.uniqueVisitors.toLocaleString() }}</p>
            </div>
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <User class="text-green-600" />
            </div>
          </div>
        </div>
      </a-card>

      <!-- 今日数据概览 -->
      <a-card title="今日数据概览" class="hover:shadow-lg transition-shadow duration-200">
        <div class="space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm  ">今日订单</span>
            <span class="font-semibold ">{{ stats.todayOrders }}</span>
          </div>
          <a-divider class="my-2" />
          <div class="flex justify-between items-center">
            <span class="text-sm ">今日收入</span>
            <span class="font-semibold  ">¥{{ stats.todayRevenue.toLocaleString() }}</span>
          </div>
          <a-divider class="my-2" />
          <div class="flex justify-between items-center">
            <span class="text-sm ">今日PV</span>
            <span class="font-semibold t ">{{ stats.todayPV.toLocaleString() }}</span>
          </div>
          <a-divider class="my-2" />
          <div class="flex justify-between items-center">
            <span class="text-sm ">今日UV</span>
            <span class="font-semibold  ">{{ stats.todayUV.toLocaleString() }}</span>
          </div>
        </div>
      </a-card>
    </div>

  </div>
</template>

<script setup>
import { getUserCount } from '@/api'
import { ref, onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import {
  User,
  UserPlus,
  FileText,
  Trophy,
  Eye,
  ArrowUp,
  ArrowDown,
  Plus,
  BarChart3,
  Settings
} from 'lucide-vue-next'

// 统计数据
const stats = ref({
  totalUsers: 12580,
  todayNewUsers: 156,
  userGrowthRate: 12.5, // 用户增长率百分比
  totalOrders: 8420,
  totalRevenue: 2580000,
  pageViews: 45680,
  uniqueVisitors: 12340,
  todayOrders: 89,
  todayRevenue: 15600,
  todayPV: 1250,
  todayUV: 890
})

// 模拟数据加载
const loadStats = async () => {
  try {
    // 这里可以调用实际的API接口获取数据
    // const response = await api.getStats()
    // stats.value = response.data

    Message.success('数据加载成功')
  } catch (error) {
    Message.error('数据加载失败')
    console.error('加载统计数据失败:', error)
  }
}


const todayUser = ref({
  userTotal: 0,
  todayUserCount: 0,
  analysis: 0
})


const fetchUserCount = async () => {
  let result = await getUserCount()
  if (result.success) {
    todayUser.value = result.data
    console.log(result.data);

  }
}

onMounted(() => {
  loadStats()
  fetchUserCount()
})
</script>