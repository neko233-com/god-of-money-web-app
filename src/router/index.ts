import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/commercial-loan',
  },
  {
    path: '/commercial-loan',
    name: 'CommercialLoan',
    component: () => import('../views/CommercialLoan.vue'),
    meta: { title: '商业贷款计算器' },
  },
  {
    path: '/housing-loan',
    name: 'HousingLoan',
    component: () => import('../views/HousingLoan.vue'),
    meta: { title: '购房贷款计算器' },
  },
  {
    path: '/combined-loan',
    name: 'CombinedLoan',
    component: () => import('../views/CombinedLoan.vue'),
    meta: { title: '组合贷款计算器' },
  },
  {
    path: '/risk-assessment',
    name: 'RiskAssessment',
    component: () => import('../views/RiskAssessment.vue'),
    meta: { title: '财务风险评估' },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
