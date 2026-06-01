import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { title: '基金总览' }
  },
  {
    path: '/funds',
    name: 'FundList',
    component: () => import('@/views/FundList.vue'),
    meta: { title: '基金列表' }
  },
  {
    path: '/fund/:code',
    name: 'FundDetail',
    component: () => import('@/views/FundDetail.vue'),
    meta: { title: '基金详情' }
  },
  {
    path: '/compare',
    name: 'FundCompare',
    component: () => import('@/views/FundCompare.vue'),
    meta: { title: '收益对比' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
