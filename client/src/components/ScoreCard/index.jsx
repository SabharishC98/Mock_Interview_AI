import './ScoreCard.css';

const COLOR_MAP = {
  technicalKnowledge: '#a78bfa',
  problemSolving: '#34d399',
  communication: '#60a5fa',
  codeQuality: '#fbbf24',
  behavioralFit: '#f472b6',
};

const LABEL_MAP = {
  technicalKnowledge: 'Technical Knowledge',
  problemSolving: 'Problem Solving',
  communication: 'Communication',
  codeQuality: 'Code Quality',
  behavioralFit: 'Behavioural Fit',
};

function ScoreCard({ category, score, comment }) {
  const color = COLOR_MAP[category] || '#a78bfa';
  const label = LABEL_MAP[category] || category;

  return (
    <div className="score-card">
      <div className="score-top">
        <span className="score-label">{label}</span>
        <span className="score-value" style={{ color }}>
          {score}<span className="score-max">/100</span>
        </span>
      </div>
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${score}%`, background: color }} />
      </div>
      {comment && <p className="score-comment">{comment}</p>}
    </div>
  );
}

export default ScoreCard;