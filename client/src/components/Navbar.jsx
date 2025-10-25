import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import API from '../api/axios'

export default function Navbar(){
  const { token, setToken } = useAuth()
  const navigate = useNavigate()

  const logout = async ()=>{
    try{ await API.post('/auth/logout'); setToken(null); navigate('/login') }catch(e){ console.error(e) }
  }

  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Task Manager Pro</Link>
        <nav className="flex gap-4 text-sm">
          {token ? (
            <button onClick={logout} className="px-3 py-1 rounded bg-gray-900 text-white">Выйти</button>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Вход</Link>
              <Link to="/register" className="hover:underline">Регистрация</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
