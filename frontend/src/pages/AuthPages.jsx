import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function AuthPage({ mode, role }) {
  const isRegistering = mode === 'register';
  const { user, loading, login, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (loading) return <main className="loading-screen">Checking your session…</main>;
  if (user) return <Navigate to={`/${user.role}/dashboard`} replace />;
  const updateField = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => { event.preventDefault(); setError(''); setSubmitting(true); try { const signedInUser = isRegistering ? await register(role, form) : await login({ email: form.email, password: form.password }); navigate(`/${signedInUser.role}/dashboard`, { replace: true }); } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); } };
  const heading = isRegistering ? `Create your ${role} account` : 'Welcome back';
  return <main className="auth-page"><Link className="brand auth-brand" to="/"><span className="brand-mark">OL</span><span>OpenLearn</span></Link><section className="auth-layout"><aside className="auth-intro"><p className="eyebrow">{isRegistering ? 'START LEARNING' : 'SIGN IN TO CONTINUE'}</p><h1>{isRegistering ? 'Your learning journey starts here.' : 'Continue your learning journey.'}</h1><p>Secure access to your personalized OpenLearn experience.</p></aside><form className="auth-card" onSubmit={submit}><div><p className="form-kicker">{isRegistering ? role : 'OpenLearn account'}</p><h2>{heading}</h2><p className="form-subtitle">{isRegistering ? 'Use your details to get started.' : 'Enter your account details below.'}</p></div>{error && <p className="error-message" role="alert">{error}</p>}{isRegistering && <label>Full name<input name="name" autoComplete="name" required value={form.name} onChange={updateField} /></label>}<label>Email address<input name="email" type="email" autoComplete="email" required value={form.email} onChange={updateField} /></label><label>Password<input name="password" type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} required minLength="6" value={form.password} onChange={updateField} /><small>At least 6 characters</small></label><button className="button button-primary form-submit" disabled={submitting}>{submitting ? 'Please wait…' : isRegistering ? 'Create account' : 'Log in'}</button>{isRegistering ? <p className="form-footer">Already have an account? <Link to="/login">Log in</Link></p> : <p className="form-footer">New to OpenLearn? <Link to="/register/student">Register as student</Link> or <Link to="/register/faculty">faculty</Link>.</p>}</form></section></main>;
}
export const LoginPage = () => <AuthPage mode="login" />;
export const StudentRegisterPage = () => <AuthPage mode="register" role="student" />;
export const FacultyRegisterPage = () => <AuthPage mode="register" role="faculty" />;