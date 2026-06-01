/**
 * Mock data for Duo Fundings management system
 * Contains: funds, stock holdings with industry tags, and P&L data
 */

// ─── Industry Tags Pool ───────────────────────────────────────────
export const INDUSTRY_TAGS = {
  TECH:       { label: '科技',     color: '#409eff' },
  AI:         { label: '人工智能', color: '#6366f1' },
  SEMI:       { label: '半导体',   color: '#8b5cf6' },
  CLOUD:      { label: '云计算',   color: '#0ea5e9' },
  CONSUMER:   { label: '消费',     color: '#f59e0b' },
  LUXURY:     { label: '奢侈品',   color: '#d97706' },
  FOOD:       { label: '食品饮料', color: '#f97316' },
  RETAIL:     { label: '零售',     color: '#fb923c' },
  PHARMA:     { label: '医药',     color: '#10b981' },
  BIOTECH:    { label: '生物科技', color: '#059669' },
  MEDICAL:    { label: '医疗器械', color: '#34d399' },
  HEALTH:     { label: '大健康',   color: '#6ee7b7' },
  FINANCE:    { label: '金融',     color: '#64748b' },
  BANK:       { label: '银行',     color: '#475569' },
  INSURANCE:  { label: '保险',     color: '#94a3b8' },
  ENERGY:     { label: '能源',     color: '#ef4444' },
  NEW_ENERGY: { label: '新能源',   color: '#22c55e' },
  EV:         { label: '电动车',   color: '#84cc16' },
  SOLAR:      { label: '光伏',     color: '#eab308' },
  AUTO:       { label: '汽车',     color: '#f43f5e' },
  MFG:        { label: '制造业',   color: '#78716c' },
  INDUSTRIAL: { label: '工业',     color: '#a8a29e' },
  REAL_ESTATE:{ label: '房地产',   color: '#6b7280' },
  INTERNET:   { label: '互联网',   color: '#3b82f6' },
  MEDIA:      { label: '传媒',     color: '#a855f7' },
  GAME:       { label: '游戏',     color: '#ec4899' },
  TELCOM:     { label: '通信',     color: '#14b8a6' },
  '5G':       { label: '5G',       color: '#06b6d4' },
  DEFENSE:    { label: '军工',     color: '#dc2626' },
  AGRI:       { label: '农业',     color: '#65a30d' },
}

// Helper to get tag objects from keys
const tags = (...keys) => keys.map(k => INDUSTRY_TAGS[k])

