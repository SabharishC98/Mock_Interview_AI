import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { getHistory } from '../../services/historyService.js';
import InterviewCard from '../../components/InterviewCard/index.jsx';
import './HomePage.css';

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, avgScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory(1, 100)
      .then(data => {
        const all = data.entries;
        const completed = all.filter(i => i.status === 'completed');
        const avgScore = completed.length
          ? Math.round(completed.reduce((s, i) => s + (i.overallScore || 0), 0) / completed.length)
          : 0;
        setStats({ total: all.length, completed: completed.length, avgScore });
        setRecentInterviews(all.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <p className="hero-greeting">{greeting},</p>
          <h1 className="hero-name">{user?.name?.split(' ')[0]} 👋</h1>
          <p className="hero-sub">Ready to sharpen your interview skills?</p>
          <button className="hero-cta" onClick={() => navigate('/setup')}>
            Start new interview <span>→</span>
          </button>
        </div>
        <div className="hero-visual">
          <div className="visual-ring ring-1" />
          <div className="visual-ring ring-2" />
          <div className="visual-ring ring-3" />
          <div className="visual-icon">◈</div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card"><div className="stat-value">{loading ? '—' : stats.total}</div><div className="stat-label">Total interviews</div></div>
        <div className="stat-card"><div className="stat-value">{loading ? '—' : stats.completed}</div><div className="stat-label">Completed</div></div>
        <div className="stat-card stat-score"><div className="stat-value">{loading ? '—' : stats.avgScore ? `${stats.avgScore}%` : '—'}</div><div className="stat-label">Average score</div></div>
      </div>

      <div className="section">
        <div className="section-header">
          <h2>Recent interviews</h2>
          {recentInterviews.length > 0 && <Link to="/history" className="view-all">View all →</Link>}
        </div>
        {loading ? (
          <div className="cards-loading">{[1,2,3].map(i => <div key={i} className="card-skeleton" />)}</div>
        ) : recentInterviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No interviews yet</h3>
            <p>Upload your resume and start practicing with AI Natalie</p>
            <Link to="/setup" className="empty-cta">Get started →</Link>
          </div>
        ) : (
          <div className="interviews-grid">
            {recentInterviews.map(i => <InterviewCard key={i._id} interview={i} />)}
          </div>
        )}
      </div>

      <div className="tips-section">
        <h2>Quick tips</h2>
        <div className="tips-grid">
          <div className="tip-card"><span className="tip-icon">📄</span><div><strong>Upload your resume</strong><p>Natalie tailors every question to your actual experience</p></div></div>
          <div className="tip-card"><span className="tip-icon">🎙</span><div><strong>Speak your answers</strong><p>Voice practice builds real confidence for the actual interview</p></div></div>
          <div className="tip-card"><span className="tip-icon">🔁</span><div><strong>Practice repeatedly</strong><p>Each session generates fresh, unique questions from your profile</p></div></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;