import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    try{
      const { data } = await API.post('/auth/login', { email, password })
      localStorage.setItem('access_token', data.accessToken)
      navigate('/')
    }catch(err){ setError(err.response?.data?.message || 'Ошибка входа') }
  }

  return (
    <div className="max-w-md mx-auto mt-10 card rounded-xl p-6 border bg-white">
      <h1 className="text-xl font-semibold mb-4">Вход</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Пароль" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full px-3 py-2 bg-gray-900 text-white rounded">Войти</button>
      </form>
      <p className="text-sm mt-3">Нет аккаунта? <Link to="/register" className="underline">Зарегистрироваться</Link></p>
    </div>
  )
}
