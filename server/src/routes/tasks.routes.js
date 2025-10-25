import { Router } from 'express'
import { auth } from '../middleware/auth.js'
import { list, getOne, create, update, remove } from '../controllers/tasks.controller.js'

const r = Router()

r.use(auth)

r.get('/', list)
r.get('/:id', getOne)
r.post('/', create)
r.put('/:id', update)
r.delete('/:id', remove)

export default r
