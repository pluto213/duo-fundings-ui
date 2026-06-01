<template>
  <div class="fund-list">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>全部基金</span>
          <div class="header-actions">
            <el-input
              v-model="searchText"
              placeholder="搜索基金名称或代码"
              :prefix-icon="Search"
              clearable
              style="width: 240px;"
            />
            <el-select v-model="typeFilter" placeholder="基金类型" clearable style="width: 140px; margin-left: 12px;">
              <el-option label="混合型" value="混合型" />
              <el-option label="股票型" value="股票型" />
              <el-option label="指数型" value="指数型" />
              <el-option label="主题型" value="主题型" />
            </el-select>
          </div>
        </div>
      </template>

      <el-table :data="filteredFunds" stripe style="width: 100%" @row-click="goDetail">
        <el-table-column type="index" width="50" label="#" />
        <el-table-column prop="name" label="基金名称" min-width="200">
          <template #default="{ row }">
            <div class="fund-name-cell">
              <span class="fund-name">{{ row.name }}</span>
              <span class="fund-code">{{ row.code }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="90">
          <template #default="{ row }">
            <el-tag size="small" :type="typeTagMap[row.type]">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险" width="70" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="riskTagMap[row.riskLevel]" effect="plain">{{ row.riskLevel }}</el-tag>
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
        <el-table-column label="年收益" width="90" align="right" sortable :sort-method="(a, b) => a.pnl.yearly - b.pnl.yearly">
          <template #default="{ row }">
            <span :class="row.pnl.yearly >= 0 ? 'profit' : 'loss'" style="font-weight: 600;">
              {{ row.pnl.yearly >= 0 ? '+' : '' }}{{ row.pnl.yearly }}%
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalSize" label="规模(亿)" width="100" align="right" />
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click.stop="goDetail(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { FUNDS } from '@/mock/fundData'

const router = useRouter()
const searchText = ref('')
const typeFilter = ref('')

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

const filteredFunds = computed(() => {
  return FUNDS.filter(f => {
    const matchSearch = !searchText.value ||
      f.name.includes(searchText.value) ||
      f.code.includes(searchText.value)
    const matchType = !typeFilter.value || f.type === typeFilter.value
    return matchSearch && matchType
  })
})

function goDetail(row) {
  router.push(`/fund/${row.code}`)
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
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
</style>