// ─── Stock Data ───────────────────────────────────────────────────
export const STOCKS = {
  '600519': { name: '贵州茅台', code: '600519', price: 1688.00, change: 1.25, tags: tags('CONSUMER', 'FOOD', 'LUXURY') },
  '000858': { name: '五粮液',   code: '000858', price: 152.30,  change: -0.82, tags: tags('CONSUMER', 'FOOD') },
  '601318': { name: '中国平安', code: '601318', price: 52.80,   change: 0.38, tags: tags('FINANCE', 'INSURANCE', 'BANK') },
  '600036': { name: '招商银行', code: '600036', price: 35.20,   change: -0.57, tags: tags('FINANCE', 'BANK') },
  '300750': { name: '宁德时代', code: '300750', price: 218.50,  change: 3.12, tags: tags('NEW_ENERGY', 'EV', 'MFG', 'ENERGY') },
  '002594': { name: '比亚迪',   code: '002594', price: 268.00,  change: 2.45, tags: tags('AUTO', 'EV', 'NEW_ENERGY', 'MFG') },
  '601012': { name: '隆基绿能', code: '601012', price: 22.80,   change: -1.90, tags: tags('NEW_ENERGY', 'SOLAR', 'ENERGY') },
  '000001': { name: '平安银行', code: '000001', price: 11.50,   change: 0.17, tags: tags('FINANCE', 'BANK') },
  '002475': { name: '立讯精密', code: '002475', price: 38.60,   change: 1.88, tags: tags('TECH', 'SEMI', 'MFG') },
  '600900': { name: '长江电力', code: '600900', price: 28.90,   change: 0.35, tags: tags('ENERGY', 'NEW_ENERGY') },
  '002714': { name: '牧原股份', code: '002714', price: 42.50,   change: -2.30, tags: tags('AGRI', 'CONSUMER') },
  '300059': { name: '东方财富', code: '300059', price: 18.20,   change: 1.68, tags: tags('FINANCE', 'INTERNET', 'TECH') },
  '603259': { name: '药明康德', code: '603259', price: 58.90,   change: -0.51, tags: tags('PHARMA', 'BIOTECH', 'HEALTH') },
  '300760': { name: '迈瑞医疗', code: '300760', price: 285.00,  change: 0.71, tags: tags('PHARMA', 'MEDICAL', 'HEALTH') },
  '688981': { name: '中芯国际', code: '688981', price: 78.50,   change: 4.25, tags: tags('TECH', 'SEMI', 'MFG') },
  '002230': { name: '科大讯飞', code: '002230', price: 52.30,   change: 5.60, tags: tags('TECH', 'AI', 'CLOUD', 'INTERNET') },
  '688111': { name: '金山办公', code: '688111', price: 312.00,  change: 2.15, tags: tags('TECH', 'CLOUD', 'INTERNET') },
  '002352': { name: '顺丰控股', code: '002352', price: 38.90,   change: -1.12, tags: tags('RETAIL', 'INDUSTRIAL') },
  '601888': { name: '中国中免', code: '601888', price: 78.50,   change: -3.20, tags: tags('RETAIL', 'LUXURY', 'CONSUMER') },
  '002049': { name: '紫光国微', code: '002049', price: 128.00,  change: 3.80, tags: tags('TECH', 'SEMI', 'DEFENSE') },
  '600745': { name: '闻泰科技', code: '600745', price: 45.20,   change: 1.95, tags: tags('TECH', 'SEMI', 'MFG') },
  '300274': { name: '阳光电源', code: '300274', price: 68.50,   change: -0.88, tags: tags('NEW_ENERGY', 'SOLAR', 'ENERGY') },
  '601899': { name: '紫金矿业', code: '601899', price: 18.20,   change: 2.30, tags: tags('ENERGY', 'INDUSTRIAL', 'MFG') },
  '000725': { name: '京东方A',  code: '000725', price: 4.85,    change: 0.62, tags: tags('TECH', 'MFG', 'SEMI') },
  '603986': { name: '兆易创新', code: '603986', price: 105.00,  change: 4.50, tags: tags('TECH', 'SEMI', 'AI') },
  '002415': { name: '海康威视', code: '002415', price: 32.80,   change: -0.91, tags: tags('TECH', 'AI', 'DEFENSE', 'INTERNET') },
  '300015': { name: '爱尔眼科', code: '300015', price: 15.80,   change: -1.88, tags: tags('PHARMA', 'MEDICAL', 'HEALTH') },
  '002241': { name: '歌尔股份', code: '002241', price: 22.50,   change: 3.21, tags: tags('TECH', 'MFG', 'CONSUMER') },
  '600585': { name: '海螺水泥', code: '600585', price: 25.30,   change: -0.40, tags: tags('INDUSTRIAL', 'MFG', 'REAL_ESTATE') },
  '601668': { name: '中国建筑', code: '601668', price: 6.20,    change: 0.16, tags: tags('INDUSTRIAL', 'REAL_ESTATE') },
  '002304': { name: '洋河股份', code: '002304', price: 88.50,   change: 0.68, tags: tags('CONSUMER', 'FOOD') },
  '000568': { name: '泸州老窖', code: '000568', price: 168.00,  change: 1.02, tags: tags('CONSUMER', 'FOOD', 'LUXURY') },
  '300124': { name: '汇川技术', code: '300124', price: 58.20,   change: 2.80, tags: tags('INDUSTRIAL', 'MFG', 'TECH') },
  '002460': { name: '赣锋锂业', code: '002460', price: 38.50,   change: -2.65, tags: tags('NEW_ENERGY', 'EV', 'ENERGY') },
  '000002': { name: '万科A',    code: '000002', price: 8.50,    change: -1.18, tags: tags('REAL_ESTATE') },
  '002456': { name: '欧菲光',   code: '002456', price: 7.80,    change: 1.30, tags: tags('TECH', 'MFG', 'SEMI') },
  '688012': { name: '中微公司', code: '688012', price: 145.00,  change: 5.10, tags: tags('TECH', 'SEMI', 'MFG') },
}

