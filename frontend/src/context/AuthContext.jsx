import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService.js';
const AuthContext = createContext(null);
const STORAGE_KEY = 'lms_auth';
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [token, setToken] = useState(null); const [loading, setLoading] = useState(true);
  const saveAuth = (data) => { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); setToken(data.token); setUser(data.user); return data.user; };
  const logout = () => { localStorage.removeItem(STORAGE_KEY); setToken(null); setUser(null); };
  useEffect(() => { const restore = async () => { const saved = localStorage.getItem(STORAGE_KEY); if (!saved) return setLoading(false); try { const auth = JSON.parse(saved); const data = await getCurrentUser(auth.token); setToken(auth.token); setUser(data.user); } catch { logout(); } finally { setLoading(false); } }; restore(); }, []);
  const login = async (values) => saveAuth(await loginUser(values)); const register = async (role, values) => saveAuth(await registerUser(role, values));
  return <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used inside AuthProvider.'); return context; };