'use client'

import { useMemo, useState } from 'react'
import { Check, Circle, ListTodo, Plus, Search, Sparkles, Trash2 } from 'lucide-react'

type Task = {
  id: number
  title: string
  note?: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
}

const starterTasks: Task[] = [
  { id: 1, title: 'Review product roadmap', note: 'Align priorities for the next sprint', completed: false, priority: 'high' },
  { id: 2, title: 'Book dentist appointment', completed: false, priority: 'medium' },
  { id: 3, title: 'Send weekly newsletter', note: 'Include the new customer story', completed: false, priority: 'medium' },
  { id: 4, title: 'Read 20 pages', completed: true, priority: 'low' },
]

function TaskRow({ task, onToggle, onDelete }: { task: Task; onToggle: () => void; onDelete: () => void }) {
  return (
    <li className={`task-row ${task.completed ? 'is-complete' : ''}`}>
      <button className="check-button" onClick={onToggle} aria-label={task.completed ? `Mark ${task.title} incomplete` : `Complete ${task.title}`}>
        {task.completed ? <span className="check-fill"><Check size={14} strokeWidth={3} /></span> : <Circle size={22} strokeWidth={1.6} />}
      </button>
      <div className="task-copy">
        <span className="task-title">{task.title}</span>
        {task.note && <span className="task-note">{task.note}</span>}
      </div>
      <span className={`priority-dot ${task.priority}`} aria-label={`${task.priority} priority`} />
      <button className="delete-button" onClick={onDelete} aria-label={`Delete ${task.title}`}><Trash2 size={17} /></button>
    </li>
  )
}

export default function Page() {
  const [tasks, setTasks] = useState(starterTasks)
  const [newTask, setNewTask] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')
  const [query, setQuery] = useState('')

  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'all' || (filter === 'active' && !task.completed) || (filter === 'done' && task.completed)
    return matchesFilter && task.title.toLowerCase().includes(query.toLowerCase())
  }), [tasks, filter, query])
  const completedCount = tasks.filter((task) => task.completed).length

  function addTask(event: React.FormEvent) {
    event.preventDefault()
    if (!newTask.trim()) return
    setTasks((current) => [{ id: Date.now(), title: newTask.trim(), completed: false, priority: 'medium' }, ...current])
    setNewTask('')
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><ListTodo size={19} /></span><span>daylist</span></div>
        <nav aria-label="Task views">
          <button className={`nav-item ${filter === 'all' ? 'selected' : ''}`} onClick={() => setFilter('all')}><span><ListTodo size={17} /> All tasks</span><b>{tasks.length}</b></button>
          <button className={`nav-item ${filter === 'active' ? 'selected' : ''}`} onClick={() => setFilter('active')}><span><Circle size={17} /> In progress</span><b>{tasks.length - completedCount}</b></button>
          <button className={`nav-item ${filter === 'done' ? 'selected' : ''}`} onClick={() => setFilter('done')}><span><Check size={17} /> Completed</span><b>{completedCount}</b></button>
        </nav>
        <div className="sidebar-bottom"><div className="focus-card"><Sparkles size={18} /><strong>Make space<br />for good work.</strong><span>{completedCount} of {tasks.length} tasks done</span></div><button className="settings-link">Preferences <span>⌘ ,</span></button></div>
      </aside>

      <section className="content-area">
        <header className="topbar"><div className="breadcrumb">My day <span>/</span> Monday, August 17</div><button className="avatar" aria-label="Open profile">JM</button></header>
        <div className="content-wrap">
          <div className="page-heading"><div><p className="eyebrow">GOOD MORNING, JAMIE</p><h1>Today&apos;s focus</h1></div><div className="progress-ring"><span>{Math.round((completedCount / Math.max(tasks.length, 1)) * 100)}%</span><small>complete</small></div></div>
          <form className="add-form" onSubmit={addTask}><Plus size={21} /><input value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Add a task for today..." aria-label="New task" /><button type="submit">Add task <span>↵</span></button></form>
          <div className="toolbar"><div className="filters" role="tablist" aria-label="Filter tasks">{(['all', 'active', 'done'] as const).map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)} role="tab" aria-selected={filter === item}>{item === 'all' ? 'All' : item === 'active' ? 'In progress' : 'Completed'}</button>)}</div><label className="search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks" aria-label="Search tasks" /></label></div>
          <div className="task-list"><div className="list-label"><span>{filter === 'done' ? 'COMPLETED' : 'UP NEXT'}</span><span>{visibleTasks.length} tasks</span></div><ul>{visibleTasks.map((task) => <TaskRow key={task.id} task={task} onToggle={() => setTasks((current) => current.map((item) => item.id === task.id ? { ...item, completed: !item.completed } : item))} onDelete={() => setTasks((current) => current.filter((item) => item.id !== task.id))} />)}</ul>{visibleTasks.length === 0 && <div className="empty-state">No tasks found. Add a little something to your day.</div>}</div>
          <p className="keyboard-hint">Tip: press <kbd>⌘ K</kbd> to quickly add a task</p>
        </div>
      </section>
    </main>
  )
}
