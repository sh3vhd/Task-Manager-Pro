import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { env } from '../config/env.js'
import { signAccess, signRefresh, verifyRefresh } from '../utils/tokens.js'

export const register = async (req, res, next)=>{
  try{
    const { name, email, password } = req.body
    if(!name || !email || !password) return res.status(400).json({ message: 'Заполните все поля' })
    const exists = await prisma.user.findUnique({ where: { email } })
    if(exists) return res.status(409).json({ message: 'Email уже используется' })

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { name, email, password: hash }})
    res.status(201).json({ id: user.id, email: user.email })
  }catch(e){ next(e) }
}

export const login = async (req, res, next)=>{
  try{
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if(!user) return res.status(401).json({ message: 'Неверные учетные данные' })
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({ message: 'Неверные учетные данные' })

    const accessToken = signAccess({ id: user.id })
    const refreshToken = signRefresh({ id: user.id })

    await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id }})

    res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: false, // set true behind HTTPS/proxy in prod
      sameSite: 'lax',
      path: '/api/auth'
    })
    res.json({ accessToken })
  }catch(e){ next(e) }
}

export const refresh = async (req, res, next)=>{
  try{
    const token = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME]
    if(!token) return res.status(401).json({ message: 'Нет refresh токена' })

    // check token presence in DB (allow revoke)
    const exists = await prisma.refreshToken.findUnique({ where: { token } })
    if(!exists) return res.status(401).json({ message: 'Токен отозван' })

    const payload = verifyRefresh(token)
    const accessToken = signAccess({ id: payload.id })
    res.json({ accessToken })
  }catch(e){ next(e) }
}

export const logout = async (req, res, next)=>{
  try{
    const token = req.cookies[env.REFRESH_TOKEN_COOKIE_NAME]
    if(token){
      await prisma.refreshToken.deleteMany({ where: { token } })
    }
    res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, { path: '/api/auth' })
    res.json({ ok: true })
  }catch(e){ next(e) }
}
