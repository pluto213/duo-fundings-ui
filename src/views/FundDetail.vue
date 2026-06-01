<template>
  <div class="fund-detail" v-if="fund">
    <!-- Fund Info Header -->
    <el-card shadow="hover" class="info-card">
      <div class="fund-header">
        <div class="fund-title">
          <h2>{{ fund.name }}</h2>
          <div class="fund-meta">
            <el-tag :type="typeTagMap[fund.type]" size="small">{{ fund.type }}</el-tag>
            <el-tag :type="riskTagMap[fund.riskLevel]" size="small" effect="plain">{{ fund.riskLevel }}</el-tag>
            <span class="meta-text">基金经理: {{ fund.manager }}</span>
            <span class="meta-text">成立日期: {{ fund.establishDate }}</span>
            <span class="meta-text">规模: {{ fund.totalSize }}亿元</span>
          </div>
        </div>
        <div class="fund-nav-block">
          <div class="nav-label">最新净值 ({{ fund.navDate }})</div>
          <div class="nav-value">{{ fund.nav.toFixed(4) }}</div>
          <div :class="fund.pnl.daily >= 0 ? 'profit' : 'loss'" class="nav-change">
            {{ fund.pnl.daily >= 0 ? '+' : '' }}{{ fund.pnl.daily }}%
          </div>
        </div>
      </div>
      <div class="fund-desc">{{ fund.description }}</div>
    </el-card>

    <!-- P&L Summary Cards -->
    <el-row :gutter="16" class="pnl-row">
      <el-col :span="4" v-for="item in pnlItems" :key="item.label">
        <el-card shadow="hover" class="pnl-card">
          <div class="pnl-label">{{ item.label }}</div>
          <div :class="item.value >= 0 ? 'profit' : 'loss'" class="pnl-value">
            {{ item.value >= 0 ? '+' : '' }}{{ item.value }}%
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- NAV Chart -->
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>净值走势</span>
              <el-radio-group v-model="chartDays" size="small">
                <el-radio-button :value="30">近30天</el-radio-button>
                <el-radio-button :value="60">近60天</el-radio-button>
                <el-radio-button :value="90">近90天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <v-chart :option="chartOption" style="height: 350px;" autoresize />
        </el-card>
      </el-col>

      <!-- P&L Bar Chart -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>收益分布</span>
          </template>
          <v-chart :option="pnlBarOption" style="height: 350px;" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- Top 8 Holdings -->
    <el-card shadow="hover" class="holdings-card">
      <template #header>
        <div class="card-header">
          <span>前八大持仓股票</span>
          <span class="holdings-summary">
            合计占比 <strong>{{ totalRatio }}%</strong>
          </span>
        </div>
      </template>

      <el-table :data="fund.holdings" stripe style="width: 100%">
        <el-table-column type="index" width="50" label="#" />
        <el-table-column label="股票名称" min-width="160">
          <template #default="{ row }">
            <div class="stock-name-cell">
              <span class="stock-name">{{ row.stock.name }}</span>
              <span class="stock-code">{{ row.stock.code }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="行业标签" min-width="280">
          <template #default="{ row }">
            <el-tag
              v-for="tag in row.stock.tags"
              :key="tag.label"
              size="small"
              :color="tag.color"
              effect="dark"
              class="industry-tag"
            >
              {{ tag.label }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="ratio" label="持仓占比" width="120" align="right">
          <template #default="{ row }">
            <div class="ratio-cell">
              <el-progress
                :percentage="row.ratio"
                :stroke-width="8"
                :show-text="false"
                :color="row.ratio > 8 ? '#f56c6c' : '#409eff'"
                style="width: 60px; display: inline-block; vertical-align: middle;"
              />
              <span class="ratio-text">{{ row.ratio }}%</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最新价" width="100" align="right">
          <template #default="{ row }">¥{{ row.stock.price.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column label="日涨跌" width="100" align="right">
          <template #default="{ row }">
            <span :class="row.stock.change >= 0 ? 'profit' : 'loss'">
              {{ row.stock.change >= 0 ? '+' : '' }}{{ row.stock.change }}%
            </span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>

  <!-- Not Found -->
  <el-empty v-else description="未找到该基金" />
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent, DataZoomComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { getFundWithStocks, generateNavHistory } from '@/mock/fundData'

use([CanvasRenderer, LineChart, BarChart, GridComponent, TooltipComponent, LegendComponent, DataZoomComponent])

const route = useRoute()

const typeTagMap = {
  '混合型': 'primary',
  '股票型': 'danger',
  '指数型': 'warning',
  '主题型': 'success',
}

const riskTagMap = {
  'R3': 'success',
  'R4': 'warning',
  'R5': 'danger',
}

const chartDays = ref(90)

const fund = computed(() => getFundWithStocks(route.params.code))

const totalRatio = computed(() => {
  if (!fund.value) return 0
  return fund.value.holdings.reduce((sum, h) => sum + h.ratio, 0).toFixed(2)
})

const pnlItems = computed(() => {
  if (!fund.value) return []
  const p = fund.value.pnl
  return [
    { label: '日收益', value: p.daily },
    { label: '周收益', value: p.weekly },
    { label: '月收益', value: p.monthly },
    { label: '季收益', value: p.quarterly },
    { label: '年收益', value: p.yearly },
    { label: '成立以来', value: p.sinceEstablish },
  ]
})

// NAV Line Chart
const chartOption = computed(() => {
  const history = generateNavHistory(route.params.code, chartDays.value)
  return {
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>净值: {c}',
    },
    grid: { left: 60, right: 20, top: 20, bottom: 60 },
    xAxis: {
      type: 'category',
      data: history.map(h => h.date),
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      scale: true,
      axisLabel: { formatter: '{value}' },
    },
    dataZoom: [{ type: 'inside' }, { type: 'slider', height: 20, bottom: 5 }],
    series: [{
      type: 'line',
      data: history.map(h => h.nav),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: '#409eff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64,158,255,0.3)' },
            { offset: 1, color: 'rgba(64,158,255,0.02)' },
          ],
        },
      },
    }],
  }
})