// ─── Fund Data ────────────────────────────────────────────────────
export const FUNDS = [
  {
    code: '110011',
    name: '易方达中小盘混合',
    manager: '张坤',
    type: '混合型',
    riskLevel: 'R4',
    nav: 6.8520,
    navDate: '2026-05-30',
    totalSize: 312.5, // 亿元
    establishDate: '2008-06-19',
    description: '本基金主要投资于具有核心竞争力的中小盘成长股，追求长期资本增值。',
    holdings: [
      { stockCode: '600519', ratio: 9.85 },
      { stockCode: '000858', ratio: 8.20 },
      { stockCode: '300750', ratio: 7.55 },
      { stockCode: '002594', ratio: 6.80 },
      { stockCode: '601318', ratio: 5.40 },
      { stockCode: '002304', ratio: 4.90 },
      { stockCode: '000568', ratio: 4.35 },
      { stockCode: '601888', ratio: 3.80 },
    ],
    pnl: {
      daily:   0.82,
      weekly:  2.15,
      monthly: -1.30,
      quarterly: 5.68,
      yearly:  18.25,
      sinceEstablish: 585.20,
    }
  },
  {
    code: '003834',
    name: '华夏能源革新股票',
    manager: '郑泽鸿',
    type: '股票型',
    riskLevel: 'R5',
    nav: 3.4280,
    navDate: '2026-05-30',
    totalSize: 185.3,
    establishDate: '2017-06-07',
    description: '重点投资于能源革新相关产业链的优质上市公司，分享新能源行业发展红利。',
    holdings: [
      { stockCode: '300750', ratio: 10.20 },
      { stockCode: '002594', ratio: 8.50 },
      { stockCode: '601012', ratio: 7.80 },
      { stockCode: '300274', ratio: 6.40 },
      { stockCode: '002460', ratio: 5.90 },
      { stockCode: '600900', ratio: 5.10 },
      { stockCode: '000001', ratio: 4.20 },
      { stockCode: '601899', ratio: 3.50 },
    ],
    pnl: {
      daily:   1.95,
      weekly:  3.80,
      monthly: 2.45,
      quarterly: -5.20,
      yearly:  12.60,
      sinceEstablish: 242.80,
    }
  },
  {
    code: '161725',
    name: '招商中证白酒指数',
    manager: '侯昊',
    type: '指数型',
    riskLevel: 'R4',
    nav: 1.2850,
    navDate: '2026-05-30',
    totalSize: 420.8,
    establishDate: '2015-05-27',
    description: '跟踪中证白酒指数，投资于白酒行业龙头公司，适合看好白酒赛道的投资者。',
    holdings: [
      { stockCode: '600519', ratio: 15.60 },
      { stockCode: '000858', ratio: 12.30 },
      { stockCode: '000568', ratio: 10.80 },
      { stockCode: '002304', ratio: 9.50 },
      { stockCode: '601888', ratio: 3.20 },
      { stockCode: '601318', ratio: 2.80 },
      { stockCode: '300059', ratio: 1.90 },
      { stockCode: '000001', ratio: 1.50 },
    ],
    pnl: {
      daily:   0.45,
      weekly:  1.20,
      monthly: -2.80,
      quarterly: 3.50,
      yearly:  8.90,
      sinceEstablish: 28.50,
    }
  },
  {
    code: '012414',
    name: '华夏芯片ETF联接',
    manager: '赵宗庭',
    type: '指数型',
    riskLevel: 'R5',
    nav: 1.8560,
    navDate: '2026-05-30',
    totalSize: 95.6,
    establishDate: '2021-06-23',
    description: '跟踪国证芯片指数，投资于半导体产业链核心企业，分享国产替代红利。',
    holdings: [
      { stockCode: '688981', ratio: 11.50 },
      { stockCode: '002049', ratio: 9.20 },
      { stockCode: '603986', ratio: 8.40 },
      { stockCode: '688012', ratio: 7.60 },
      { stockCode: '002475', ratio: 6.80 },
      { stockCode: '000725', ratio: 5.90 },
      { stockCode: '600745', ratio: 5.20 },
      { stockCode: '002456', ratio: 4.50 },
    ],
    pnl: {
      daily:   3.85,
      weekly:  6.20,
      monthly: 8.50,
      quarterly: 12.30,
      yearly:  28.60,
      sinceEstablish: 85.60,
    }
  },
  {
    code: '005827',
    name: '易方达蓝筹精选混合',
    manager: '张坤',
    type: '混合型',
    riskLevel: 'R4',
    nav: 2.1560,
    navDate: '2026-05-30',
    totalSize: 580.2,
    establishDate: '2018-09-05',
    description: '精选A股和港股蓝筹股，追求长期稳健回报，适合价值投资风格。',
    holdings: [
      { stockCode: '600519', ratio: 12.30 },
      { stockCode: '601318', ratio: 8.80 },
      { stockCode: '600036', ratio: 7.50 },
      { stockCode: '000858', ratio: 6.20 },
      { stockCode: '300750', ratio: 5.80 },
      { stockCode: '300760', ratio: 4.50 },
      { stockCode: '002594', ratio: 4.10 },
      { stockCode: '603259', ratio: 3.60 },
    ],
    pnl: {
      daily:   0.65,
      weekly:  1.80,
      monthly: -0.90,
      quarterly: 4.20,
      yearly:  15.80,
      sinceEstablish: 115.60,
    }
  },
  {
    code: '001938',
    name: '中欧时代先锋股票',
    manager: '周应波',
    type: '股票型',
    riskLevel: 'R5',
    nav: 3.8920,
    navDate: '2026-05-30',
    totalSize: 168.5,
    establishDate: '2015-11-03',
    description: '聚焦科技创新和消费升级两大时代主线，投资于具备高成长性的龙头企业。',
    holdings: [
      { stockCode: '002230', ratio: 9.80 },
      { stockCode: '688111', ratio: 8.50 },
      { stockCode: '002475', ratio: 7.20 },
      { stockCode: '002415', ratio: 6.50 },
      { stockCode: '300059', ratio: 5.80 },
      { stockCode: '601888', ratio: 5.10 },
      { stockCode: '002241', ratio: 4.60 },
      { stockCode: '300124', ratio: 3.90 },
    ],
    pnl: {
      daily:   2.30,
      weekly:  4.50,
      monthly: 6.80,
      quarterly: 9.20,
      yearly:  22.40,
      sinceEstablish: 289.20,
    }
  },
  {
    code: '001156',
    name: '申万菱信新能源汽车',
    manager: '任琳娜',
    type: '主题型',
    riskLevel: 'R5',
    nav: 2.0150,
    navDate: '2026-05-30',
    totalSize: 78.9,
    establishDate: '2015-03-19',
    description: '专注新能源汽车产业链投资，覆盖整车、电池、材料等核心环节。',
    holdings: [
      { stockCode: '002594', ratio: 11.50 },
      { stockCode: '300750', ratio: 10.80 },
      { stockCode: '002460', ratio: 8.20 },
      { stockCode: '300274', ratio: 6.50 },
      { stockCode: '601012', ratio: 5.80 },
      { stockCode: '300124', ratio: 4.90 },
      { stockCode: '600745', ratio: 4.20 },
      { stockCode: '000725', ratio: 3.60 },
    ],
    pnl: {
      daily:   1.50,
      weekly:  2.90,
      monthly: -3.50,
      quarterly: -8.20,
      yearly:  5.30,
      sinceEstablish: 101.50,
    }
  },
  {
    code: '162411',
    name: '华宝医疗ETF联接',
    manager: '胡洁',
    type: '指数型',
    riskLevel: 'R4',
    nav: 0.8920,
    navDate: '2026-05-30',
    totalSize: 52.3,
    establishDate: '2015-05-21',
    description: '跟踪中证医疗指数，投资于医疗行业上市公司，分享医疗健康行业发展。',
    holdings: [
      { stockCode: '300760', ratio: 13.50 },
      { stockCode: '603259', ratio: 11.20 },
      { stockCode: '300015', ratio: 9.80 },
      { stockCode: '601318', ratio: 3.50 },
      { stockCode: '000001', ratio: 2.80 },
      { stockCode: '300059', ratio: 2.20 },
      { stockCode: '600036', ratio: 1.90 },
      { stockCode: '600900', ratio: 1.50 },
    ],
    pnl: {
      daily:   -0.35,
      weekly:  -1.20,
      monthly: -5.60,
      quarterly: -12.80,
      yearly:  -18.50,
      sinceEstablish: -10.80,
    }
  },
]

