import axios from 'axios'

const api = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
)

// 响应拦截器 - 直接返回 data
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.detail || '请求失败'
    console.error('API Error:', message)
    return Promise.reject(error)
  }
)

export default api
