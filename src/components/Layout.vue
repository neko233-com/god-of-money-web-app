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
  width: 100vw;
  background: #f5f7fa;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.sidebar {
  width: 250px;
  min-width: 250px;
  max-width: 250px;
  flex-shrink: 0;
  flex-grow: 0;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  height: 100vh;
  overflow: hidden;
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
  width: calc(100vw - 250px);
  min-width: calc(100vw - 250px);
  max-width: calc(100vw - 250px);
  height: 100vh;
  flex-shrink: 0;
  flex-grow: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 30px;
  box-sizing: border-box;
  position: relative;
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

/* 响应式布局 */
@media (max-width: 768px) {
  .sidebar {
    width: 200px;
    min-width: 200px;
  }
  
  .main-content {
    padding: 20px 15px;
  }
}

@media (max-width: 480px) {
  .layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    min-width: 100%;
    height: auto;
    max-height: 200px;
  }
  
  .nav-menu {
    flex-direction: row;
    overflow-x: auto;
    padding: 10px;
  }
  
  .nav-item {
    flex-direction: column;
    min-width: 80px;
    padding: 10px;
  }
  
  .main-content {
    flex: 1;
    height: auto;
    padding: 15px 10px;
  }
}
</style>
