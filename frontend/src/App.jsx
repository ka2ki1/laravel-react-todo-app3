import { useEffect, useState } from 'react'
import { fetchTodos, createTodo, updateTodo, deleteTodo, bulkDeleteTodos } from './api/todos'

const CATEGORIES = ['仕事', 'プライベート', '買い物', 'その他']

const CATEGORY_COLORS = {
  '仕事': 'bg-blue-100 text-blue-700',
  'プライベート': 'bg-purple-100 text-purple-700',
  '買い物': 'bg-green-100 text-green-700',
  'その他': 'bg-gray-100 text-gray-700',
}

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [error, setError] = useState('')
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    loadTodos()
  }, [search, status, categoryFilter])

  async function loadTodos() {
    try {
      const params = {}
      if (search) params.search = search
      if (status !== 'all') params.status = status
      if (categoryFilter !== 'all') params.category = categoryFilter
      const data = await fetchTodos(params)
      setTodos(data)
      setSelectedIds([])
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    if (!title.trim()) {
      setError('タイトルを入力してください')
      return
    }
    try {
      await createTodo(title, dueDate, category)
      setTitle('')
      setDueDate('')
      setCategory('')
      loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleToggle(todo) {
    setError('')
    try {
      await updateTodo(todo.id, { is_done: !todo.is_done })
      loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    setError('')
    try {
      await deleteTodo(id)
      loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function toggleSelectAll() {
    if (selectedIds.length === todos.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(todos.map((t) => t.id))
    }
  }

  function toggleSelectionMode() {
    setSelectionMode((prev) => !prev)
    setSelectedIds([])
  }

  async function handleBulkDelete() {
    setError('')
    if (selectedIds.length === 0) return
    if (!window.confirm(`選択した${selectedIds.length}件を削除しますか？`)) return
    try {
      await bulkDeleteTodos(selectedIds)
      setSelectionMode(false)
      loadTodos()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-slate-800">ToDoリスト</h1>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <form
          onSubmit={handleAdd}
          className="mb-6 flex flex-wrap gap-2 rounded-xl bg-white p-4 shadow-sm"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="やることを入力"
            className="min-w-[160px] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="">カテゴリなし</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            追加
          </button>
        </form>

        <div className="mb-4 flex flex-wrap gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タイトルで検索"
            className="min-w-[160px] flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="all">すべて</option>
            <option value="undone">未完了</option>
            <option value="done">完了</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="all">すべてのカテゴリ</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {todos.length > 0 && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-white px-4 py-2 shadow-sm">
            {selectionMode ? (
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={selectedIds.length === todos.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
                />
                すべて選択（{selectedIds.length}件選択中）
              </label>
            ) : (
              <span className="text-sm text-slate-400">
                チェックで完了/未完了を切り替え
              </span>
            )}

            <div className="flex gap-2">
              {selectionMode && (
                <button
                  onClick={handleBulkDelete}
                  disabled={selectedIds.length === 0}
                  className="rounded-lg bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                >
                  選択した項目を削除
                </button>
              )}
              <button
                onClick={toggleSelectionMode}
                className={
                  selectionMode
                    ? 'rounded-lg bg-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-300'
                    : 'rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200'
                }
              >
                {selectionMode ? '選択をやめる' : '選択して削除'}
              </button>
            </div>
          </div>
        )}

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <label className="flex flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectionMode ? selectedIds.includes(todo.id) : todo.is_done}
                  onChange={() =>
                    selectionMode ? toggleSelect(todo.id) : handleToggle(todo)
                  }
                  className={
                    selectionMode
                      ? 'h-5 w-5 rounded border-slate-300 text-red-500 focus:ring-red-400'
                      : 'h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-400'
                  }
                />
                <span
                  className={
                    !selectionMode && todo.is_done
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800'
                  }
                >
                  {todo.title}
                </span>
              </label>

              <div className="flex items-center gap-2">
                {todo.category && (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${CATEGORY_COLORS[todo.category] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {todo.category}
                  </span>
                )}
                {todo.due_date && (
                  <span className="text-xs text-slate-400">
                    期限: {todo.due_date.slice(0, 10)}
                  </span>
                )}
                {!selectionMode && (
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="rounded-lg px-2 py-1 text-sm text-red-500 transition hover:bg-red-50"
                  >
                    削除
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="mt-8 text-center text-sm text-slate-400">
            Todoがありません。追加してみましょう。
          </p>
        )}
      </div>
    </div>
  )
}

export default App
