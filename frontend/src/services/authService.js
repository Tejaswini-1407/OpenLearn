const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json', ...options.headers }, ...options });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed.');
  return data;
};
export const registerUser = (role, values) => request(`/auth/register/${role}`, { method: 'POST', body: JSON.stringify(values) });
export const loginUser = (values) => request('/auth/login', { method: 'POST', body: JSON.stringify(values) });
export const getCurrentUser = (token) => request('/auth/me', { headers: { Authorization: `Bearer ${token}` } });