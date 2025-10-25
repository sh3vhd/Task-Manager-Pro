import { createBrowserRouter } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

export const router = createBrowserRouter([
  { path: '/', element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <NotFound /> }
])
