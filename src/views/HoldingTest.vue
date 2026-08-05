<template>
  <div class="holding-test">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>我的持仓</span>
          <el-button type="primary" :loading="loading" @click="fetchData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
        </div>
      </template>

      <!-- 加载状态 -->
      <div v-if="loading && !holdings.length" class="loading-state">
        <el-skeleton :rows="5" animated />
      </div>

      <!-- 错误提示 -->
      <el-alert
        v-else-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
      />

      <!-- 数据展示 -->
      <template v-else>
        <!-- 总览卡片 -->
        <el-row :gutter="20" class="summary-row">
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">基金数量</div>
              <div class="summary-value">{{ summary.fund_count }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">总成本</div>
              <div class="summary-value">¥{{ formatMoney(summary.total_cost) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">当前市值</div>
              <div class="summary-value">¥{{ formatMoney(summary.total_value) }}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="summary-item">
              <div class="summary-label">总收益</div>
              <div class="summary-value" :class="summary.total_profit >= 0 ? 'profit' : 'loss'">
                {{ summary.total_profit >= 0 ? '+' : '' }}¥{{ formatMoney(summary.total_profit) }}
                <span class="return-rate">({{ (summary.total_return_rate * 100).toFixed(2) }}%)</span>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 持仓表格 -->
        <el-table
          :data="holdings"
          stripe
          style="width: 100%"
          row-key="id"
          @expand-change="handleExpandChange"
        >
          <!-- 展开行：显示持仓股票明细 -->
          <el-table-column type="expand">
            <template #default="{ row }">
              <div class="expand-content">
                <div v-if="row._loadingDetail" class="expand-loading">
                  <el-skeleton :rows="3" animated />
                </div>
                <div v-else-if="row._detailError" class="expand-error">
                  <el-alert :title="row._detailError" type="error" show-icon :closable="false" />
                </div>
                <div v-else-if="row._estimateDetail && row._estimateDetail.holdings && row._estimateDetail.holdings.length">
                  <div class="expand-header">
                    <span class="expand-title">持仓股票明细</span>
                    <span class="expand-subtitle">报告期: {{ row._estimateDetail.report_date || '-' }}</span>
                  </div>
                  <el-table :data="row._estimateDetail.holdings" size="small" border>
                    <el-table-column prop="stock_code" label="股票代码" width="100" />
                    <el-table-column prop="stock_name" label="股票名称" width="120" />
                    <el-table-column prop="weight" label="持仓占比" width="100" align="right">
                      <template #default="{ row: stock }">
                        {{ (stock.weight * 100).toFixed(2) }}%
                      </template>
                    </el-table-column>
                    <el-table-column prop="current_price" label="当前价格" width="100" align="right">
                      <template #default="{ row: stock }">
                        {{ stock.current_price ? stock.current_price.toFixed(2) : '-' }}
                      </template>
                    </el-table-column>
                    <el-table-column label="个股涨跌幅" width="120" align="right">
                      <template #default="{ row: stock }">
                        <span v-if="stock.stock_return != null" :class="stock.stock_return >= 0 ? 'profit' : 'loss'">
                          {{ stock.stock_return >= 0 ? '+' : '' }}{{ (stock.stock_return * 100).toFixed(2) }}%
                        </span>
                        <span v-else>-</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price_time" label="价格时间" min-width="160" />
                  </el-table>
                </div>
                <div v-else class="expand-empty">暂无持仓明细数据</div>
              </div>
            </template>
          </el-table-column>

          <!-- 今日估算收益（着重显示） -->
          <el-table-column label="今日估算收益" width="150" align="center" fixed="left">
            <template #default="{ row }">
              <div v-if="row.estimated_return != null" class="estimate-cell">
                <div class="estimate-value" :class="row.estimated_return >= 0 ? 'profit' : 'loss'">
                  {{ row.estimated_return >= 0 ? '+' : '' }}{{ (row.estimated_return * 100).toFixed(2) }}%
                </div>
                <el-icon
                  class="estimate-detail-icon"
                  @click.stop="showEstimateDialog(row)"
                >
                  <View />
                </el-icon>
              </div>
              <span v-else>-</span>
            </template>
          </el-table-column>

          <el-table-column prop="fund_code" label="基金代码" width="100" />
          <el-table-column prop="fund_name" label="基金名称" min-width="160" />
          <el-table-column prop="buy_nav" label="买入净值" width="100" align="right">
            <template #default="{ row }">{{ row.buy_nav.toFixed(4) }}</template>
          </el-table-column>
          <el-table-column prop="shares" label="持有份额" width="100" align="right">
            <template #default="{ row }">{{ row.shares.toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="cost" label="买入成本" width="120" align="right">
            <template #default="{ row }">¥{{ formatMoney(row.cost) }}</template>
          </el-table-column>
          <el-table-column prop="current_nav" label="当前净值" width="100" align="right">
            <template #default="{ row }">
              {{ row.current_nav ? row.current_nav.toFixed(4) : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="current_value" label="当前市值" width="120" align="right">
            <template #default="{ row }">
              {{ row.current_value ? '¥' + formatMoney(row.current_value) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="浮动盈亏" width="120" align="right">
            <template #default="{ row }">
              <span v-if="row.profit != null" :class="row.profit >= 0 ? 'profit' : 'loss'">
                {{ row.profit >= 0 ? '+' : '' }}¥{{ formatMoney(row.profit) }}
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column label="收益率" width="100" align="right">
            <template #default="{ row }">
              <span v-if="row.return_rate != null" :class="row.return_rate >= 0 ? 'profit' : 'loss'">
                {{ row.return_rate >= 0 ? '+' : '' }}{{ (row.return_rate * 100).toFixed(2) }}%
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 原始 JSON (调试用) -->
        <el-collapse style="margin-top: 20px;">
          <el-collapse-item title="原始 JSON 数据 (调试)">
            <pre class="json-debug">{{ JSON.stringify({ holdings, summary }, null, 2) }}</pre>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-card>

    <!-- 估算收益详情弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="700px"
      destroy-on-close
    >
      <div v-if="dialogLoading" class="dialog-loading">
        <el-skeleton :rows="5" animated />
      </div>
      <div v-else-if="dialogData">
        <div class="dialog-summary">
          <el-descriptions :column="3" border size="small">
            <el-descriptions-item label="基金代码">{{ dialogData.fund_code }}</el-descriptions-item>
            <el-descriptions-item label="基金名称">{{ dialogData.fund_name || '-' }}</el-descriptions-item>
            <el-descriptions-item label="报告期">{{ dialogData.report_date || '-' }}</el-descriptions-item>
            <el-descriptions-item label="估算收益率">
              <span :class="dialogData.estimated_return >= 0 ? 'profit' : 'loss'" style="font-weight: 600; font-size: 16px;">
                {{ dialogData.estimated_return != null
                  ? (dialogData.estimated_return >= 0 ? '+' : '') + (dialogData.estimated_return * 100).toFixed(2) + '%'
                  : '-' }}
              </span>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <el-divider content-position="left">持仓股票明细</el-divider>

        <el-table :data="dialogData.holdings || []" size="small" border max-height="400">
          <el-table-column prop="stock_code" label="股票代码" width="100" />
          <el-table-column prop="stock_name" label="股票名称" width="120" />
          <el-table-column prop="weight" label="持仓占比" width="100" align="right">
            <template #default="{ row }">
              {{ (row.weight * 100).toFixed(2) }}%
            </template>
          </el-table-column>
          <el-table-column prop="report_price" label="报告期价格" width="110" align="right">
            <template #default="{ row }">
              {{ row.report_price ? row.report_price.toFixed(2) : '-' }}
            </template>
          </el-table-column>
          <el-table-column prop="current_price" label="当前价格" width="100" align="right">
            <template #default="{ row }">
              {{ row.current_price ? row.current_price.toFixed(2) : '-' }}
            </template>
          </el-table-column>
          <el-table-column label="个股涨跌幅" width="120" align="right">
            <template #default="{ row }">
              <span v-if="row.stock_return != null" :class="row.stock_return >= 0 ? 'profit' : 'loss'" style="font-weight: 600;">
                {{ row.stock_return >= 0 ? '+' : '' }}{{ (row.stock_return * 100).toFixed(2) }}%
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column prop="price_time" label="价格时间" min-width="160" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getHoldings, getPortfolioSummary } from '@/api/holding'
import { getEstimatedReturn } from '@/api/fund'

const holdings = ref([])
const summary = ref({
  fund_count: 0,
  total_cost: 0,
  total_value: 0,
  total_profit: 0,
  total_return_rate: 0
})
const loading = ref(false)
const error = ref(null)

// 弹窗相关
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogData = ref(null)
const dialogTitle = ref('')

function formatMoney(value) {
  if (value == null) return '0.00'
  return value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

async function fetchData() {
  loading.value = true
  error.value = null

  try {
    const [holdingsData, summaryData] = await Promise.all([
      getHoldings({ with_estimate: true }),
      getPortfolioSummary()
    ])
    holdings.value = (holdingsData.holdings || []).map(h => ({
      ...h,
      _loadingDetail: false,
      _detailError: null,
      _estimateDetail: null
    }))
    summary.value = summaryData
  } catch (err) {
    error.value = err.response?.data?.detail || err.message || '获取数据失败'
    console.error('Failed to fetch holdings:', err)
  } finally {
    loading.value = false
  }
}

// 展开行时加载明细
async function handleExpandChange(row, expandedRows) {
  const isExpanded = expandedRows.some(r => r.id === row.id)
  if (!isExpanded || row._estimateDetail || row._loadingDetail) return

  row._loadingDetail = true
  row._detailError = null

  try {
    const data = await getEstimatedReturn(row.fund_code)
    row._estimateDetail = data
  } catch (err) {
    row._detailError = err.response?.data?.detail || err.message || '获取明细失败'
  } finally {
    row._loadingDetail = false
  }
}

// 弹窗查看详情
async function showEstimateDialog(row) {
  dialogTitle.value = `${row.fund_name || row.fund_code} - 估算收益明细`
  dialogVisible.value = true
  dialogLoading.value = true
  dialogData.value = null

  try {
    const data = await getEstimatedReturn(row.fund_code)
    dialogData.value = data
  } catch (err) {
    dialogData.value = { error: err.response?.data?.detail || err.message || '获取失败' }
  } finally {
    dialogLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.holding-test {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-row {
  margin-bottom: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.summary-value .return-rate {
  font-size: 14px;
  font-weight: 400;
}

.profit {
  color: #f56c6c;
}

.loss {
  color: #67c23a;
}

.loading-state {
  padding: 20px;
}

/* 估算收益单元格 */
.estimate-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.estimate-value {
  font-size: 16px;
  font-weight: 700;
}

.estimate-detail-icon {
  cursor: pointer;
  color: #909399;
  font-size: 16px;
  transition: color 0.2s;
}

.estimate-detail-icon:hover {
  color: #409eff;
}

/* 展开行 */
.expand-content {
  padding: 16px 20px;
  background: #fafafa;
}

.expand-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}

.expand-title {
  font-weight: 600;
  font-size: 14px;
  color: #303133;
}

.expand-subtitle {
  font-size: 12px;
  color: #909399;
}

.expand-loading,
.expand-error,
.expand-empty {
  padding: 12px 0;
  color: #909399;
  font-size: 13px;
}

/* 弹窗 */
.dialog-loading {
  padding: 20px;
}

.dialog-summary {
  margin-bottom: 16px;
}

.json-debug {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-height: 400px;
}
</style>
