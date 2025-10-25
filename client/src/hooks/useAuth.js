import { useEffect, useState } from 'react'

export default function useAuth(){
  const [token, setToken] = useState(()=>localStorage.getItem('access_token'))
  useEffect(()=>{
    const handler = ()=>setToken(localStorage.getItem('access_token'))
    window.addEventListener('storage', handler)
    return ()=>window.removeEventListener('storage', handler)
  },[])
  return { token, setToken: (t)=>{
    if(!t) localStorage.removeItem('access_token'); else localStorage.setItem('access_token', t)
    setToken(t)
  }}
}
