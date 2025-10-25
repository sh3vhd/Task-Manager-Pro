import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/tasks.routes.js'
import { errorHandler } from './middleware/error.js'

const app = express()

app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))

app.get('/api/health', (req,res)=>res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use(errorHandler)

export default app
