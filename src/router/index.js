import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/index.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('@/layout/index.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: "/users",
          name: "Users",
          component: () => import('@/views/users/index.vue'),
          meta: { requiresAuth: true }
        },
        {
          path: '/orders',
          name: 'Orders',
          component: () => import('@/views/orders/index.vue'),
          meta: { requiresAuth: true }
        },
        // {
        //   path: '/mention-test',
        //   name: 'MentionTest',
        //   component: () => import('@/views/test/MentionTest.vue')
        // },
        // {
        //   path: '/socket-test',
        //   name: 'SocketTest',
        //   component: () => import('@/views/test/SocketTest.vue')
        // }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取token
  const token = localStorage.getItem('token')
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    if (token) {
      // 有token，允许访问
      next()
    } else {
      // 没有token，重定向到登录页
      next('/login')
    }
  } else {
    // 不需要认证的路由
    if (to.path === '/login' && token) {
      // 如果已登录用户访问登录页，重定向到首页
      next('/')
    } else {
      next()
    }
  }
})

export default router

