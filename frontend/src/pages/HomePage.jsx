import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

function HomePage() {
  const { user, loading, logout } = useAuth();
  if (loading) return <main className="loading-screen">Restoring your session…</main>;
  const dashboardPath = user ? `/${user.role}/dashboard` : null;

  return <main className="landing-page">
    <nav className="site-nav" aria-label="Main navigation">
      <Link className="brand" to="/"><span className="brand-mark">OL</span><span>OpenLearn</span></Link>
      {user ? <div className="nav-actions"><Link className="text-link" to={dashboardPath}>Dashboard</Link><button className="button button-outline" onClick={logout}>Log out</button></div> : <Link className="text-link" to="/login">Log in</Link>}
    </nav>
    <section className="hero">
      <p className="eyebrow">ONLINE LEARNING PLATFORM</p>
      <h1>Learn confidently. Teach brilliantly.</h1>
      <p className="hero-copy">A simple place for students to grow their skills and faculty to share knowledge.</p>
      {user ? <Link className="button button-primary" to={dashboardPath}>Go to your dashboard</Link> : <div className="hero-actions"><Link className="button button-primary" to="/login">Student Login</Link><Link className="button button-secondary" to="/login">Faculty Login</Link></div>}
    </section>
    {!user && <section className="role-section" aria-label="Create an account"><div><p className="eyebrow">GET STARTED</p><h2>Join OpenLearn today</h2><p>Choose the account type that fits how you use the platform.</p></div><div className="role-cards"><Link className="role-card" to="/register/student"><span className="card-icon">S</span><span><strong>Student Registration</strong><small>Explore and learn at your pace</small></span><span aria-hidden="true">?</span></Link><Link className="role-card" to="/register/faculty"><span className="card-icon faculty-icon">F</span><span><strong>Faculty Registration</strong><small>Prepare to share your expertise</small></span><span aria-hidden="true">?</span></Link></div></section>}
  </main>;
}
export default HomePage;