// P&L Bar Chart
const pnlBarOption = computed(() => {
  if (!fund.value) return {}
  const p = fund.value.pnl
  const categories = ['日', '周', '月', '季', '年', '成立以来']
  const values = [p.daily, p.weekly, p.monthly, p.quarterly, p.yearly, p.sinceEstablish]

  return {
    tooltip: { trigger: 'axis', formatter: '{b}: {c}%' },
    grid: { left: 50, right: 20, top: 20, bottom: 30 },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
    },
    series: [{
      type: 'bar',
      data: values.map(v => ({
        value: v,
        itemStyle: { color: v >= 0 ? '#f56c6c' : '#67c23a' },
      })),
      barWidth: '50%',
    }],
  }
})
</script>

<style scoped>
.info-card {
  margin-bottom: 20px;
}

.fund-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.fund-title h2 {
  margin: 0 0 10px 0;
  font-size: 22px;
  color: #303133;
}

.fund-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.meta-text {
  font-size: 13px;
  color: #909399;
}

.fund-nav-block {
  text-align: right;
}

.nav-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.nav-value {
  font-size: 32px;
  font-weight: 700;
  color: #303133;
}

.nav-change {
  font-size: 16px;
  font-weight: 600;
  margin-top: 4px;
}

.fund-desc {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.pnl-row {
  margin-bottom: 20px;
}

.pnl-card {
  text-align: center;
}

.pnl-card :deep(.el-card__body) {
  padding: 16px;
}

.pnl-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.pnl-value {
  font-size: 20px;
  font-weight: 700;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.holdings-card {
  margin-top: 20px;
}

.holdings-summary {
  font-size: 13px;
  color: #909399;
}

.stock-name-cell {
  display: flex;
  flex-direction: column;
}

.stock-name {
  font-weight: 500;
  color: #303133;
}

.stock-code {
  font-size: 12px;
  color: #909399;
}

.industry-tag {
  margin-right: 4px;
  margin-bottom: 4px;
  border: none !important;
}

.ratio-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.ratio-text {
  font-weight: 600;
  min-width: 50px;
  text-align: right;
}

.profit {
  color: #f56c6c;
}

.loss {
  color: #67c23a;
}
</style>
