export default function TaskCard({ task, onEdit, onDelete, onToggle }){
  return (
    <div className="card rounded-xl p-3 border flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">{task.title}</h4>
        <div className="text-xs px-2 py-0.5 rounded bg-gray-100 border">{task.status}</div>
      </div>
      {task.description && <p className="text-sm text-gray-600 whitespace-pre-wrap">{task.description}</p>}
      <div className="flex flex-wrap gap-2">
        {task.tags?.map(t=> (
          <span key={t.id} className="text-xs px-2 py-0.5 bg-gray-100 rounded border">#{t.name}</span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={()=>onToggle(task)} className="px-2 py-1 rounded border">{task.status === 'Done' ? '↩︎ В работу' : '✓ Выполнено'}</button>
        <button onClick={()=>onEdit(task)} className="px-2 py-1 rounded border">Редактировать</button>
        <button onClick={()=>onDelete(task.id)} className="px-2 py-1 rounded border text-red-600">Удалить</button>
      </div>
    </div>
  )
}
