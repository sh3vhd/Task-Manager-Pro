import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export function auth(req, res, next){
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.replace('Bearer ', '') : null
  if(!token) return res.status(401).json({ message: 'Нет токена' })
  try{
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET)
    req.user = { id: payload.id }
    next()
  }catch(e){
    return res.status(401).json({ message: 'Недействительный токен' })
  }
}
