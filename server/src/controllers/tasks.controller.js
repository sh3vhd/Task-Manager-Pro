import { prisma } from '../lib/prisma.js'

// Helper to connect/create tags
async function upsertTags(names){
  const unique = [...new Set((names||[]).map(n=>n.trim()).filter(Boolean))]
  const tags = []
  for(const name of unique){
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name }
    })
    tags.push(tag)
  }
  return tags
}

export const list = async (req, res, next)=>{
  try{
    const userId = req.user.id
    const { q, sort } = req.query
    const where = { userId }
    if(q){
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { tags: { some: { tag: { name: { contains: q, mode: 'insensitive' } } } } }
      ]
    }

    const orderBy = (()=>{
      switch(sort){
        case 'createdAt_asc': return { createdAt: 'asc' }
        case 'title_asc': return { title: 'asc' }
        case 'title_desc': return { title: 'desc' }
        default: return { createdAt: 'desc' }
      }
    })()

    const tasks = await prisma.task.findMany({
      where,
      orderBy,
      include: { tags: { include: { tag: true } } }
    })

    res.json(tasks.map(t=>({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status === 'InProgress' ? 'In Progress' : (t.status === 'ToDo' ? 'To Do' : 'Done'),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      tags: t.tags.map(tt=>({ id: tt.tag.id, name: tt.tag.name }))
    })))
  }catch(e){ next(e) }
}

export const getOne = async (req, res, next)=>{
  try{
    const userId = req.user.id
    const id = Number(req.params.id)
    const t = await prisma.task.findFirst({ where: { id, userId }, include: { tags: { include: { tag: true } } } })
    if(!t) return res.status(404).json({ message: 'Не найдено' })
    res.json({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status === 'InProgress' ? 'In Progress' : (t.status === 'ToDo' ? 'To Do' : 'Done'),
      tags: t.tags.map(tt=>({ id: tt.tag.id, name: tt.tag.name }))
    })
  }catch(e){ next(e) }
}

export const create = async (req, res, next)=>{
  try{
    const userId = req.user.id
    const { title, description, tags = [], status = 'To Do' } = req.body
    const tagRecords = await upsertTags(tags)
    const mappedStatus = status === 'In Progress' ? 'InProgress' : (status === 'To Do' ? 'ToDo' : 'Done')

    const created = await prisma.task.create({
      data: {
        title, description, status: mappedStatus, userId,
        tags: { create: tagRecords.map(tag=>({ tag: { connect: { id: tag.id } } })) }
      },
      include: { tags: { include: { tag: true } } }
    })

    res.status(201).json({ id: created.id })
  }catch(e){ next(e) }
}

export const update = async (req, res, next)=>{
  try{
    const userId = req.user.id
    const id = Number(req.params.id)
    const { title, description, tags = [], status } = req.body
    const tagRecords = await upsertTags(tags)
    const mappedStatus = status ? (status === 'In Progress' ? 'InProgress' : (status === 'To Do' ? 'ToDo' : 'Done')) : undefined

    // Replace tag relations
    await prisma.taskTag.deleteMany({ where: { taskId: id } })

    const updated = await prisma.task.update({
      where: { id },
      data: {
        title, description, status: mappedStatus,
        tags: { create: tagRecords.map(tag=>({ tagId: tag.id })) }
      }
    })

    res.json({ ok: true })
  }catch(e){ next(e) }
}

export const remove = async (req, res, next)=>{
  try{
    const userId = req.user.id
    const id = Number(req.params.id)
    await prisma.task.delete({ where: { id } })
    res.json({ ok: true })
  }catch(e){ next(e) }
}
