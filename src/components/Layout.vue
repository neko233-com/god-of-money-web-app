<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <h1>💰 财神233</h1>
        <p class="subtitle">贷款计算工具</p>
      </div>
      
      <nav class="nav-menu">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          <span class="icon">{{ item.icon }}</span>
          <span class="title">{{ item.title }}</span>
        </router-link>
      </nav>

      <div class="footer">
        <p>基于财务风险管理原则</p>
        <p class="version">v1.0.0</p>
      </div>
    </aside>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

interface MenuItem {
  path: string;
  title: string;
  icon: string;
}

const route = useRoute();

const menuItems: MenuItem[] = [
  { path: '/commercial-loan', title: '商业贷款', icon: '🏢' },
  { path: '/housing-loan', title: '购房贷款', icon: '🏠' },
  { path: '/combined-loan', title: '组合贷款', icon: '🔗' },
  { path: '/risk-assessment', title: '风险评估', icon: '📊' },
];

const isActive = (path: string) => {
  return route.path === path;
};
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.logo {
  padding: 30px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: bold;
}

.subtitle {
  margin: 5px 0 0;
  font-size: 12px;
  opacity: 0.7;
}

.nav-menu {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left-color: #3498db;
}

.nav-item .icon {
  font-size: 20px;
  margin-right: 12px;
}

.nav-item .title {
  font-size: 14px;
  font-weight: 500;
}

.footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  font-size: 12px;
  opacity: 0.6;
}

.version {
  margin-top: 5px;
  font-size: 11px;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
