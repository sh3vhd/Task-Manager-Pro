import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const signAccess = (payload)=> jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES })
export const signRefresh = (payload)=> jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES })

export const verifyAccess = (token)=> jwt.verify(token, env.JWT_ACCESS_SECRET)
export const verifyRefresh = (token)=> jwt.verify(token, env.JWT_REFRESH_SECRET)
