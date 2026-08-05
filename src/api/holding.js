import api from './index'

/**
 * 获取持仓列表
 * @param {Object} params - 查询参数
 * @param {boolean} params.with_estimate - 是否包含估算收益
 * @returns {Promise<HoldingListResponse>}
 */
export function getHoldings(params = {}) {
  return api.get('/api/v1/holding', { params })
}

/**
 * 新增持仓
 * @param {Object} data - { fund_code, buy_nav, shares, buy_date }
 * @returns {Promise<MyHolding>}
 */
export function addHolding(data) {
  return api.post('/api/v1/holding', data)
}

/**
 * 修改持仓
 * @param {string} holdingId
 * @param {Object} data - { shares?, buy_nav? }
 * @returns {Promise<MyHolding>}
 */
export function updateHolding(holdingId, data) {
  return api.put(`/api/v1/holding/${holdingId}`, data)
}

/**
 * 删除持仓
 * @param {string} holdingId
 */
export function deleteHolding(holdingId) {
  return api.delete(`/api/v1/holding/${holdingId}`)
}

/**
 * 获取持仓总览
 * @returns {Promise<PortfolioSummary>}
 */
export function getPortfolioSummary() {
  return api.get('/api/v1/holding/summary')
}