// ─── Helper: enrich holdings with stock data ──────────────────────
export function getFundWithStocks(fundCode) {
  const fund = FUNDS.find(f => f.code === fundCode)
  if (!fund) return null

  return {
    ...fund,
    holdings: fund.holdings.map(h => ({
      ...h,
      stock: STOCKS[h.stockCode],
    })),
  }
}

// ─── Generate NAV history (mock) ──────────────────────────────────
export function generateNavHistory(fundCode, days = 90) {
  const fund = FUNDS.find(f => f.code === fundCode)
  if (!fund) return []

  const history = []
  let nav = fund.nav * 0.92 // start a bit lower
  const now = new Date('2026-05-30')

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    const dailyChange = (Math.random() - 0.48) * 0.03 // slight upward bias
    nav = nav * (1 + dailyChange)

    history.push({
      date: date.toISOString().slice(0, 10),
      nav: Number(nav.toFixed(4)),
    })
  }

  // Make sure the last NAV matches the fund's current NAV
  if (history.length > 0) {
    history[history.length - 1].nav = fund.nav
  }

  return history
}

// ─── Dashboard summary stats ──────────────────────────────────────
export function getDashboardStats() {
  const totalAUM = FUNDS.reduce((sum, f) => sum + f.totalSize, 0)
  const avgReturn = FUNDS.reduce((sum, f) => sum + f.pnl.yearly, 0) / FUNDS.length
  const bestFund = FUNDS.reduce((best, f) => f.pnl.yearly > best.pnl.yearly ? f : best)
  const worstFund = FUNDS.reduce((worst, f) => f.pnl.yearly < worst.pnl.yearly ? f : worst)

  return {
    fundCount: FUNDS.length,
    totalAUM: totalAUM.toFixed(1),
    avgReturn: avgReturn.toFixed(2),
    bestFund: { name: bestFund.name, code: bestFund.code, return: bestFund.pnl.yearly },
    worstFund: { name: worstFund.name, code: worstFund.code, return: worstFund.pnl.yearly },
  }
}
