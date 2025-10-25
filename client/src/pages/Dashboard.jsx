import { useEffect, useMemo, useState } from 'react'
import API from '../api/axios'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'

export default function Dashboard(){
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState('createdAt_desc')
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const fetchTasks = async ()=>{
    const params = {}
    if(filter) params.q = filter
    if(sort) params.sort = sort
    const { data } = await API.get('/tasks', { params })
    setTasks(data)
  }

  useEffect(()=>{ fetchTasks() }, [filter, sort])

  const grouped = useMemo(()=>({
    'To Do': tasks.filter(t=>t.status==='To Do'),
    'In Progress': tasks.filter(t=>t.status==='In Progress'),
    'Done': tasks.filter(t=>t.status==='Done')
  }), [tasks])

  const create = async (payload)=>{
    await API.post('/tasks', payload)
    setShowForm(false)
    await fetchTasks()
  }
  const update = async (id, payload)=>{
    await API.put(`/tasks/${id}`, payload)
    setEditing(null)
    await fetchTasks()
  }
  const remove = async (id)=>{
    await API.delete(`/tasks/${id}`)
    await fetchTasks()
  }
  const toggle = async (task)=>{
    const status = task.status === 'Done' ? 'To Do' : 'Done'
    await update(task.id, { ...task, tags: task.tags?.map(t=>t.name)||[], status })
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <input className="border rounded px-3 py-2 w-full" placeholder="Фильтр по названию/тегам" value={filter} onChange={e=>setFilter(e.target.value)} />
        <select className="border rounded px-3 py-2" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="createdAt_desc">Новые</option>
          <option value="createdAt_asc">Старые</option>
          <option value="title_asc">Заголовок A→Z</option>
          <option value="title_desc">Заголовок Z→A</option>
        </select>
        <button onClick={()=>{ setEditing(null); setShowForm(true) }} className="px-3 py-2 rounded bg-gray-900 text-white">+ Задача</button>
      </div>

      {showForm && (
        <div className="mb-6 card rounded-xl p-4 border bg-white">
          <h3 className="font-semibold mb-2">Новая задача</h3>
          <TaskForm onSubmit={create} onCancel={()=>setShowForm(false)} />
        </div>
      )}

      {editing && (
        <div className="mb-6 card rounded-xl p-4 border bg-white">
          <h3 className="font-semibold mb-2">Редактировать задачу</h3>
          <TaskForm initial={editing} onSubmit={(p)=>update(editing.id, p)} onCancel={()=>setEditing(null)} />
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {Object.entries(grouped).map(([status, list])=> (
          <section key={status} className="bg-gray-50 border rounded-xl p-3">
            <h2 className="font-semibold mb-3">{status}</h2>
            <div className="space-y-3">
              {list.map(task=> (
                <TaskCard key={task.id} task={task} onEdit={setEditing} onDelete={remove} onToggle={toggle} />
              ))}
              {list.length===0 && <p className="text-sm text-gray-500">Нет задач</p>}
            </div>
          </section>
        ))}
      </div>
    </div>
  )}
