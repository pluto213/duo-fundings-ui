<template>
  <el-container class="app-container">
    <!-- Sidebar -->
    <el-aside width="220px" class="app-aside">
      <div class="logo">
        <el-icon :size="28"><TrendCharts /></el-icon>
        <span>Duo Fundings</span>
      </div>
      <el-menu
        :default-active="route.path"
        router
        background-color="#1d1e2c"
        text-color="#a3a6b4"
        active-text-color="#409eff"
      >
        <el-menu-item index="/">
          <el-icon><DataBoard /></el-icon>
          <span>基金总览</span>
        </el-menu-item>
        <el-menu-item index="/funds">
          <el-icon><List /></el-icon>
          <span>基金列表</span>
        </el-menu-item>
        <el-menu-item index="/compare">
          <el-icon><DataAnalysis /></el-icon>
          <span>收益对比</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- Main Content -->
    <el-container>
      <el-header class="app-header">
        <div class="header-left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="route.meta.title">{{ route.meta.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-tag type="success" effect="plain">Mock Data</el-tag>
          <el-avatar :size="32" src="" style="margin-left: 12px;">
            <el-icon><User /></el-icon>
          </el-avatar>
        </div>
      </el-header>
      <el-main class="app-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style>
/* Global Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', Arial, sans-serif;
}

.app-container {
  height: 100vh;
}

/* Sidebar */
.app-aside {
  background-color: #1d1e2c;
  overflow-y: auto;
  border-right: 1px solid #2d2e3e;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 24px;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid #2d2e3e;
}

.logo .el-icon {
  color: #409eff;
}

.el-menu {
  border-right: none !important;
}

/* Header */
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 0 24px;
  height: 56px;
}

.header-right {
  display: flex;
  align-items: center;
}

/* Main */
.app-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
