<template>
  <div class="dashboard">
    <!-- Summary Cards -->
    <el-row :gutter="20" class="summary-row">
      <el-col :span="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-icon" style="background: #ecf5ff;">
            <el-icon :size="28" color="#409eff"><Collection /></el-icon>
          </div>
          <div class="summary-info">
            <div class="summary-value">{{ stats.fundCount }}</div>
            <div class="summary-label">基金总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-icon" style="background: #f0f9eb;">
            <el-icon :size="28" color="#67c23a"><Wallet /></el-icon>
          </div>
          <div class="summary-info">
            <div class="summary-value">{{ stats.totalAUM }} <span class="unit">亿</span></div>
            <div class="summary-label">总管理规模</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-icon" style="background: #fdf6ec;">
            <el-icon :size="28" color="#e6a23c"><TrendCharts /></el-icon>
          </div>
          <div class="summary-info">
            <div class="summary-value" :class="stats.avgReturn >= 0 ? 'profit' : 'loss'">
              {{ stats.avgReturn >= 0 ? '+' : '' }}{{ stats.avgReturn }}%
            </div>
            <div class="summary-label">年化平均收益</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="summary-card">
          <div class="summary-icon" style="background: #fef0f0;">
            <el-icon :size="28" color="#f56c6c"><Warning /></el-icon>
          </div>
          <div class="summary-info">
            <div class="summary-value loss">
              {{ stats.worstFund.return }}%
            </div>
            <div class="summary-label">最差年收益 ({{ stats.worstFund.name.slice(0, 6) }}…)</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!-- Fund Performance Table -->
      <el-col :span="16">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>基金收益排行</span>
              <el-button type="primary" text @click="$router.push('/funds')">查看全部</el-button>
            </div>
          </template>
          <el-table :data="sortedFunds" stripe style="width: 100%" @row-click="goDetail">
            <el-table-column prop="name" label="基金名称" min-width="180">
              <template #default="{ row }">
                <div class="fund-name-cell">
                  <span class="fund-name">{{ row.name }}</span>
                  <span class="fund-code">{{ row.code }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80">
              <template #default="{ row }">
                <el-tag size="small" :type="typeTagMap[row.type]">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="manager" label="基金经理" width="100" />
            <el-table-column prop="nav" label="最新净值" width="100" align="right">
              <template #default="{ row }">{{ row.nav.toFixed(4) }}</template>
            </el-table-column>
            <el-table-column label="日涨跌" width="90" align="right">
              <template #default="{ row }">
                <span :class="row.pnl.daily >= 0 ? 'profit' : 'loss'">
                  {{ row.pnl.daily >= 0 ? '+' : '' }}{{ row.pnl.daily }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="年收益" width="90" align="right" sortable>
              <template #default="{ row }">
                <span :class="row.pnl.yearly >= 0 ? 'profit' : 'loss'" style="font-weight: 600;">
                  {{ row.pnl.yearly >= 0 ? '+' : '' }}{{ row.pnl.yearly }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="totalSize" label="规模(亿)" width="100" align="right" />
          </el-table>
        </el-card>
      </el-col>

      <!-- Top Holdings Panel -->
      <el-col :span="8">
        <el-card shadow="hover">
          <template #header>
            <span>热门持仓股票</span>
          </template>
          <div v-for="stock in topStocks" :key="stock.code" class="hot-stock-item">
            <div class="hot-stock-header">
              <span class="stock-name">{{ stock.name }}</span>
              <span :class="stock.change >= 0 ? 'profit' : 'loss'">
                {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
              </span>
            </div>
            <div class="hot-stock-tags">
              <el-tag
                v-for="tag in stock.tags"
                :key="tag.label"
                size="small"
                :color="tag.color"
                effect="dark"
                style="margin-right: 4px; margin-bottom: 4px; border: none;"
              >
                {{ tag.label }}
              </el-tag>
            </div>
            <div class="hot-stock-count">
              被 <strong>{{ stock.fundCount }}</strong> 只基金持有
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { FUNDS, STOCKS, getDashboardStats } from '@/mock/fundData'

const router = useRouter()
const stats = getDashboardStats()

const typeTagMap = {
  '混合型': 'primary',
  '股票型': 'danger',
  '指数型': 'warning',
  '主题型': 'success',
}

const sortedFunds = computed(() =>
  [...FUNDS].sort((a, b) => b.pnl.yearly - a.pnl.yearly)
)

// Count how many funds hold each stock
const topStocks = computed(() => {
  const stockFundCount = {}
  FUNDS.forEach(fund => {
    fund.holdings.forEach(h => {
      if (!stockFundCount[h.stockCode]) stockFundCount[h.stockCode] = 0
      stockFundCount[h.stockCode]++
    })
  })

  return Object.entries(stockFundCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([code, count]) => ({
      ...STOCKS[code],
      fundCount: count,
    }))
})

function goDetail(row) {
  router.push(`/fund/${row.code}`)
}
</script>

<style scoped>
.summary-row {
  margin-bottom: 20px;
}

.summary-card {
  display: flex;
  align-items: center;
}

.summary-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.summary-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.summary-value .unit {
  font-size: 14px;
  font-weight: 400;
  color: #909399;
}

.summary-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.fund-name-cell {
  display: flex;
  flex-direction: column;
}

.fund-name {
  font-weight: 500;
  color: #303133;
}

.fund-code {
  font-size: 12px;
  color: #909399;
}

.profit {
  color: #f56c6c;
}

.loss {
  color: #67c23a;
}

.hot-stock-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.hot-stock-item:last-child {
  border-bottom: none;
}

.hot-stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.stock-name {
  font-weight: 500;
  font-size: 14px;
}

.hot-stock-tags {
  margin-bottom: 4px;
}

.hot-stock-count {
  font-size: 12px;
  color: #909399;
}
</style>
