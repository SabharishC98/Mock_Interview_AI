import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getInterview } from '../../services/interviewService.js';
import ScoreCard from '../../components/ScoreCard/index.jsx';
import toast from 'react-hot-toast';
import './FeedbackPage.css';

function FeedbackPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterview(id)
      .then(data => {
        if (!data.feedback) { toast.error('No feedback yet'); navigate('/'); return; }
        setInterview(data);
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="feedback-loading"><div className="spinner" /></div>;
  if (!interview) return null;

  const { feedback, role, overallScore } = interview;
  const categories = feedback?.categories || {};

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <div>
            <div className="feedback-role">{role} Interview</div>
            <h1>Your feedback report</h1>
          </div>
          <div className="overall-score">
            <div className="big-score">{overallScore || feedback?.overallScore || 0}</div>
            <div className="big-score-label">Overall score</div>
          </div>
        </div>

        <div className="scores-grid">
          {Object.entries(categories).map(([key, val]) => (
            <ScoreCard key={key} category={key} score={val?.score || 0} comment={val?.comment} />
          ))}
        </div>

        {feedback?.strengths?.length > 0 && (
          <div className="feedback-section strengths">
            <h2>✨ Strengths</h2>
            <ul>
              {feedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>
        )}

        {feedback?.areasForImprovement?.length > 0 && (
          <div className="feedback-section improvements">
            <h2>🎯 Areas to improve</h2>
            <ul>
              {feedback.areasForImprovement.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {feedback?.finalAssessment && (
          <div className="feedback-section assessment">
            <h2>📋 Final assessment</h2>
            <p>{feedback.finalAssessment}</p>
          </div>
        )}

        <div className="feedback-actions">
          <Link to="/setup" className="action-btn primary">Practice again →</Link>
          <Link to="/history" className="action-btn secondary">View history</Link>
        </div>
      </div>
    </div>
  );
}
export default FeedbackPage;