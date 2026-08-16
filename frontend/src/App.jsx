import { useEffect, useState } from 'react'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from './api/todos'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    loadTodos()
  }, [])

  async function loadTodos() {
    const data = await fetchTodos()
    setTodos(data)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!title.trim()) return
    await createTodo(title)
    setTitle('')
    loadTodos()
  }

  async function handleToggle(todo) {
    await updateTodo(todo.id, { is_done: !todo.is_done })
    loadTodos()
  }

  async function handleDelete(id) {
    await deleteTodo(id)
    loadTodos()
  }

  return (
    <div className="todo-app">
      <h1>ToDoリスト</h1>

      <form onSubmit={handleAdd}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="やることを入力"
        />
        <button type="submit">追加</button>
      </form>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.is_done}
                onChange={() => handleToggle(todo)}
              />
              <span style={{ textDecoration: todo.is_done ? 'line-through' : 'none' }}>
                {todo.title}
              </span>
            </label>
            <button onClick={() => handleDelete(todo.id)}>削除</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
