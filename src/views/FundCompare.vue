<template>
  <div class="fund-compare">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>基金收益对比</span>
          <el-select
            v-model="selectedFunds"
            multiple
            collapse-tags
            collapse-tags-tooltip
            placeholder="选择要对比的基金"
            style="width: 400px;"
          >
            <el-option
              v-for="fund in allFunds"
              :key="fund.code"
              :label="fund.name"
              :value="fund.code"
            />
          </el-select>
        </div>
      </template>

      <!-- Comparison Bar Chart -->
      <v-chart :option="compareOption" style="height: 400px;" autoresize v-if="selectedFunds.length > 0" />
      <el-empty v-else description="请选择至少一只基金进行对比" />

      <!-- NAV Trend Comparison -->
      <div style="margin-top: 20px;" v-if="selectedFunds.length > 0">
        <div class="card-header" style="margin-bottom: 16px;">
          <h3 style="margin: 0; font-size: 16px;">净值走势对比</h3>
        </div>
        <v-chart :option="navCompareOption" style="height: 350px;" autoresize />
      </div>
    </el-card>

    <!-- P&L Table -->
    <el-card shadow="hover" style="margin-top: 20px;" v-if="selectedFunds.length > 0">
      <template #header>
        <span>收益明细对比</span>
      </template>
      <el-table :data="compareData" stripe style="width: 100%">
        <el-table-column prop="name" label="基金名称" min-width="180" fixed />
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag size="small" :type="typeTagMap[row.type]">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="日收益" width="90" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.daily >= 0 ? 'profit' : 'loss'">
              {{ row.pnl.daily >= 0 ? '+' : '' }}{{ row.pnl.daily }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="周收益" width="90" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.weekly >= 0 ? 'profit' : 'loss'">
              {{ row.pnl.weekly >= 0 ? '+' : '' }}{{ row.pnl.weekly }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="月收益" width="90" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.monthly >= 0 ? 'profit' : 'loss'">
              {{ row.pnl.monthly >= 0 ? '+' : '' }}{{ row.pnl.monthly }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="季收益" width="90" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.quarterly >= 0 ? 'profit' : 'loss'">
              {{ row.pnl.quarterly >= 0 ? '+' : '' }}{{ row.pnl.quarterly }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="年收益" width="90" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.yearly >= 0 ? 'profit' : 'loss'" style="font-weight: 600;">
              {{ row.pnl.yearly >= 0 ? '+' : '' }}{{ row.pnl.yearly }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column label="成立以来" width="100" align="right">
          <template #default="{ row }">
            <span :class="row.pnl.sinceEstablish >= 0 ? 'profit' : 'loss'" style="font-weight: 600;">
              {{ row.pnl.sinceEstablish >= 0 ? '+' : '' }}{{ row.pnl.sinceEstablish }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalSize" label="规模(亿)" width="100" align="right" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { FUNDS, generateNavHistory } from '@/mock/fundData'

use([CanvasRenderer, BarChart, LineChart, GridComponent, TooltipComponent, LegendComponent])

const allFunds = FUNDS
const selectedFunds = ref(['110011', '003834', '012414']) // Default selection

const typeTagMap = {
  '混合型': 'primary',
  '股票型': 'danger',
  '指数型': 'warning',
  '主题型': 'success',
}

const COLORS = ['#409eff', '#f56c6c', '#67c23a', '#e6a23c', '#909399', '#b37feb', '#36cfc9', '#ff85c0']

const compareData = computed(() =>
  FUNDS.filter(f => selectedFunds.value.includes(f.code))
)

// Bar chart comparing P&L
const compareOption = computed(() => {
  const funds = compareData.value
  if (funds.length === 0) return {}

  const categories = ['日收益', '周收益', '月收益', '季收益', '年收益', '成立以来']
  const pnlKeys = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly', 'sinceEstablish']

  return {
    tooltip: { trigger: 'axis' },
    legend: { data: funds.map(f => f.name), top: 0 },
    grid: { left: 60, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: categories,
    },
    yAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
    },
    series: funds.map((fund, i) => ({
      name: fund.name,
      type: 'bar',
      data: pnlKeys.map(k => fund.pnl[k]),
      itemStyle: { color: COLORS[i % COLORS.length] },
    })),
  }
})

// NAV trend comparison
const navCompareOption = computed(() => {
  const funds = compareData.value
  if (funds.length === 0) return {}

  // Use 90-day history
  const histories = funds.map(f => ({
    name: f.name,
    data: generateNavHistory(f.code, 90),
  }))

  // Normalize to 100 at start for fair comparison
  const allDates = histories[0]?.data.map(h => h.date) || []

  return {
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v) => v.toFixed(4),
    },
    legend: { data: funds.map(f => f.name), top: 0 },
    grid: { left: 60, right: 20, top: 40, bottom: 60 },
    xAxis: {
      type: 'category',
      data: allDates,
      axisLabel: { rotate: 30, fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      scale: true,
    },
    series: histories.map((h, i) => ({
      name: h.name,
      type: 'line',
      data: h.data.map(d => d.nav),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color: COLORS[i % COLORS.length] },
    })),
  }
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profit {
  color: #f56c6c;
}

.loss {
  color: #67c23a;
}
</style>
