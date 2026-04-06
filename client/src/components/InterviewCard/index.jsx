import { useNavigate } from 'react-router-dom';
import './InterviewCard.css';

function InterviewCard({ interview, onDelete }) {
  const navigate = useNavigate();
  const date = new Date(interview.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });

  const handleClick = () => {
    if (interview.status === 'completed') navigate(`/feedback/${interview._id}`);
    else navigate(`/interview/${interview._id}`);
  };

  return (
    <div className="interview-card" onClick={handleClick}>
      <div className="card-top">
        <div className="card-role">{interview.role}</div>
        <span className={`card-status ${interview.status}`}>
          {interview.status === 'completed' ? '✓ Done' : '▶ In progress'}
        </span>
      </div>
      <div className="card-meta">
        <span>{date}</span>
        <span>{interview.totalQuestions} questions</span>
      </div>
      {interview.status === 'completed' && interview.overallScore != null && (
        <div className="card-score">
          <div className="score-ring" style={{ '--score': interview.overallScore }}>
            <span>{interview.overallScore}</span>
          </div>
          <span className="score-text">Overall score</span>
        </div>
      )}
      {onDelete && (
        <button className="card-delete" onClick={e => { e.stopPropagation(); onDelete(interview._id); }}>
          ✕
        </button>
      )}
    </div>
  );
}
export default InterviewCard;