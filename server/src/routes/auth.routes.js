import { Router } from 'express'
import { login, register, refresh, logout } from '../controllers/auth.controller.js'

const r = Router()

r.post('/register', register)
r.post('/login', login)
r.post('/refresh', refresh)
r.post('/logout', logout)

export default r
