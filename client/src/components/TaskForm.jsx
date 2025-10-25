import { useEffect, useState } from 'react'

export default function TaskForm({ initial, onSubmit, onCancel }){
  const [title, setTitle] = useState(initial?.title || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [tags, setTags] = useState(initial?.tags?.map(t=>t.name).join(',') || '')
  const [status, setStatus] = useState(initial?.status || 'To Do')

  useEffect(()=>{ setStatus(initial?.status || 'To Do') }, [initial])

  const handleSubmit = (e)=>{
    e.preventDefault()
    onSubmit({ title, description, tags: tags.split(',').map(t=>t.trim()).filter(Boolean), status })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input className="w-full border rounded px-3 py-2" placeholder="Заголовок" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea className="w-full border rounded px-3 py-2" placeholder="Описание" value={description} onChange={e=>setDescription(e.target.value)} />
      <input className="w-full border rounded px-3 py-2" placeholder="Теги через запятую" value={tags} onChange={e=>setTags(e.target.value)} />
      <select className="w-full border rounded px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
        <option>To Do</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>
      <div className="flex gap-2">
        <button className="px-3 py-2 bg-gray-900 text-white rounded">Сохранить</button>
        <button type="button" onClick={onCancel} className="px-3 py-2 border rounded">Отмена</button>
      </div>
    </form>
  )
}
