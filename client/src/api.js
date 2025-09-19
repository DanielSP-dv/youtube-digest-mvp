// client/src/api.js
const API_BASE_URL =
  (import.meta?.env?.VITE_API_URL) ||
  (typeof process !== 'undefined' ? process.env?.REACT_APP_API_URL : '') ||
  '';

// small JSON guard so HTML never crashes the app
async function parseJsonOrThrow(res) {
  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    const text = await res.text();
    throw new Error(`Non-JSON ${res.status}: ${text.slice(0,120)}`);
  }
  return res.json();
}

// NAMED exports
export async function get(url) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    headers: { Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseJsonOrThrow(res);
}

export async function post(url, data) {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return parseJsonOrThrow(res);
}

// DEFAULT export for existing imports like `import api from '../api'`
const api = { get, post };
export default api;
