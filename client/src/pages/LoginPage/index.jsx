import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';
import './LoginPage.css';

function LoginPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="login-bg-orb orb-1" />
        <div className="login-bg-orb orb-2" />
        <div className="login-bg-grid" />
      </div>
      <div className="login-card">
        <div className="login-header">
          <span className="login-icon">◈</span>
          <h1>InterviewAI</h1>
          <p>Practice with an AI interviewer, get real feedback</p>
        </div>
        <div className="login-tabs">
          <button className={`tab-btn ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign in</button>
          <button className={`tab-btn ${mode === 'register' ? 'active' : ''}`} onClick={() => setMode('register')}>Create account</button>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full name</label>
              <input name="name" type="text" placeholder="Alex Johnson" value={form.name} onChange={handleChange} required />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" placeholder="alex@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <span className="btn-spinner" /> : mode === 'login' ? 'Sign in →' : 'Create account →'}
          </button>
        </form>
        <div className="login-features">
          <div className="feature-item"><span>🎙</span><span>Voice-based interviews</span></div>
          <div className="feature-item"><span>💻</span><span>Live coding challenges</span></div>
          <div className="feature-item"><span>📊</span><span>Detailed AI feedback</span></div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;