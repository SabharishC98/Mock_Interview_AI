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
  const firstName = user?.name?.trim().split(' ')[0] || 'there';

  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-content">
          <p className="hero-eyebrow">YOUR INTERVIEW PRACTICE</p>
          <p className="hero-greeting">{greeting}, {firstName}</p>
          <h1 className="hero-name" id="home-title">Make your next interview feel familiar.</h1>
          <p className="hero-sub">Practice out loud, work through real questions, and get clear feedback on what to improve.</p>
          <button className="hero-cta" onClick={() => navigate('/setup')}>
            Start a practice session <span aria-hidden="true">→</span>
          </button>
        </div>
        <aside className="hero-note" aria-label="Practice session details">
          <div className="note-topline"><span className="note-mark" aria-hidden="true">01</span><span>THE PRACTICE LOOP</span></div>
          <div className="practice-steps">
            <div><span className="practice-index">1</span><span>Choose a role</span></div>
            <div><span className="practice-index">2</span><span>Answer at your pace</span></div>
            <div><span className="practice-index">3</span><span>Review specific feedback</span></div>
          </div>
          <p className="note-caption">One focused session at a time.</p>
        </aside>
      </section>

      <section className="stats-row" aria-label="Your practice summary">
        <div className="stat-card"><div className="stat-value">{loading ? '—' : stats.total}</div><div className="stat-label">Sessions started</div></div>
        <div className="stat-card"><div className="stat-value">{loading ? '—' : stats.completed}</div><div className="stat-label">Sessions completed</div></div>
        <div className="stat-card stat-score"><div className="stat-value">{loading ? '—' : stats.avgScore ? `${stats.avgScore}%` : '—'}</div><div className="stat-label">Average score</div></div>
      </section>

      <section className="section" aria-labelledby="recent-title">
        <div className="section-header">
          <div><p className="section-kicker">KEEP YOUR MOMENTUM</p><h2 id="recent-title">Recent sessions</h2></div>
          {recentInterviews.length > 0 && <Link to="/history" className="view-all">View history <span aria-hidden="true">→</span></Link>}
        </div>
        {loading ? (
          <div className="cards-loading">{[1, 2, 3].map(i => <div key={i} className="card-skeleton" />)}</div>
        ) : recentInterviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-index" aria-hidden="true">01</div>
            <div><h3>Your first session starts here</h3><p>Choose a role, add your resume, and practise with questions shaped around your experience.</p></div>
            <Link to="/setup" className="empty-cta">Set up a session <span aria-hidden="true">→</span></Link>
          </div>
        ) : (
          <div className="interviews-grid">
            {recentInterviews.map(i => <InterviewCard key={i._id} interview={i} />)}
          </div>
        )}
      </section>

      <section className="tips-section" aria-labelledby="tips-title">
        <div className="section-header"><div><p className="section-kicker">A BETTER PRACTICE SESSION</p><h2 id="tips-title">A few things that help</h2></div></div>
        <div className="tips-grid">
          <div className="tip-card"><span className="tip-index">01</span><div><strong>Start with your resume</strong><p>Your experience gives the interviewer useful context for relevant follow-up questions.</p></div></div>
          <div className="tip-card"><span className="tip-index">02</span><div><strong>Answer out loud</strong><p>Speaking helps you practise explaining your thinking clearly, not just recalling facts.</p></div></div>
          <div className="tip-card"><span className="tip-index">03</span><div><strong>Use the feedback</strong><p>Pick one specific improvement and carry it into your next practice round.</p></div></div>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
