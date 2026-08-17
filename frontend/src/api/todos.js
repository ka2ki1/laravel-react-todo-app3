const API_BASE = 'http://localhost:8000/api';

export async function fetchTodos(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_BASE}/todos?${query}` : `${API_BASE}/todos`;
  const res = await fetch(url);
  return res.json();
}

export async function createTodo(title) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTodo(id) {
  await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
}
