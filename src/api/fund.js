import api from './index'

/**
 * 获取基金估算收益
 * @param {string} code - 6位基金代码
 * @returns {Promise<FundEstimatedReturnResponse>}
 */
export function getEstimatedReturn(code) {
  return api.get(`/api/v1/fund/${code}/estimated-return`)
}

/**
 * 获取基金持仓
 * @param {string} code - 6位基金代码
 * @param {string} year - 年份，默认 2026
 * @returns {Promise<FundHoldingsResponse>}
 */
export function getFundHoldings(code, year = '2026') {
  return api.get('/api/v1/fund/holdings', { params: { code, year } })
}

/**
 * 获取基金信息
 * @param {string} code - 6位基金代码
 * @returns {Promise<FundInfoResponse>}
 */
export function getFundInfo(code) {
  return api.get(`/api/v1/fund/${code}/info`)
}

/**
 * 获取基金收益率
 * @param {string} code - 6位基金代码
 * @returns {Promise<FundReturnResponse>}
 */
export function getFundReturn(code) {
  return api.get(`/api/v1/fund/${code}/return`)
}

/**
 * 获取基金风险指标
 * @param {string} code - 6位基金代码
 * @returns {Promise<FundRiskResponse>}
 */
export function getFundRisk(code) {
  return api.get(`/api/v1/fund/${code}/risk`)
}

/**
 * 获取基金净值走势
 * @param {string} code - 6位基金代码
 * @param {string} range - 时间范围: 1m/3m/6m/1y/3y/5y/all
 * @returns {Promise<FundNavResponse>}
 */
export function getFundNav(code, range = '1y') {
  return api.get(`/api/v1/fund/${code}/nav`, { params: { range } })
}
