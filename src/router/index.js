import { createRouter, createWebHistory } from 'vue-router'
import ManualView from '../views/ManualView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/manual',
      name: 'manual',
      component: ManualView,
    },
    {
      path: '/advanced',
      name: 'advanced',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AdvancedView.vue'),
    },
    {
      path: '/advanced',
      name: 'advanced',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AdvancedView.vue'),
    },
  ],
})

export default router
