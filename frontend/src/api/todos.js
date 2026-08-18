const API_BASE = `http://${window.location.hostname}:8000/api`;

async function handleResponse(res) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || 'エラーが発生しました');
  }
  return res.json();
}

export async function fetchTodos(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${API_BASE}/todos?${query}` : `${API_BASE}/todos`;
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createTodo(title) {
  const res = await fetch(`${API_BASE}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function updateTodo(id, data) {
  const res = await fetch(`${API_BASE}/todos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteTodo(id) {
  const res = await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error('削除に失敗しました');
  }
}
