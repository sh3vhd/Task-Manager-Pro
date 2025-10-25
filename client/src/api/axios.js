import axios from 'axios'

const API = axios.create({
  baseURL: '/api',
  withCredentials: true // allow cookies for refresh token
})

// Attach access token from localStorage
API.interceptors.request.use((config)=>{
  const token = localStorage.getItem('access_token')
  if(token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto refresh on 401
let refreshing = false
let queue = []

API.interceptors.response.use(
  (res)=>res,
  async (err)=>{
    const original = err.config
    if(err.response?.status === 401 && !original._retry){
      original._retry = true
      if(refreshing){
        await new Promise(resolve=>queue.push(resolve))
      }
      try{
        refreshing = true
        await axios.post('/api/auth/refresh', {}, { withCredentials: true })
          .then(({data})=>{
            localStorage.setItem('access_token', data.accessToken)
          })
        queue.forEach(fn=>fn())
        queue = []
        return API(original)
      } catch(e){
        localStorage.removeItem('access_token')
        window.location.href = '/login'
        return Promise.reject(e)
      } finally { refreshing = false }
    }
    return Promise.reject(err)
  }
)

export default API
